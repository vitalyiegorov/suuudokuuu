import { PRINTABLE_COVER_PAGE_COUNT } from '../constants/printable-layout.constant';

export const getPrintableBookletPageCount = (puzzleCount: number, puzzlesPerPage: number, solutionsPerPage: number): number =>
    PRINTABLE_COVER_PAGE_COUNT + Math.ceil(puzzleCount / puzzlesPerPage) + Math.ceil(puzzleCount / solutionsPerPage);
