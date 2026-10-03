import { getTimelineTimestampDelta } from './get-timeline-timestamp-delta.util';

import type { CurrentRunType } from '../type/current-run.type';
import type { TimelineEventKindEnum } from '@suuudokuuu/encoder';

type TimelineMarkerKindType =
    | TimelineEventKindEnum.AutoCandidates
    | TimelineEventKindEnum.Away
    | TimelineEventKindEnum.Hint
    | TimelineEventKindEnum.Return
    | TimelineEventKindEnum.Screenshot;

export const withTimelineMarker = (run: CurrentRunType, kind: TimelineMarkerKindType): CurrentRunType => ({
    ...run,
    timelineEvents: [...run.timelineEvents, { kind, ts: getTimelineTimestampDelta(run) }]
});
