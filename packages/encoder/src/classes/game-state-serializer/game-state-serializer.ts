import { decompressFromEncodedURIComponent } from 'lz-string';

import { CODEC_PREFIX } from '../../constants/binary-codec.constant';
import { SolutionStepInterface } from '../../interfaces/solution-step.interface';
import { GameStateBinaryCodec } from '../game-state-binary-codec/game-state-binary-codec';
import { Solution } from '../solution/solution';
import { SudokuStringEncoder } from '../sudoku-string-encoder/sudoku-string-encoder';

export class GameStateSerializer {
    private readonly sudokuEncoder = new SudokuStringEncoder();

    private readonly binaryCodec = new GameStateBinaryCodec();

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
        const solution = Solution.fromString(steps);

        return [
            this.sudokuEncoder.decode(field),
            solution.getSteps(),
            parseInt(maxMistakes, 10) || 0,
            isChallenge === '1',
            solution.getElapsedTime()
        ] as const;
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
