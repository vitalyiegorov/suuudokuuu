import { isDefined } from '@rnw-community/shared';

import {
    CELL_INDEX_BITS_ABSOLUTE,
    EVENT_COUNT_BITS,
    TAG_CELL_FLAG_BITS,
    TAG_SUBCODE_BITS,
    TIMESTAMP_LARGE_BITS,
    TIMESTAMP_SMALL_BITS
} from '../constants/binary-codec.constant';
import { VALUE_BITS } from '../constants/bit-encoding.constant';
import { GRID_EMPTY_CELL } from '../constants/grid.constant';
import { TimelineEventKindEnum } from '../enums/timeline-event-kind.enum';

import { collectEmptyCells, readCellPositions, writeCellPositions, readPackedValues, writePackedValues } from './givens-codec.util';
import { isValidCellIndex } from './is-valid-cell-index.util';
import { isValidCellValue } from './is-valid-cell-value.util';
import { readVarint, writeVarint } from './varint.util';

import type { CellTimelineEventInterface, TimelineEventInterface } from '../interfaces/timeline-event.interface';
import type { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

const timelineEventKindByCode: Record<number, TimelineEventKindEnum> = {
    [TimelineEventKindEnum.Cell]: TimelineEventKindEnum.Cell,
    [TimelineEventKindEnum.Pencil]: TimelineEventKindEnum.Pencil,
    [TimelineEventKindEnum.InputMode]: TimelineEventKindEnum.InputMode,
    [TimelineEventKindEnum.AutoCandidates]: TimelineEventKindEnum.AutoCandidates,
    [TimelineEventKindEnum.Mistake]: TimelineEventKindEnum.Mistake,
    [TimelineEventKindEnum.Away]: TimelineEventKindEnum.Away,
    [TimelineEventKindEnum.Return]: TimelineEventKindEnum.Return,
    [TimelineEventKindEnum.Pause]: TimelineEventKindEnum.Pause,
    [TimelineEventKindEnum.Resume]: TimelineEventKindEnum.Resume,
    [TimelineEventKindEnum.Screenshot]: TimelineEventKindEnum.Screenshot,
    [TimelineEventKindEnum.Hint]: TimelineEventKindEnum.Hint
};

interface TimelineEventStreamsInterface {
    readonly kinds: TimelineEventKindEnum[];
    readonly timestamps: number[];
    readonly cellIndexes: number[];
    readonly cellValues: number[];
    readonly payloadIndexes: number[];
    readonly payloadValues: number[];
}

const isCellPayloadKind = (kind: TimelineEventKindEnum): kind is TimelineEventKindEnum.Pencil | TimelineEventKindEnum.Mistake =>
    kind === TimelineEventKindEnum.Pencil || kind === TimelineEventKindEnum.Mistake;

const writeCellCharsToField = (
    field: string,
    events: TimelineEventInterface[],
    getCellChar: (event: CellTimelineEventInterface) => string
): string => {
    const chars = field.split('');

    for (const event of events) {
        if (event.kind === TimelineEventKindEnum.Cell) {
            chars[event.cellIndex] = getCellChar(event);
        }
    }

    return chars.join('');
};

export const removeCellEventsFromField = (field: string, events: TimelineEventInterface[]): string =>
    writeCellCharsToField(field, events, () => GRID_EMPTY_CELL);

export const applyCellEventsToField = (field: string, events: TimelineEventInterface[]): string =>
    writeCellCharsToField(field, events, event => String(event.value));

export const hasNonCellEvents = (events: TimelineEventInterface[]): boolean =>
    events.some(event => event.kind !== TimelineEventKindEnum.Cell);

export const countCellEvents = (events: TimelineEventInterface[]): number =>
    events.filter(event => event.kind === TimelineEventKindEnum.Cell).length;

const writeEventTags = (out: BitOutputStream, events: TimelineEventInterface[]): void => {
    for (const event of events) {
        if (event.kind === TimelineEventKindEnum.Cell) {
            out.write(0, TAG_CELL_FLAG_BITS);
        } else {
            out.write(1, TAG_CELL_FLAG_BITS);
            out.write(event.kind - 1, TAG_SUBCODE_BITS);
        }
    }
};

const writeCellEvents = (out: BitOutputStream, givens: string, events: TimelineEventInterface[]): void => {
    const cellEvents = events.filter(event => event.kind === TimelineEventKindEnum.Cell);

    writeCellPositions(
        out,
        collectEmptyCells(givens),
        cellEvents.map(event => event.cellIndex),
        'Invalid timeline cell event'
    );
    writePackedValues(
        out,
        cellEvents.map(event => event.value)
    );
};

export const writeTimelineEvents = (
    out: BitOutputStream,
    givens: string,
    events: TimelineEventInterface[],
    hasTagStream: boolean
): void => {
    out.write(events.length, EVENT_COUNT_BITS);

    if (hasTagStream) {
        writeEventTags(out, events);
    }

    writeCellEvents(out, givens, events);

    for (const event of events) {
        writeVarint(out, event.ts, TIMESTAMP_SMALL_BITS, TIMESTAMP_LARGE_BITS);
    }

    for (const event of events) {
        if (isCellPayloadKind(event.kind) && 'cellIndex' in event) {
            if (!isValidCellIndex(event.cellIndex) || !isValidCellValue(event.value)) {
                throw new Error('Invalid timeline cell payload');
            }

            out.write(event.cellIndex, CELL_INDEX_BITS_ABSOLUTE);
            out.write(event.value - 1, VALUE_BITS);
        }
    }
};

const readEventKinds = (input: BitInputStream, count: number, hasTagStream: boolean): TimelineEventKindEnum[] => {
    const kinds: TimelineEventKindEnum[] = [];

    for (let eventIndex = 0; eventIndex < count; eventIndex += 1) {
        const isCellEvent = !hasTagStream || input.read(TAG_CELL_FLAG_BITS) === 0;

        if (isCellEvent) {
            kinds.push(TimelineEventKindEnum.Cell);
        } else {
            const kind = timelineEventKindByCode[input.read(TAG_SUBCODE_BITS) + 1];
            if (!isDefined(kind)) {
                throw new Error('Unsupported timeline event kind');
            }

            kinds.push(kind);
        }
    }

    return kinds;
};

const readCellIndexes = (input: BitInputStream, field: string, cellCount: number): number[] => {
    const emptyCells = collectEmptyCells(field);

    if (cellCount > emptyCells.length) {
        throw new Error('Invalid timeline cell event count');
    }

    return readCellPositions(input, emptyCells, cellCount, 'Invalid timeline cell event position');
};

const readEventStreams = (input: BitInputStream, field: string, kinds: TimelineEventKindEnum[]): TimelineEventStreamsInterface => {
    const cellCount = kinds.filter(kind => kind === TimelineEventKindEnum.Cell).length;
    const cellIndexes = readCellIndexes(input, field, cellCount);
    const cellValues = readPackedValues(input, cellCount);
    const timestamps = kinds.map(() => readVarint(input, TIMESTAMP_SMALL_BITS, TIMESTAMP_LARGE_BITS));
    const payloadIndexes: number[] = [];
    const payloadValues: number[] = [];

    for (const kind of kinds) {
        if (isCellPayloadKind(kind)) {
            const cellIndex = input.read(CELL_INDEX_BITS_ABSOLUTE);
            const value = input.read(VALUE_BITS) + 1;

            if (!isValidCellIndex(cellIndex) || !isValidCellValue(value)) {
                throw new Error('Invalid timeline cell payload');
            }

            payloadIndexes.push(cellIndex);
            payloadValues.push(value);
        }
    }

    return { kinds, timestamps, cellIndexes, cellValues, payloadIndexes, payloadValues };
};

const buildEvents = (streams: TimelineEventStreamsInterface): TimelineEventInterface[] => {
    const events: TimelineEventInterface[] = [];
    let cellEventIndex = 0;
    let payloadEventIndex = 0;

    streams.kinds.forEach((kind, eventIndex) => {
        const ts = streams.timestamps[eventIndex];

        if (kind === TimelineEventKindEnum.Cell) {
            events.push({ kind, cellIndex: streams.cellIndexes[cellEventIndex], value: streams.cellValues[cellEventIndex], ts });
            cellEventIndex += 1;

            return;
        }

        if (isCellPayloadKind(kind)) {
            events.push({
                kind,
                cellIndex: streams.payloadIndexes[payloadEventIndex],
                value: streams.payloadValues[payloadEventIndex],
                ts
            });
            payloadEventIndex += 1;

            return;
        }

        events.push({ kind, ts });
    });

    return events;
};

export const readTimelineEvents = (input: BitInputStream, field: string, hasTagStream: boolean): TimelineEventInterface[] => {
    const count = input.read(EVENT_COUNT_BITS);
    const kinds = readEventKinds(input, count, hasTagStream);

    return buildEvents(readEventStreams(input, field, kinds));
};
