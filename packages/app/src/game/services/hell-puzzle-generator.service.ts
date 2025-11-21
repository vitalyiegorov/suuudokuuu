import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

export class HellPuzzleGeneratorService {
    private isGenerating = false;
    private generationQueue: string[] = [];
    private readonly maxPuzzles = 10;

    /**
     * Start generating Hell puzzles in the background
     */
    startGenerating(onPuzzleGenerated: (puzzle: string) => void): void {
        if (this.isGenerating) {
            return;
        }

        this.isGenerating = true;
        this.generatePuzzlesInBackground(onPuzzleGenerated);
    }

    /**
     * Stop generating puzzles
     */
    stopGenerating(): void {
        this.isGenerating = false;
    }

    /**
     * Check if currently generating
     */
    isCurrentlyGenerating(): boolean {
        return this.isGenerating;
    }

    /**
     * Get current queue size
     */
    getQueueSize(): number {
        return this.generationQueue.length;
    }

    /**
     * Generate puzzles in the background using requestIdleCallback or setTimeout
     */
    private generatePuzzlesInBackground(onPuzzleGenerated: (puzzle: string) => void): void {
        // eslint-disable-next-line max-statements
        const generateNextPuzzle = () => {
            if (!this.isGenerating) {
                return;
            }

            if (this.generationQueue.length >= this.maxPuzzles) {
                this.isGenerating = false;
                
return;
            }

            try {
                const sudoku = new Sudoku(defaultSudokuConfig);
                sudoku.create(DifficultyEnum.Hell);
                const puzzleString = sudoku.toString();

                this.generationQueue.push(puzzleString);
                onPuzzleGenerated(puzzleString);
            } catch {
                // Silently fail puzzle generation
            }

            // Continue generating if we haven't reached the max
            if (this.generationQueue.length < this.maxPuzzles) {
                if (typeof requestIdleCallback === 'undefined') {
                    setTimeout(generateNextPuzzle, 100);
                } else {
                    requestIdleCallback(() => void generateNextPuzzle(), { timeout: 2000 });
                }
            } else {
                this.isGenerating = false;
            }
        };

        // Start the generation process
        if (typeof requestIdleCallback === 'undefined') {
            setTimeout(generateNextPuzzle, 100);
        } else {
            requestIdleCallback(() => void generateNextPuzzle(), { timeout: 2000 });
        }
    }
}

export const hellPuzzleGeneratorService = new HellPuzzleGeneratorService();
