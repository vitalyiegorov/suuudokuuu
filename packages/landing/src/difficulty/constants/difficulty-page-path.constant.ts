import { DifficultyEnum } from '@suuudokuuu/generator';

import { easySudokuPageMetadata } from '../../app/sudoku/easy/metadata';
import { hardSudokuPageMetadata } from '../../app/sudoku/hard/metadata';
import { hellSudokuPageMetadata } from '../../app/sudoku/hell/metadata';
import { mediumSudokuPageMetadata } from '../../app/sudoku/medium/metadata';
import { newbieSudokuPageMetadata } from '../../app/sudoku/newbie/metadata';
import { nightmareSudokuPageMetadata } from '../../app/sudoku/nightmare/metadata';

import type { LandingDifficultyType } from '../types/landing-difficulty.type';

export const DIFFICULTY_PAGE_PATHS: Record<LandingDifficultyType, string> = {
    [DifficultyEnum.Newbie]: newbieSudokuPageMetadata.path,
    [DifficultyEnum.Easy]: easySudokuPageMetadata.path,
    [DifficultyEnum.Medium]: mediumSudokuPageMetadata.path,
    [DifficultyEnum.Hard]: hardSudokuPageMetadata.path,
    [DifficultyEnum.Nightmare]: nightmareSudokuPageMetadata.path,
    [DifficultyEnum.Hell]: hellSudokuPageMetadata.path
};
