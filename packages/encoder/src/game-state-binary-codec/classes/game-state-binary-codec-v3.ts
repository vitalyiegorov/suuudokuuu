import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import { isDefined } from '@rnw-community/shared';

import {
    CODEC_VERSION_BITS,
    CODEC_VERSION_V3,
    HAS_TAG_STREAM_BITS,
    IS_CHALLENGE_RUN_BITS,
    MAX_MISTAKES_BITS,
    MAX_MISTAKES_LIMIT,
    PAYLOAD_KIND_BITS
} from '../../@generic/constants/binary-codec.constant';
import { GRID_CELL_COUNT } from '../../@generic/constants/grid.constant';
import { SharedPayloadKindEnum } from '../../@generic/enums/shared-payload-kind.enum';
import { base64urlToBytes } from '../../@generic/utils/base64url-to-bytes.util';
import { bytesToBase64url } from '../../@generic/utils/bytes-to-base64url.util';
import { readGivens, writeGivens } from '../../@generic/utils/givens-codec.util';

import type { DecodedGameStateInterface } from '../../@generic/interfaces/decoded-game-state.interface';

export type EncodableGameStateInterface = Omit<DecodedGameStateInterface, 'elapsedTime'>;

const payloadKindByCode: Record<number, SharedPayloadKindEnum> = {
    [SharedPayloadKindEnum.Puzzle]: SharedPayloadKindEnum.Puzzle,
    [SharedPayloadKindEnum.Handoff]: SharedPayloadKindEnum.Handoff,
    [SharedPayloadKindEnum.Challenge]: SharedPayloadKindEnum.Challenge
};

export class GameStateBinaryCodecV3 {
    encode(state: EncodableGameStateInterface): string {
        if (state.field.length !== GRID_CELL_COUNT) {
            throw new Error('Invalid sudoku field length');
        }

        const out = new BitOutputStream();

        out.write(CODEC_VERSION_V3, CODEC_VERSION_BITS);
        out.write(state.kind, PAYLOAD_KIND_BITS);
        out.write(0, HAS_TAG_STREAM_BITS);
        out.write(state.isChallengeRun ? 1 : 0, IS_CHALLENGE_RUN_BITS);
        out.write(this.clampMaxMistakes(state.maxMistakes), MAX_MISTAKES_BITS);

        writeGivens(out, state.field);

        return bytesToBase64url(out.bytes());
    }

    decode(payload: string): DecodedGameStateInterface {
        const input = new BitInputStream(base64urlToBytes(payload));

        const version = input.read(CODEC_VERSION_BITS);
        if (version !== CODEC_VERSION_V3) {
            throw new Error('Unsupported game state version');
        }

        const kind = this.readPayloadKind(input);
        input.read(HAS_TAG_STREAM_BITS);
        const isChallengeRun = input.read(IS_CHALLENGE_RUN_BITS) === 1;
        const maxMistakes = input.read(MAX_MISTAKES_BITS);
        const field = readGivens(input);

        return {
            field,
            timelineEvents: [],
            kind,
            maxMistakes,
            elapsedTime: 0,
            isChallengeRun,
            score: 0,
            candidates: {},
            anchorSeconds: 0
        };
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
