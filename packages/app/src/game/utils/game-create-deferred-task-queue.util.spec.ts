import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { gameCreateDeferredTaskQueue } from './game-create-deferred-task-queue.util';

describe('gameCreateDeferredTaskQueue', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('runs a scheduled task after the current task instead of inline', () => {
        const queue = gameCreateDeferredTaskQueue();
        const task = jest.fn();

        queue.schedule(task);

        expect(task).not.toHaveBeenCalled();

        jest.runAllTimers();

        expect(task).toHaveBeenCalledTimes(1);
    });

    it('runs every pending task once and in order when flushed', () => {
        const queue = gameCreateDeferredTaskQueue();
        const calls: string[] = [];

        queue.schedule(() => void calls.push('first'));
        queue.schedule(() => void calls.push('second'));
        queue.flush();
        jest.runAllTimers();
        queue.flush();

        expect(calls).toStrictEqual(['first', 'second']);
    });
});
