import type { CellTimelineEventSchema, TimelineEventSchema } from '../schema/current-run.schema';

export type TimelineEventType = typeof TimelineEventSchema.Type;

export type CellTimelineEventType = typeof CellTimelineEventSchema.Type;
