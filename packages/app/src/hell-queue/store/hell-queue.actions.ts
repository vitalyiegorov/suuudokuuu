import { hellQueueSlice } from './hell-queue.slice';

export const hellQueueEnqueueAction = hellQueueSlice.actions.enqueue;
export const hellQueueConsumeAction = hellQueueSlice.actions.consume;
