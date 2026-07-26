import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import { isDefined } from '@rnw-community/shared';

import {
    CELL_INDEX_BITS_ABSOLUTE,
    CODEC_VERSION_BITS,
    CODEC_VERSION_V3,
    EVENT_COUNT_BITS,
    EVENT_COUNT_LIMIT,
    HAS_TAG_STREAM_BITS,
    IS_CHALLENGE_RUN_BITS,
    MAX_MISTAKES_BITS,
    MAX_MISTAKES_LIMIT,
    PAYLOAD_KIND_BITS,
    TAG_CELL_FLAG_BITS,
    TAG_SUBCODE_BITS,
    TIMESTAMP_LARGE_BITS,
    TIMESTAMP_SMALL_BITS
} from '../../@generic/constants/binary-codec.constant';
import { VALUE_BITS } from '../../@generic/constants/bit-encoding.constant';
import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../../@generic/constants/grid.constant';
import { cellPayloadKinds, payloadKindByCode, timelineEventKindByCode } from '../../@generic/constants/timeline-event-codes.constant';
import { SharedPayloadKindEnum } from '../../@generic/enums/shared-payload-kind.enum';
import { TimelineEventKindEnum } from '../../@generic/enums/timeline-event-kind.enum';
import { base64urlToBytes } from '../../@generic/utils/base64url-to-bytes.util';
import { bytesToBase64url } from '../../@generic/utils/bytes-to-base64url.util';
import {
    collectEmptyCells,
    getPositionBits,
    readGivens,
    readPackedValues,
    writeGivens,
    writePackedValues
} from '../../@generic/utils/givens-codec.util';
import { readVarint, writeVarint } from '../../@generic/utils/varint.util';

import type { DecodedGameStateInterface } from '../../@generic/interfaces/decoded-game-state.interface';
import type { TimelineEventStreamsInterface } from '../../@generic/interfaces/timeline-event-streams.interface';
import type { TimelineEventInterface } from '../../@generic/interfaces/timeline-event.interface';

export type EncodableGameStateInterface = Omit<DecodedGameStateInterface, 'elapsedTime'>;

export class GameStateBinaryCodecV3 {
    encode(state: EncodableGameStateInterface): string {
        if (state.field.length !== GRID_CELL_COUNT) {
            throw new Error('Invalid sudoku field length');
        }

        const events = state.kind === SharedPayloadKindEnum.Puzzle ? [] : state.timelineEvents;
        if (events.length > EVENT_COUNT_LIMIT) {
            throw new Error('Too many timeline events');
        }

        const hasTagStream = events.some(event => event.kind !== TimelineEventKindEnum.Cell);
        const givens = this.removeCellEventsFromField(state.field, events);
        const out = new BitOutputStream();

        this.writeHeader(out, state, hasTagStream);
        writeGivens(out, givens);

        if (state.kind !== SharedPayloadKindEnum.Puzzle) {
            this.writeEvents(out, givens, events, hasTagStream);
        }

        return bytesToBase64url(out.bytes());
    }

    decode(payload: string): DecodedGameStateInterface {
        const input = new BitInputStream(base64urlToBytes(payload));

        const version = input.read(CODEC_VERSION_BITS);
        if (version !== CODEC_VERSION_V3) {
            throw new Error('Unsupported game state version');
        }

        const kind = this.readPayloadKind(input);
        const hasTagStream = input.read(HAS_TAG_STREAM_BITS) === 1;
        const isChallengeRun = input.read(IS_CHALLENGE_RUN_BITS) === 1;
        const maxMistakes = input.read(MAX_MISTAKES_BITS);
        const field = readGivens(input);
        const timelineEvents = kind === SharedPayloadKindEnum.Puzzle ? [] : this.readEvents(input, field, hasTagStream);
        const elapsedTime = timelineEvents.reduce((total, event) => total + event.ts, 0);

        return {
            field,
            timelineEvents,
            kind,
            maxMistakes,
            elapsedTime,
            isChallengeRun,
            score: 0,
            candidates: {},
            anchorSeconds: 0
        };
    }

    private writeHeader(out: BitOutputStream, state: EncodableGameStateInterface, hasTagStream: boolean): void {
        out.write(CODEC_VERSION_V3, CODEC_VERSION_BITS);
        out.write(state.kind, PAYLOAD_KIND_BITS);
        out.write(hasTagStream ? 1 : 0, HAS_TAG_STREAM_BITS);
        out.write(state.isChallengeRun ? 1 : 0, IS_CHALLENGE_RUN_BITS);
        out.write(this.clampMaxMistakes(state.maxMistakes), MAX_MISTAKES_BITS);
    }

    private readPayloadKind(input: BitInputStream): SharedPayloadKindEnum {
        const kind = payloadKindByCode[input.read(PAYLOAD_KIND_BITS)];

        if (!isDefined(kind)) {
            throw new Error('Unsupported shared payload kind');
        }

        return kind;
    }

    private clampMaxMistakes(maxMistakes: number): number {
        return Math.min(Math.max(Math.trunc(maxMistakes), 0), MAX_MISTAKES_LIMIT);
    }

    private removeCellEventsFromField(field: string, events: TimelineEventInterface[]): string {
        const chars = field.split('');

        for (const event of events) {
            if (event.kind === TimelineEventKindEnum.Cell) {
                chars[event.cellIndex] = GRID_EMPTY_CELL;
            }
        }

        return chars.join('');
    }

    private writeEvents(out: BitOutputStream, givens: string, events: TimelineEventInterface[], hasTagStream: boolean): void {
        out.write(events.length, EVENT_COUNT_BITS);

        if (hasTagStream) {
            this.writeEventTags(out, events);
        }

        this.writeCellEvents(out, givens, events);

        for (const event of events) {
            writeVarint(out, event.ts, TIMESTAMP_SMALL_BITS, TIMESTAMP_LARGE_BITS);
        }

        for (const event of events) {
            if (cellPayloadKinds.includes(event.kind) && 'cellIndex' in event) {
                out.write(event.cellIndex, CELL_INDEX_BITS_ABSOLUTE);
                out.write(event.value - 1, VALUE_BITS);
            }
        }
    }

    private writeEventTags(out: BitOutputStream, events: TimelineEventInterface[]): void {
        for (const event of events) {
            if (event.kind === TimelineEventKindEnum.Cell) {
                out.write(0, TAG_CELL_FLAG_BITS);
            } else {
                out.write(1, TAG_CELL_FLAG_BITS);
                out.write(event.kind - 1, TAG_SUBCODE_BITS);
            }
        }
    }

    private writeCellEvents(out: BitOutputStream, givens: string, events: TimelineEventInterface[]): void {
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
    }

    private readEventKinds(input: BitInputStream, count: number, hasTagStream: boolean): TimelineEventKindEnum[] {
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
    }

    private readEvents(input: BitInputStream, field: string, hasTagStream: boolean): TimelineEventInterface[] {
        const count = input.read(EVENT_COUNT_BITS);
        const kinds = this.readEventKinds(input, count, hasTagStream);

        return this.buildEvents(this.readEventStreams(input, field, kinds));
    }

    private readEventStreams(input: BitInputStream, field: string, kinds: TimelineEventKindEnum[]): TimelineEventStreamsInterface {
        const cellCount = kinds.filter(kind => kind === TimelineEventKindEnum.Cell).length;
        const cellIndexes = this.readCellIndexes(input, field, cellCount);
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
    }

    private readCellIndexes(input: BitInputStream, field: string, cellCount: number): number[] {
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
    }

    private buildEvents(streams: TimelineEventStreamsInterface): TimelineEventInterface[] {
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
    }
}
