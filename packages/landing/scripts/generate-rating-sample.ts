import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { getHellCorpusRecord } from '@suuudokuuu/hell-corpus';
import { forgePuzzle } from '@suuudokuuu/puzzle-forge';

import { DIFFICULTY_LADDER, DIFFICULTY_NAMES } from '../src/difficulty/constants/difficulty-name.constant';

import type { LandingDifficultyType } from '../src/difficulty/types/landing-difficulty.type';
import type { RatedSamplePuzzleInterface } from '../src/rating/interfaces/rated-sample-puzzle.interface';

const RATING_SAMPLE_SIZE = 40;
const SAMPLE_FILE_PATH = join(import.meta.dirname, '..', 'src', 'rating', 'constants', 'rating-sample.constant.ts');
const FORGE_ATTEMPT_BUDGET = 256;
const IN_BAND_RETRY_LIMIT = 8;

const forgeInBandPuzzle = (difficulty: LandingDifficultyType): RatedSamplePuzzleInterface => {
    for (let attempt = 0; attempt < IN_BAND_RETRY_LIMIT; attempt += 1) {
        const forged = forgePuzzle(difficulty, FORGE_ATTEMPT_BUDGET);

        if (forged.isInBand) {
            return { puzzle: forged.sudoku.toString(), rating: forged.rating, isRatingCeiling: forged.isRatingCeiling };
        }
    }

    throw new Error(`The forge could not place a ${DIFFICULTY_NAMES[difficulty]} board inside its band`);
};

const buildTierSample = (difficulty: LandingDifficultyType): RatedSamplePuzzleInterface[] => {
    if (difficulty === DifficultyEnum.Hell) {
        return Array.from({ length: RATING_SAMPLE_SIZE }, (_, index) => getHellCorpusRecord(index)).map(record => ({
            puzzle: Sudoku.fromString(record.puzzle, defaultSudokuConfig).toString(),
            rating: record.rating,
            isRatingCeiling: record.isCeiling
        }));
    }

    return Array.from({ length: RATING_SAMPLE_SIZE }, () => forgeInBandPuzzle(difficulty));
};

const getTierConstantName = (difficulty: LandingDifficultyType): string => `${DIFFICULTY_NAMES[difficulty].toUpperCase()}_SAMPLE`;

const renderSampleEntry = (entry: RatedSamplePuzzleInterface): string =>
    `    { puzzle: '${entry.puzzle}', rating: ${entry.rating.toFixed(1)}, isRatingCeiling: ${String(entry.isRatingCeiling)} }`;

const renderTier = (difficulty: LandingDifficultyType, entries: RatedSamplePuzzleInterface[]): string =>
    [`const ${getTierConstantName(difficulty)}: RatedSamplePuzzleInterface[] = [`, entries.map(renderSampleEntry).join(',\n'), '];'].join(
        '\n'
    );

const renderSampleFile = (tiers: string[]): string =>
    [
        "import { DifficultyEnum } from '@suuudokuuu/generator';",
        '',
        "import type { LandingDifficultyType } from '../../difficulty/types/landing-difficulty.type';",
        "import type { RatedSamplePuzzleInterface } from '../interfaces/rated-sample-puzzle.interface';",
        '',
        `export const RATING_SAMPLE_SIZE = ${RATING_SAMPLE_SIZE};`,
        '',
        tiers.join('\n\n'),
        '',
        'export const RATING_SAMPLE_PUZZLES: Record<LandingDifficultyType, RatedSamplePuzzleInterface[]> = {',
        DIFFICULTY_LADDER.map(
            difficulty => `    [DifficultyEnum.${DIFFICULTY_NAMES[difficulty]}]: ${getTierConstantName(difficulty)}`
        ).join(',\n'),
        '};',
        '',
        'export const RATING_SAMPLE_TOTAL = RATING_SAMPLE_SIZE * Object.keys(RATING_SAMPLE_PUZZLES).length;',
        ''
    ].join('\n');

const generateRatingSample = (): void => {
    const tiers = DIFFICULTY_LADDER.map(difficulty => {
        const entries = buildTierSample(difficulty);

        process.stdout.write(`${DIFFICULTY_NAMES[difficulty]}: ${entries.length} puzzles forged\n`);

        return renderTier(difficulty, entries);
    });

    writeFileSync(SAMPLE_FILE_PATH, renderSampleFile(tiers), 'utf8');
    process.stdout.write(`Wrote ${SAMPLE_FILE_PATH}\n`);
};

generateRatingSample();
