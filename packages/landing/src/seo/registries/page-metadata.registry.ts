import { seventeenClueSudokuPageMetadata } from '../../app/(en)/17-clue-sudoku/metadata';
import { DAILY_PUZZLE_PAGES_METADATA } from '../../app/(en)/daily-sudoku/[date]/metadata';
import { DAILY_ARCHIVE_PAGES_METADATA } from '../../app/(en)/daily-sudoku/archive/[month]/metadata';
import { dailySudokuPageMetadata } from '../../app/(en)/daily-sudoku/metadata';
import { glossaryPageMetadata } from '../../app/(en)/glossary/metadata';
import { sudokuCluesVsDifficultyPageMetadata } from '../../app/(en)/guides/sudoku-clues-vs-difficulty/metadata';
import { sudokuDifficultyRatingPageMetadata } from '../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../../app/(en)/hardest-sudoku-puzzles/metadata';
import { howToPlayPageMetadata } from '../../app/(en)/how-to-play/metadata';
import { largePrintSudokuPageMetadata } from '../../app/(en)/large-print-sudoku/metadata';
import { homePageMetadata } from '../../app/(en)/metadata';
import { printableEasySudokuPageMetadata } from '../../app/(en)/printable/easy/metadata';
import { printableHardSudokuPageMetadata } from '../../app/(en)/printable/hard/metadata';
import { printableHellSudokuPageMetadata } from '../../app/(en)/printable/hell/metadata';
import { printableInfinitySudokuPageMetadata } from '../../app/(en)/printable/infinity/metadata';
import { printableMediumSudokuPageMetadata } from '../../app/(en)/printable/medium/metadata';
import { printableSudokuPageMetadata } from '../../app/(en)/printable/metadata';
import { printableNewbieSudokuPageMetadata } from '../../app/(en)/printable/newbie/metadata';
import { printableNightmareSudokuPageMetadata } from '../../app/(en)/printable/nightmare/metadata';
import { solverPageMetadata } from '../../app/(en)/solver/metadata';
import { sudokuForSeniorsPageMetadata } from '../../app/(en)/sudoku-for-seniors/metadata';
import { easySudokuPageMetadata } from '../../app/(en)/sudoku/easy/metadata';
import { hardSudokuPageMetadata } from '../../app/(en)/sudoku/hard/metadata';
import { hellSudokuPageMetadata } from '../../app/(en)/sudoku/hell/metadata';
import { infinitySudokuPageMetadata } from '../../app/(en)/sudoku/infinity/metadata';
import { mediumSudokuPageMetadata } from '../../app/(en)/sudoku/medium/metadata';
import { sudokuDifficultiesPageMetadata } from '../../app/(en)/sudoku/metadata';
import { newbieSudokuPageMetadata } from '../../app/(en)/sudoku/newbie/metadata';
import { nightmareSudokuPageMetadata } from '../../app/(en)/sudoku/nightmare/metadata';
import { aicPageMetadata } from '../../app/(en)/techniques/aic/metadata';
import { boxLineReductionPageMetadata } from '../../app/(en)/techniques/box-line-reduction/metadata';
import { bugPageMetadata } from '../../app/(en)/techniques/bug/metadata';
import { cellForcingChainPageMetadata } from '../../app/(en)/techniques/cell-forcing-chain/metadata';
import { finnedSwordfishPageMetadata } from '../../app/(en)/techniques/finned-swordfish/metadata';
import { finnedXWingPageMetadata } from '../../app/(en)/techniques/finned-x-wing/metadata';
import { fullHousePageMetadata } from '../../app/(en)/techniques/full-house/metadata';
import { hiddenPairPageMetadata } from '../../app/(en)/techniques/hidden-pair/metadata';
import { hiddenQuadPageMetadata } from '../../app/(en)/techniques/hidden-quad/metadata';
import { hiddenSinglePageMetadata } from '../../app/(en)/techniques/hidden-single/metadata';
import { hiddenTriplePageMetadata } from '../../app/(en)/techniques/hidden-triple/metadata';
import { jellyfishPageMetadata } from '../../app/(en)/techniques/jellyfish/metadata';
import { techniquesPageMetadata } from '../../app/(en)/techniques/metadata';
import { nakedPairPageMetadata } from '../../app/(en)/techniques/naked-pair/metadata';
import { nakedQuadPageMetadata } from '../../app/(en)/techniques/naked-quad/metadata';
import { nakedSinglePageMetadata } from '../../app/(en)/techniques/naked-single/metadata';
import { nakedTriplePageMetadata } from '../../app/(en)/techniques/naked-triple/metadata';
import { nishioForcingChainPageMetadata } from '../../app/(en)/techniques/nishio-forcing-chain/metadata';
import { pointingPairPageMetadata } from '../../app/(en)/techniques/pointing-pair/metadata';
import { pointingTriplePageMetadata } from '../../app/(en)/techniques/pointing-triple/metadata';
import { regionForcingChainPageMetadata } from '../../app/(en)/techniques/region-forcing-chain/metadata';
import { sashimiSwordfishPageMetadata } from '../../app/(en)/techniques/sashimi-swordfish/metadata';
import { sashimiXWingPageMetadata } from '../../app/(en)/techniques/sashimi-x-wing/metadata';
import { simpleColoringPageMetadata } from '../../app/(en)/techniques/simple-coloring/metadata';
import { swordfishPageMetadata } from '../../app/(en)/techniques/swordfish/metadata';
import { uniqueRectanglePageMetadata } from '../../app/(en)/techniques/unique-rectangle/metadata';
import { wWingPageMetadata } from '../../app/(en)/techniques/w-wing/metadata';
import { xChainPageMetadata } from '../../app/(en)/techniques/x-chain/metadata';
import { xWingPageMetadata } from '../../app/(en)/techniques/x-wing/metadata';
import { xyChainPageMetadata } from '../../app/(en)/techniques/xy-chain/metadata';
import { xyWingPageMetadata } from '../../app/(en)/techniques/xy-wing/metadata';
import { xyzWingPageMetadata } from '../../app/(en)/techniques/xyz-wing/metadata';
import { whySuuudokuuuPageMetadata } from '../../app/(en)/why-suuudokuuu/metadata';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';

export const PAGE_METADATA_REGISTRY: readonly PageMetadataInterface[] = [
    homePageMetadata,
    whySuuudokuuuPageMetadata,
    howToPlayPageMetadata,
    sudokuForSeniorsPageMetadata,
    solverPageMetadata,
    dailySudokuPageMetadata,
    ...DAILY_PUZZLE_PAGES_METADATA,
    ...DAILY_ARCHIVE_PAGES_METADATA,
    glossaryPageMetadata,
    sudokuDifficultiesPageMetadata,
    newbieSudokuPageMetadata,
    easySudokuPageMetadata,
    mediumSudokuPageMetadata,
    hardSudokuPageMetadata,
    nightmareSudokuPageMetadata,
    hellSudokuPageMetadata,
    infinitySudokuPageMetadata,
    hardestSudokuPuzzlesPageMetadata,
    seventeenClueSudokuPageMetadata,
    sudokuDifficultyRatingPageMetadata,
    sudokuCluesVsDifficultyPageMetadata,
    printableSudokuPageMetadata,
    printableNewbieSudokuPageMetadata,
    printableEasySudokuPageMetadata,
    printableMediumSudokuPageMetadata,
    printableHardSudokuPageMetadata,
    printableNightmareSudokuPageMetadata,
    printableHellSudokuPageMetadata,
    printableInfinitySudokuPageMetadata,
    largePrintSudokuPageMetadata,
    techniquesPageMetadata,
    fullHousePageMetadata,
    nakedSinglePageMetadata,
    hiddenSinglePageMetadata,
    pointingPairPageMetadata,
    pointingTriplePageMetadata,
    boxLineReductionPageMetadata,
    nakedPairPageMetadata,
    nakedTriplePageMetadata,
    nakedQuadPageMetadata,
    hiddenPairPageMetadata,
    hiddenTriplePageMetadata,
    hiddenQuadPageMetadata,
    xWingPageMetadata,
    swordfishPageMetadata,
    jellyfishPageMetadata,
    finnedXWingPageMetadata,
    finnedSwordfishPageMetadata,
    sashimiXWingPageMetadata,
    sashimiSwordfishPageMetadata,
    xyWingPageMetadata,
    xyzWingPageMetadata,
    wWingPageMetadata,
    xChainPageMetadata,
    xyChainPageMetadata,
    simpleColoringPageMetadata,
    aicPageMetadata,
    uniqueRectanglePageMetadata,
    bugPageMetadata,
    nishioForcingChainPageMetadata,
    cellForcingChainPageMetadata,
    regionForcingChainPageMetadata
];
