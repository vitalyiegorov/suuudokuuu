import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

import { SolutionStepInterface } from '../../interfaces/solution-step.interface';
import { Solution } from '../solution/solution';
import { SudokuStringEncoder } from '../sudoku-string-encoder/sudoku-string-encoder';

export class GameStateSerializer {
    private readonly sudokuEncoder = new SudokuStringEncoder();

    encode(field: string, steps: SolutionStepInterface[], maxMistakes: number, isChallenge: boolean): string {
        const segments = [
            this.sudokuEncoder.encode(field, steps),
            Solution.fromSteps(steps).stringify(),
            String(maxMistakes),
            isChallenge ? '1' : '0'
        ];

        const packed = segments.map(segment => `${segment.length}:${segment}`).join('');

        return compressToEncodedURIComponent(packed);
    }

    decode(gameStateString: string): [field: string, steps: SolutionStepInterface[], maxMistakes: number, isChallenge: boolean] {
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
        return [this.sudokuEncoder.decode(field), solution.getSteps(), parseInt(maxMistakes, 10) || 0, isChallenge === '1'] as const;
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
            const start = colonIndex + 1;

            segments.push(packed.slice(start, start + length));
            position = start + length;
        }

        return segments;
    }
}
