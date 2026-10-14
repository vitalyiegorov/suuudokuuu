import { BitInputStream } from '@thi.ng/bitstream';
import { decompressFromEncodedURIComponent } from 'lz-string';

import { isNotEmptyString } from '@rnw-community/shared';

import { BYTE_BITS } from '../../@generic/constants/base64url.constant';
import { CODEC_PREFIX, CODEC_VERSION_BITS, CODEC_VERSION_V3 } from '../../@generic/constants/binary-codec.constant';
import { CELL_INDEX_BITS, TIMESTAMP_BITS, VALUE_BITS } from '../../@generic/constants/bit-encoding.constant';
import { SharedPayloadKindEnum } from '../../@generic/enums/shared-payload-kind.enum';
import { TimelineEventKindEnum } from '../../@generic/enums/timeline-event-kind.enum';
import { SolutionStepInterface } from '../../@generic/interfaces/solution-step.interface';
import { base64urlToBytes } from '../../@generic/utils/base64url-to-bytes.util';
import { isValidCellIndex } from '../../@generic/utils/is-valid-cell-index.util';
import { isValidCellValue } from '../../@generic/utils/is-valid-cell-value.util';
import { stringToUint8Array } from '../../@generic/utils/string-to-uint8array.util';
import { GameStateBinaryCodec } from '../../game-state-binary-codec/classes/game-state-binary-codec';
import { GameStateBinaryCodecV3 } from '../../game-state-binary-codec/classes/game-state-binary-codec-v3';
import { SudokuStringEncoder } from '../../sudoku-string-encoder/classes/sudoku-string-encoder';

import type { DecodedGameStateInterface } from '../../@generic/interfaces/decoded-game-state.interface';
import type { TimelineEventInterface } from '../../@generic/interfaces/timeline-event.interface';
import type { EncodableGameStateInterface } from '../../game-state-binary-codec/classes/game-state-binary-codec-v3';

type DecodedTupleType = [field: string, steps: SolutionStepInterface[], maxMistakes: number, isChallenge: boolean, elapsedTime: number];

export class GameStateSerializer {
    private readonly sudokuEncoder = new SudokuStringEncoder();

    private readonly binaryCodec = new GameStateBinaryCodec();

    private readonly binaryCodecV3 = new GameStateBinaryCodecV3();

    encodeState(state: EncodableGameStateInterface): string {
        return CODEC_PREFIX + this.binaryCodecV3.encode(state);
    }

    decodeState(gameStateString: string): DecodedGameStateInterface {
        if (gameStateString.startsWith(CODEC_PREFIX)) {
            const body = gameStateString.slice(CODEC_PREFIX.length);

            if (this.isVersionThree(body)) {
                return this.binaryCodecV3.decode(body);
            }
        }

        return this.fromTuple(this.decode(gameStateString));
    }

    encode(field: string, steps: SolutionStepInterface[], maxMistakes: number, isChallenge: boolean): string {
        return this.binaryCodec.encode(field, steps, maxMistakes, isChallenge);
    }

    decode(
        gameStateString: string
    ): [field: string, steps: SolutionStepInterface[], maxMistakes: number, isChallenge: boolean, elapsedTime: number] {
        if (gameStateString.startsWith(CODEC_PREFIX)) {
            return this.binaryCodec.decode(gameStateString.slice(CODEC_PREFIX.length));
        }

        const decompressed = decompressFromEncodedURIComponent(gameStateString);
        if (!decompressed) {
            throw new Error('Failed to decompress game state');
        }

        const segments = this.parseSegments(decompressed);
        if (segments.length < 4) {
            throw new Error('Invalid game state format');
        }

        const [field, steps, maxMistakes, isChallenge] = segments;
        const solutionSteps = this.parseLegacySteps(steps);

        return [
            this.sudokuEncoder.decode(field),
            solutionSteps,
            parseInt(maxMistakes, 10) || 0,
            isChallenge === '1',
            solutionSteps.reduce((total, step) => total + step.ts, 0)
        ] as const;
    }

    private isVersionThree(body: string): boolean {
        const [firstByte] = base64urlToBytes(body);

        return Math.floor(firstByte / 2 ** (BYTE_BITS - CODEC_VERSION_BITS)) === CODEC_VERSION_V3;
    }

    private fromTuple(tuple: DecodedTupleType): DecodedGameStateInterface {
        const [field, steps, maxMistakes, isChallenge, elapsedTime] = tuple;
        const timelineEvents: TimelineEventInterface[] = steps.map(step => ({
            kind: TimelineEventKindEnum.Cell,
            cellIndex: step.cellIndex,
            value: step.value,
            ts: step.ts
        }));

        return {
            field,
            timelineEvents,
            kind: isChallenge ? SharedPayloadKindEnum.Challenge : SharedPayloadKindEnum.Puzzle,
            maxMistakes,
            elapsedTime,
            isChallengeRun: isChallenge,
            score: 0,
            candidates: {},
            anchorSeconds: 0,
            pencilCount: null,
            screenshotCount: null,
            techniques: null,
            hints: null,
            rating: 0,
            isRatingCeiling: false,
            difficulty: null
        };
    }

    private parseLegacySteps(packed: string): SolutionStepInterface[] {
        if (!isNotEmptyString(packed)) {
            return [];
        }

        const input = new BitInputStream(stringToUint8Array(packed));
        const steps: SolutionStepInterface[] = [];
        const bitsPerStep = CELL_INDEX_BITS + VALUE_BITS + TIMESTAMP_BITS;

        while (input.position + bitsPerStep <= input.length) {
            const cellIndex = input.read(CELL_INDEX_BITS);
            const value = input.read(VALUE_BITS);
            const ts = input.read(TIMESTAMP_BITS);

            if (isValidCellIndex(cellIndex) && isValidCellValue(value)) {
                steps.push({ cellIndex, value, ts });
            }
        }

        return steps;
    }

    private parseSegments(packed: string): string[] {
        const segments: string[] = [];
        let position = 0;

        while (position < packed.length) {
            const colonIndex = packed.indexOf(':', position);
            if (colonIndex === -1) {
                break;
            }

            const length = parseInt(packed.slice(position, colonIndex), 10);
            if (isNaN(length) || length < 0) {
                break;
            }

            const start = colonIndex + 1;

            segments.push(packed.slice(start, start + length));
            position = start + length;
        }

        return segments;
    }
}
