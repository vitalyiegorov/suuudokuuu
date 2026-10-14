import { DifficultyEnum } from '@suuudokuuu/generator';

import { easySudokuPageMetadata } from '../../app/(en)/sudoku/easy/metadata';
import { hardSudokuPageMetadata } from '../../app/(en)/sudoku/hard/metadata';
import { hellSudokuPageMetadata } from '../../app/(en)/sudoku/hell/metadata';
import { infinitySudokuPageMetadata } from '../../app/(en)/sudoku/infinity/metadata';
import { mediumSudokuPageMetadata } from '../../app/(en)/sudoku/medium/metadata';
import { newbieSudokuPageMetadata } from '../../app/(en)/sudoku/newbie/metadata';
import { nightmareSudokuPageMetadata } from '../../app/(en)/sudoku/nightmare/metadata';

export const DIFFICULTY_PAGE_PATHS: Record<DifficultyEnum, string> = {
    [DifficultyEnum.Newbie]: newbieSudokuPageMetadata.path,
    [DifficultyEnum.Easy]: easySudokuPageMetadata.path,
    [DifficultyEnum.Medium]: mediumSudokuPageMetadata.path,
    [DifficultyEnum.Hard]: hardSudokuPageMetadata.path,
    [DifficultyEnum.Nightmare]: nightmareSudokuPageMetadata.path,
    [DifficultyEnum.Hell]: hellSudokuPageMetadata.path,
    [DifficultyEnum.Infinity]: infinitySudokuPageMetadata.path
};
