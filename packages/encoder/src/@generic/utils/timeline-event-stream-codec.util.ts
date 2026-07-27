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
import { cellPayloadKinds, timelineEventKindByCode } from '../constants/timeline-event-codes.constant';
import { TimelineEventKindEnum } from '../enums/timeline-event-kind.enum';

import { collectEmptyCells, getPositionBits, readPackedValues, writePackedValues } from './givens-codec.util';
import { readVarint, writeVarint } from './varint.util';

import type { TimelineEventStreamsInterface } from '../interfaces/timeline-event-streams.interface';
import type { CellTimelineEventInterface, TimelineEventInterface } from '../interfaces/timeline-event.interface';
import type { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

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
    const emptyCells = collectEmptyCells(givens);
    const cellValues: number[] = [];

    for (const event of events) {
        if (event.kind === TimelineEventKindEnum.Cell) {
            const position = emptyCells.indexOf(event.cellIndex);
            if (position === -1) {
                throw new Error('Invalid timeline cell event');
            }

            const width = getPositionBits(emptyCells.length);
            if (width > 0) {
                out.write(position, width);
            }

            emptyCells.splice(position, 1);
            cellValues.push(event.value);
        }
    }

    writePackedValues(out, cellValues);
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
        if (cellPayloadKinds.includes(event.kind) && 'cellIndex' in event) {
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

    const cellIndexes: number[] = [];
    for (let cellEventIndex = 0; cellEventIndex < cellCount; cellEventIndex += 1) {
        const width = getPositionBits(emptyCells.length);
        const position = width > 0 ? input.read(width) : 0;

        if (position >= emptyCells.length) {
            throw new Error('Invalid timeline cell event position');
        }

        cellIndexes.push(emptyCells[position]);
        emptyCells.splice(position, 1);
    }

    return cellIndexes;
};

const readEventStreams = (input: BitInputStream, field: string, kinds: TimelineEventKindEnum[]): TimelineEventStreamsInterface => {
    const cellCount = kinds.filter(kind => kind === TimelineEventKindEnum.Cell).length;
    const cellIndexes = readCellIndexes(input, field, cellCount);
    const cellValues = readPackedValues(input, cellCount);
    const timestamps = kinds.map(() => readVarint(input, TIMESTAMP_SMALL_BITS, TIMESTAMP_LARGE_BITS));
    const payloadIndexes: number[] = [];
    const payloadValues: number[] = [];

    for (const kind of kinds) {
        if (cellPayloadKinds.includes(kind)) {
            payloadIndexes.push(input.read(CELL_INDEX_BITS_ABSOLUTE));
            payloadValues.push(input.read(VALUE_BITS) + 1);
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

        if (kind === TimelineEventKindEnum.Pencil || kind === TimelineEventKindEnum.Mistake) {
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
