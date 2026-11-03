import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

/**
 * Host-side device work over simlock's HTTP API. `POST /v1/leases/<id>/exec`
 * runs one `simctl` command on the worker for the leased simulator only
 * (simlock inserts the UDID). `simctl spawn … /bin/sh -c` runs the simulator
 * runtime's shell, which reaches the Mac's own `/bin` and `/usr/bin` by
 * absolute path, so files travel as base64 on stdin and are unpacked by the
 * worker's own tools: the runner needs no SSH key and no shared disk.
 */
export interface SimlockApi {
    readonly url: string;
    readonly token: string;
}

export interface ExecResult {
    readonly exitCode: number;
    readonly stdout: string;
    readonly stderr: string;
}

export function simlockApiFromEnv(env: NodeJS.ProcessEnv = process.env): SimlockApi {
    const url = env.SIMLOCK_URL;
    const token = env.SIMLOCK_TOKEN;
    if (!url || !token) {
        throw new Error('SIMLOCK_URL and SIMLOCK_TOKEN are required');
    }
    return { url, token };
}

/** No request to the farm may hang a test: a simctl exec (an untar included) gets its 10 minute cap. */
const REQUEST_TIMEOUT_MS = 11 * 60_000;

async function call(api: SimlockApi, path: string, init: RequestInit = {}): Promise<Response> {
    const response = await fetch(`${api.url.replace(/\/$/, '')}${path}`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        ...init,
        headers: { authorization: `Bearer ${api.token}`, 'content-type': 'application/json', ...init.headers }
    });
    if (!response.ok) {
        throw new Error(`simlock ${init.method ?? 'GET'} ${path} answered ${response.status}: ${await response.text()}`);
    }
    return response;
}

/** The simlock lease of this token that holds the simulator with this UDID. */
export async function leaseIdForUdid(api: SimlockApi, udid: string): Promise<string> {
    const body = (await (await call(api, '/v1/leases')).json()) as { leases: Record<string, unknown>[] };
    for (const lease of body.leases) {
        if (JSON.stringify(lease).includes(udid)) {
            return String(lease.id);
        }
        const detail = await (await call(api, `/v1/leases/${String(lease.id)}`)).text();
        if (detail.includes(udid)) {
            return String(lease.id);
        }
    }
    throw new Error(`no simlock lease of this token holds ${udid} (${body.leases.length} leases)`);
}

/** Runs one `simctl` command on the leased simulator. */
export async function exec(api: SimlockApi, leaseId: string, args: readonly string[], stdin?: string): Promise<ExecResult> {
    const body = JSON.stringify({ tool: 'simctl', args, ...(stdin === undefined ? {} : { stdin }) });
    let response: Response;
    for (let attempt = 1; ; attempt++) {
        try {
            response = await call(api, `/v1/leases/${leaseId}/exec`, { method: 'POST', body });
            break;
        } catch (cause) {
            // A gateway's worker uplink can drop and reconnect within a second; every command the suite sends is idempotent.
            if (attempt === 3 || !String(cause).includes('WORKER_UNREACHABLE')) {
                throw cause;
            }
            await new Promise(resolve => setTimeout(resolve, 2_000 * attempt));
        }
    }
    const text = await response.text();
    let stdout = '';
    let stderr = '';
    let exitCode = -1;
    let sawExit = false;
    let event = '';
    for (const line of text.split('\n')) {
        if (line.startsWith('event: ')) {
            event = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6)) as {
                stream?: string;
                chunk?: string;
                exitCode?: number;
                code?: string;
                message?: string;
            };
            if (event === 'output') {
                if (data.stream === 'stderr') {
                    stderr += data.chunk ?? '';
                } else {
                    stdout += data.chunk ?? '';
                }
            } else if (event === 'exit') {
                exitCode = data.exitCode ?? -1;
                sawExit = true;
            } else if (event === 'error') {
                throw new Error(`simlock exec ${args.slice(0, 2).join(' ')} failed: ${data.code} ${data.message}`);
            }
        }
    }
    // A stream cut off before its exit event says nothing about the command: never a result.
    if (!sawExit) {
        throw new Error(`simlock exec ${args.slice(0, 2).join(' ')} ended without an exit status (stream cut off)`);
    }
    return { exitCode, stdout, stderr };
}

export async function mustExec(api: SimlockApi, leaseId: string, args: readonly string[], stdin?: string): Promise<string> {
    const result = await exec(api, leaseId, args, stdin);
    if (result.exitCode !== 0) {
        throw new Error(`simctl ${args.slice(0, 3).join(' ')} exited ${result.exitCode}: ${result.stderr.trim()}`);
    }
    return result.stdout;
}

/**
 * E2EDrop, a helper app built for the simulator (`support/simlock/e2e-drop/`),
 * which the provider installs beside the app under test. CoreSimulator on
 * macOS 26 refuses to spawn the Mac's own tools and the simulator runtime has
 * no shell, cp or tar, so every file the suite puts on the device goes
 * through it.
 */
export const E2E_DROP_APP = fileURLToPath(new URL('./e2e-drop/E2EDrop.app', import.meta.url));
const E2E_DROP_BUNDLE_ID = 'dev.e2e.simlock.drop';

const dropPaths = new Map<string, Promise<string>>();

async function dropExecutable(api: SimlockApi, leaseId: string): Promise<string> {
    let path = dropPaths.get(leaseId);
    if (path === undefined) {
        path = mustExec(api, leaseId, ['get_app_container', E2E_DROP_BUNDLE_ID, 'app']).then(out => `${out.trim()}/E2EDrop`);
        dropPaths.set(leaseId, path);
        path.catch(() => dropPaths.delete(leaseId));
    }
    return path;
}

/** Runs one E2EDrop command on the leased simulator; `payload` travels on stdin. */
export async function drop(api: SimlockApi, leaseId: string, args: readonly string[], payload?: Buffer): Promise<ExecResult> {
    const executable = await dropExecutable(api, leaseId);
    return exec(
        api,
        leaseId,
        ['spawn', executable, ...args],
        payload === undefined ? undefined : deflateRawSync(payload).toString('base64')
    );
}

export async function mustDrop(api: SimlockApi, leaseId: string, args: readonly string[], payload?: Buffer): Promise<string> {
    const result = await drop(api, leaseId, args, payload);
    if (result.exitCode !== 0) {
        throw new Error(`e2e-drop ${args[0]} exited ${result.exitCode}: ${result.stderr.trim()}`);
    }
    return result.stdout;
}

/** Writes `bytes` to `path` on the device's filesystem. */
export async function writeFile(api: SimlockApi, leaseId: string, path: string, bytes: Buffer): Promise<void> {
    await mustDrop(api, leaseId, ['write', path], bytes);
}

/** Unpacks a ustar archive (`tar --format=ustar`) into `dir`. */
export async function untar(api: SimlockApi, leaseId: string, dir: string, tar: Buffer): Promise<void> {
    await mustDrop(api, leaseId, ['untar', dir], tar);
}
