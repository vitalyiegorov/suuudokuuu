import { randomBytes } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { createAgentDeviceClient } from 'agent-device';

import { startBootRelay, type BootRelay } from './relay.ts';

import type { DeviceLease, DeviceProvider, DeviceRequest } from '@e2e-dev/mobile';

/** Where a simlock worker (or gateway) answers, and the agent token the run leases with. */
export interface SimlockOptions {
    /** `http://10.10.1.28:4701`: the worker's HTTP address, without `/v1`. */
    readonly url: string;
    readonly token: string;
    /** A model simlock's catalog lists: `iPhone 17 Pro`. */
    readonly device: string;
    /** Apps installed on every leased device after the app under test, such as `E2E_DROP_APP`. */
    readonly extraApps?: readonly string[];
    /**
     * Lease TTL, renewed every third of it while the run holds the lease. Short on purpose: a
     * run killed before it releases (a cancelled CI job) frees its simulator within one TTL.
     */
    readonly ttlMs?: number;
    /**
     * Uploads in flight at once. Each one carries the whole app through the gateway, and a
     * request through the public Cloudflare tunnel that runs past 100 s ends in a 524: ten
     * at once on a busy farm did, so the run uploads a few at a time.
     */
    readonly installConcurrency?: number;
}

/** A counting semaphore: `run` waits until fewer than `limit` calls are in flight. */
function limiter(limit: number): <T>(work: () => Promise<T>) => Promise<T> {
    let active = 0;
    const waiting: (() => void)[] = [];
    return async work => {
        while (active >= limit) {
            await new Promise<void>(resolve => waiting.push(resolve));
        }
        active += 1;
        try {
            return await work();
        } finally {
            active -= 1;
            waiting.shift()?.();
        }
    };
}

interface Held extends DeviceLease {
    readonly stop: () => void;
    readonly scope: {
        tenant: string;
        runId: string;
        leaseId: string;
        leaseBackend: 'ios-instance';
        leaseProvider: 'proxy';
        clientId: string;
        deviceKey?: string;
    };
}

const TENANT = 'budgie-e2e';

/** A leased device that could not be set up (an app install failed): another device may well succeed. */
class DeviceSetupFailed extends Error {}

/** Errors that mean the farm, not one simulator, failed (simlock's gateway and agent-device wording). */
const FARM_DOWN =
    /not connected to the gateway|no worker connected|Remote daemon is unavailable|ECONNREFUSED|ETIMEDOUT|fetch failed|error code: 52\d/i;

/**
 * Leases one simulator per worker slot from a simlock worker through its
 * agent-device proxy (`/v1/agent-device`): the run drives the device from
 * this machine, Linux included, and the app is uploaded, not copied to the
 * worker. Every slot holds its own lease; release hands it back and simlock
 * wipes the device for the next one.
 */
export function simlockDevices(options: SimlockOptions): DeviceProvider {
    const baseUrl = `${options.url.replace(/\/$/, '')}/v1/agent-device`;
    const ttlMs = options.ttlMs ?? 3 * 60_000;
    const held = new Map<string, Held>();
    const uploads = limiter(Math.max(1, options.installConcurrency ?? 3));
    let relay: Promise<BootRelay> | undefined;

    const client = (session: string) => createAgentDeviceClient({ daemonBaseUrl: baseUrl, daemonAuthToken: options.token, session });
    const startRelay = (): Promise<BootRelay> => {
        relay ??= startBootRelay(baseUrl).catch((cause: unknown) => {
            relay = undefined;
            throw cause;
        });
        return relay;
    };

    /**
     * Every lease id this run acquired, in `.e2e/simlock-leases.json`: mobile-ci's e2e job
     * releases them in an `if: always()` step, so a run killed mid-way still frees the farm.
     */
    const recordLease = (projectRoot: string, id: string): void => {
        const file = join(projectRoot, '.e2e', 'simlock-leases.json');
        let ids: string[] = [];
        try {
            ids = JSON.parse(readFileSync(file, 'utf8')) as string[];
        } catch {
            ids = [];
        }
        mkdirSync(join(projectRoot, '.e2e'), { recursive: true });
        writeFileSync(file, JSON.stringify([...new Set([...ids, id])]));
    };

    const leaseOnce = async (request: DeviceRequest, attempt: number): Promise<DeviceLease> => {
        const session = `e2e-${request.runId.slice(0, 12)}-${request.slot}${attempt === 0 ? '' : `-r${attempt}`}`;
        const started = Date.now();
        const scopeBase = {
            tenant: TENANT,
            runId: request.runId,
            leaseBackend: 'ios-instance' as const,
            leaseProvider: 'proxy' as const
        };
        const c = client(session);
        const clientId = randomBytes(8).toString('hex');
        const lease = await c.leases.allocate({
            ...scopeBase,
            clientId,
            leaseId: randomBytes(16).toString('hex'),
            ttlMs,
            platform: 'ios',
            target: 'mobile',
            device: options.device
        });
        const scope = {
            ...scopeBase,
            leaseId: lease.leaseId,
            clientId: lease.clientId ?? clientId,
            ...(lease.deviceKey === undefined ? {} : { deviceKey: lease.deviceKey })
        };
        // The proxy lists every simulator its token holds, so each command names the leased one.
        const udid = lease.deviceKey?.split(':').pop();
        recordLease(request.projectRoot, lease.leaseId);
        request.log(`simlock lease ${lease.leaseId} granted in ${Date.now() - started} ms (${options.device} ${udid ?? 'no udid'})`);
        let missedHeartbeats = 0;
        const timer = setInterval(
            () => {
                c.leases
                    .heartbeat({ ...scope, ttlMs })
                    .then(() => {
                        missedHeartbeats = 0;
                    })
                    .catch((cause: unknown) => {
                        missedHeartbeats += 1;
                        request.log(
                            missedHeartbeats >= 2
                                ? `simlock lease ${lease.leaseId} missed ${missedHeartbeats} heartbeats: it may have expired, and failures on its device are infrastructure, not tests (${String(cause)})`
                                : `simlock heartbeat failed: ${String(cause)}`
                        );
                    });
            },
            Math.max(10_000, Math.floor(ttlMs / 3))
        );
        timer.unref();
        try {
            if (udid === undefined) {
                throw new Error(`simlock lease ${lease.leaseId} names no device (deviceKey ${String(lease.deviceKey)})`);
            }
            request.signal.throwIfAborted();
            let installedApp: string | undefined;
            const scoped = createAgentDeviceClient({ daemonBaseUrl: baseUrl, daemonAuthToken: options.token, session, ...scope });
            const install = async (appPath: string, app?: string): Promise<void> => {
                try {
                    await uploads(() => scoped.apps.install({ platform: 'ios', udid, appPath, ...(app === undefined ? {} : { app }) }));
                } catch (cause) {
                    throw new DeviceSetupFailed(`${String(cause instanceof Error ? cause.message : cause)} (${udid})`, { cause });
                }
            };
            if (request.appPath !== undefined) {
                const installStarted = Date.now();
                await install(request.appPath, request.app);
                installedApp = request.app;
                request.log(`simlock uploaded and installed ${installedApp} in ${Date.now() - installStarted} ms`);
            }
            for (const extra of options.extraApps ?? []) {
                await install(extra);
            }
            const entry: Held = {
                id: lease.leaseId,
                daemon: { baseUrl: (await startRelay()).baseUrl, authToken: options.token },
                client: scope,
                deviceId: udid,
                ...(installedApp === undefined ? {} : { installedApp }),
                stop: () => clearInterval(timer),
                scope
            };
            held.set(entry.id, entry);
            return entry;
        } catch (cause) {
            // The engine releases only leases acquire returned: hand this one back now, not one TTL later.
            clearInterval(timer);
            await c.leases
                .release(scope)
                .catch((cleanup: unknown) => request.log(`simlock release after a failed acquire failed: ${String(cleanup)}`));
            throw cause;
        }
    };

    return {
        name: 'simlock',
        async acquire(request: DeviceRequest): Promise<DeviceLease> {
            if (request.platform !== 'ios') {
                throw new Error(`simlockDevices leases iOS simulators, not ${request.platform}`);
            }
            try {
                return await leaseOnce(request, 0);
            } catch (cause) {
                // One bad simulator must not fail the whole run: its lease is already released,
                // so lease another device, once. A second failure is the farm's, and is reported.
                // A farm that is unreachable or has lost its worker fails every slot at once: a
                // swap then only doubles the wipes on an already overloaded host, so it fails now.
                if (!(cause instanceof DeviceSetupFailed) || FARM_DOWN.test(cause.message)) {
                    throw cause;
                }
                request.signal.throwIfAborted();
                request.log(`simlock: ${cause.message}; leasing another device`);
                return leaseOnce(request, 1);
            }
        },
        async release(lease: DeviceLease, context): Promise<void> {
            const entry = held.get(lease.id);
            if (entry === undefined) {
                return;
            }
            entry.stop();
            try {
                await client(`release-${lease.id.slice(0, 8)}`).leases.release({ ...entry.scope, signal: context.signal });
            } finally {
                // A failed release still frees this process: the farm reclaims the lease after one TTL.
                held.delete(lease.id);
                if (held.size === 0 && relay !== undefined) {
                    const closing = relay;
                    relay = undefined;
                    await (await closing).close();
                }
            }
        }
    };
}
