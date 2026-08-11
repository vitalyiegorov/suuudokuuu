import { seventeenClueSudokuPageMetadata } from '../../app/17-clue-sudoku/metadata';
import { glossaryPageMetadata } from '../../app/glossary/metadata';
import { sudokuCluesVsDifficultyPageMetadata } from '../../app/guides/sudoku-clues-vs-difficulty/metadata';
import { sudokuDifficultyRatingPageMetadata } from '../../app/guides/sudoku-difficulty-rating/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../../app/hardest-sudoku-puzzles/metadata';
import { howToPlayPageMetadata } from '../../app/how-to-play/metadata';
import { homePageMetadata } from '../../app/metadata';
import { printableEasySudokuPageMetadata } from '../../app/printable/easy/metadata';
import { printableHardSudokuPageMetadata } from '../../app/printable/hard/metadata';
import { printableHellSudokuPageMetadata } from '../../app/printable/hell/metadata';
import { printableMediumSudokuPageMetadata } from '../../app/printable/medium/metadata';
import { printableSudokuPageMetadata } from '../../app/printable/metadata';
import { printableNewbieSudokuPageMetadata } from '../../app/printable/newbie/metadata';
import { printableNightmareSudokuPageMetadata } from '../../app/printable/nightmare/metadata';
import { solverPageMetadata } from '../../app/solver/metadata';
import { easySudokuPageMetadata } from '../../app/sudoku/easy/metadata';
import { hardSudokuPageMetadata } from '../../app/sudoku/hard/metadata';
import { hellSudokuPageMetadata } from '../../app/sudoku/hell/metadata';
import { mediumSudokuPageMetadata } from '../../app/sudoku/medium/metadata';
import { sudokuDifficultiesPageMetadata } from '../../app/sudoku/metadata';
import { newbieSudokuPageMetadata } from '../../app/sudoku/newbie/metadata';
import { nightmareSudokuPageMetadata } from '../../app/sudoku/nightmare/metadata';
import { aicPageMetadata } from '../../app/techniques/aic/metadata';
import { boxLineReductionPageMetadata } from '../../app/techniques/box-line-reduction/metadata';
import { finnedSwordfishPageMetadata } from '../../app/techniques/finned-swordfish/metadata';
import { finnedXWingPageMetadata } from '../../app/techniques/finned-x-wing/metadata';
import { fullHousePageMetadata } from '../../app/techniques/full-house/metadata';
import { hiddenPairPageMetadata } from '../../app/techniques/hidden-pair/metadata';
import { hiddenQuadPageMetadata } from '../../app/techniques/hidden-quad/metadata';
import { hiddenSinglePageMetadata } from '../../app/techniques/hidden-single/metadata';
import { hiddenTriplePageMetadata } from '../../app/techniques/hidden-triple/metadata';
import { jellyfishPageMetadata } from '../../app/techniques/jellyfish/metadata';
import { techniquesPageMetadata } from '../../app/techniques/metadata';
import { nakedPairPageMetadata } from '../../app/techniques/naked-pair/metadata';
import { nakedQuadPageMetadata } from '../../app/techniques/naked-quad/metadata';
import { nakedSinglePageMetadata } from '../../app/techniques/naked-single/metadata';
import { nakedTriplePageMetadata } from '../../app/techniques/naked-triple/metadata';
import { pointingPairPageMetadata } from '../../app/techniques/pointing-pair/metadata';
import { pointingTriplePageMetadata } from '../../app/techniques/pointing-triple/metadata';
import { sashimiSwordfishPageMetadata } from '../../app/techniques/sashimi-swordfish/metadata';
import { sashimiXWingPageMetadata } from '../../app/techniques/sashimi-x-wing/metadata';
import { simpleColoringPageMetadata } from '../../app/techniques/simple-coloring/metadata';
import { swordfishPageMetadata } from '../../app/techniques/swordfish/metadata';
import { wWingPageMetadata } from '../../app/techniques/w-wing/metadata';
import { xChainPageMetadata } from '../../app/techniques/x-chain/metadata';
import { xWingPageMetadata } from '../../app/techniques/x-wing/metadata';
import { xyChainPageMetadata } from '../../app/techniques/xy-chain/metadata';
import { xyWingPageMetadata } from '../../app/techniques/xy-wing/metadata';
import { xyzWingPageMetadata } from '../../app/techniques/xyz-wing/metadata';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';

export const PAGE_METADATA_REGISTRY: PageMetadataInterface[] = [
    homePageMetadata,
    howToPlayPageMetadata,
    solverPageMetadata,
    glossaryPageMetadata,
    sudokuDifficultiesPageMetadata,
    newbieSudokuPageMetadata,
    easySudokuPageMetadata,
    mediumSudokuPageMetadata,
    hardSudokuPageMetadata,
    nightmareSudokuPageMetadata,
    hellSudokuPageMetadata,
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
    aicPageMetadata
];
