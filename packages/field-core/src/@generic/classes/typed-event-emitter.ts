import { isDefined } from '@rnw-community/shared';

import type { UnsubscribeType } from '../types/unsubscribe.type';

type EventHandlersType<TEventMap> = {
    [TEventKey in keyof TEventMap]?: Set<(payload: TEventMap[TEventKey]) => void>;
};

export class TypedEventEmitter<TEventMap> {
    private readonly handlersByEvent: EventHandlersType<TEventMap> = {};

    on<TEventKey extends keyof TEventMap>(event: TEventKey, handler: (payload: TEventMap[TEventKey]) => void): UnsubscribeType {
        const handlers = this.handlersByEvent[event] ?? new Set<(payload: TEventMap[TEventKey]) => void>();

        handlers.add(handler);
        this.handlersByEvent[event] = handlers;

        return () => void handlers.delete(handler);
    }

    emit<TEventKey extends keyof TEventMap>(event: TEventKey, payload: TEventMap[TEventKey]): void {
        const handlers: Set<(payload: TEventMap[TEventKey]) => void> | undefined = this.handlersByEvent[event];

        if (isDefined(handlers)) {
            for (const handler of [...handlers]) {
                handler(payload);
            }
        }
    }
}
