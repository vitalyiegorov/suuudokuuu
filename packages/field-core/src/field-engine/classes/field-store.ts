import { isDefined } from '@rnw-community/shared';

import { TypedEventEmitter } from '../../@generic/classes/typed-event-emitter';

import type { UnsubscribeType } from '../../@generic/types/unsubscribe.type';
import type { FieldEventMapInterface } from '../interfaces/field-event-map.interface';
import type { FieldSnapshotInterface } from '../interfaces/field-snapshot.interface';

export abstract class FieldStore {
    protected readonly events = new TypedEventEmitter<FieldEventMapInterface>();

    private readonly listeners = new Set<UnsubscribeType>();

    private snapshot: FieldSnapshotInterface | null = null;

    readonly subscribe = (listener: UnsubscribeType): UnsubscribeType => {
        this.listeners.add(listener);

        return () => void this.listeners.delete(listener);
    };

    readonly getSnapshot = (): FieldSnapshotInterface => (isDefined(this.snapshot) ? this.snapshot : this.refreshSnapshot());

    on<TEventKey extends keyof FieldEventMapInterface>(
        event: TEventKey,
        handler: (payload: FieldEventMapInterface[TEventKey]) => void
    ): UnsubscribeType {
        return this.events.on(event, handler);
    }

    protected publish(): void {
        this.refreshSnapshot();

        for (const listener of [...this.listeners]) {
            listener();
        }
    }

    private refreshSnapshot(): FieldSnapshotInterface {
        this.snapshot = this.createSnapshot();

        return this.snapshot;
    }

    protected abstract createSnapshot(): FieldSnapshotInterface;
}
