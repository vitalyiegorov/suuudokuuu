import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import { isDefined } from '@rnw-community/shared';

import {
    CODEC_VERSION_BITS,
    CODEC_VERSION_V3,
    EVENT_COUNT_LIMIT,
    HAS_TAG_STREAM_BITS,
    IS_CHALLENGE_RUN_BITS,
    MAX_MISTAKES_BITS,
    MAX_MISTAKES_LIMIT,
    PAYLOAD_KIND_BITS
} from '../../@generic/constants/binary-codec.constant';
import { GRID_CELL_COUNT } from '../../@generic/constants/grid.constant';
import { payloadKindByCode } from '../../@generic/constants/timeline-event-codes.constant';
import { SharedPayloadKindEnum } from '../../@generic/enums/shared-payload-kind.enum';
import { base64urlToBytes } from '../../@generic/utils/base64url-to-bytes.util';
import { bytesToBase64url } from '../../@generic/utils/bytes-to-base64url.util';
import { readGivens, writeGivens } from '../../@generic/utils/givens-codec.util';
import { emptyHandoffExtras, readHandoffExtras, writeHandoffExtras } from '../../@generic/utils/handoff-extras-codec.util';
import {
    hasNonCellEvents,
    readTimelineEvents,
    removeCellEventsFromField,
    writeTimelineEvents
} from '../../@generic/utils/timeline-event-stream-codec.util';

import type { DecodedGameStateInterface } from '../../@generic/interfaces/decoded-game-state.interface';
import type { TimelineEventInterface } from '../../@generic/interfaces/timeline-event.interface';

export type EncodableGameStateInterface = Omit<DecodedGameStateInterface, 'elapsedTime'>;

export class GameStateBinaryCodecV3 {
    encode(state: EncodableGameStateInterface): string {
        if (state.field.length !== GRID_CELL_COUNT) {
            throw new Error('Invalid sudoku field length');
        }

        if (state.timelineEvents.length > EVENT_COUNT_LIMIT) {
            throw new Error('Too many timeline events');
        }

        const events = state.kind === SharedPayloadKindEnum.Puzzle ? [] : state.timelineEvents;
        const hasTagStream = hasNonCellEvents(events);
        const out = new BitOutputStream();

        this.writeHeader(out, state, hasTagStream);
        this.writePayloadBody(out, state, events, hasTagStream);

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
        const timelineEvents = kind === SharedPayloadKindEnum.Puzzle ? [] : readTimelineEvents(input, field, hasTagStream);
        const elapsedTime = timelineEvents.reduce((total, event) => total + event.ts, 0);
        const handoffExtras = kind === SharedPayloadKindEnum.Handoff ? readHandoffExtras(input, isChallengeRun) : emptyHandoffExtras;

        return {
            field,
            timelineEvents,
            kind,
            maxMistakes,
            elapsedTime,
            isChallengeRun,
            ...handoffExtras
        };
    }

    private writeHeader(out: BitOutputStream, state: EncodableGameStateInterface, hasTagStream: boolean): void {
        out.write(CODEC_VERSION_V3, CODEC_VERSION_BITS);
        out.write(state.kind, PAYLOAD_KIND_BITS);
        out.write(hasTagStream ? 1 : 0, HAS_TAG_STREAM_BITS);
        out.write(state.isChallengeRun ? 1 : 0, IS_CHALLENGE_RUN_BITS);
        out.write(this.clampMaxMistakes(state.maxMistakes), MAX_MISTAKES_BITS);
    }

    private writePayloadBody(
        out: BitOutputStream,
        state: EncodableGameStateInterface,
        events: TimelineEventInterface[],
        hasTagStream: boolean
    ): void {
        const givens = removeCellEventsFromField(state.field, state.timelineEvents);

        writeGivens(out, givens);

        if (state.kind !== SharedPayloadKindEnum.Puzzle) {
            writeTimelineEvents(out, givens, events, hasTagStream);
        }

        if (state.kind === SharedPayloadKindEnum.Handoff) {
            writeHandoffExtras(out, state, state.isChallengeRun);
        }
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
}
