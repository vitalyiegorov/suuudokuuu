import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import { getDifficultyClueCount } from '../../../difficulty/utils/get-difficulty-clue-count.util';
import { PrintableDownloadCard } from '../../../printable/components/printable-download-card/printable-download-card';
import {
    PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
    PRINTABLE_BOOKLET_SOLUTIONS_PER_PAGE
} from '../../../printable/constants/printable-layout.constant';
import { PRINTABLE_BOOKLET_PUZZLES, PRINTABLE_BOOKLET_SIZE } from '../../../printable/constants/printable-sample.constant';
import { getPrintableBookletPageCount } from '../../../printable/utils/get-printable-booklet-page-count.util';
import { PuzzleBoard } from '../../../puzzle/components/puzzle-board/puzzle-board';
import { SeRatingRange } from '../../../rating/components/se-rating-range/se-rating-range';
import { getTierTechniqueReport } from '../../../rating/utils/get-tier-technique-reports.util';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueLink } from '../../../techniques/components/technique-link/technique-link';
import { sudokuDifficultyRatingPageMetadata } from '../../guides/sudoku-difficulty-rating/metadata';
import { homePageMetadata } from '../../metadata';
import { hardSudokuPageMetadata } from '../../sudoku/hard/metadata';
import { xWingPageMetadata } from '../../techniques/x-wing/metadata';
import { printableMediumSudokuPageMetadata } from '../medium/metadata';
import { printableSudokuPageMetadata } from '../metadata';
import { printableNightmareSudokuPageMetadata } from '../nightmare/metadata';

import { printableHardSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableHardSudokuPageMetadata);

const PAGE_COUNT = getPrintableBookletPageCount(
    PRINTABLE_BOOKLET_SIZE,
    PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
    PRINTABLE_BOOKLET_SOLUTIONS_PER_PAGE
);
const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Hard];
const hardReport = getTierTechniqueReport(DifficultyEnum.Hard);

const PrintableHardSudokuPage = () => (
    <main>
        <PageHeader metadata={printableHardSudokuPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Hard</BreadcrumbListItem>
        </PageHeader>
        <p>
            Hard drops to {getDifficultyClueCount(DifficultyEnum.Hard)} clues, and this is the first printable booklet on the site where
            subsets alone will not carry you to the end. Every puzzle in it was tested against a solver that already knows every
            intersection and every subset, and kept only because that solver stalled. What finishes them is a fish or a wing: the{' '}
            <Link href={xWingPageMetadata.path}>X-Wing</Link> and its larger and finned relatives, or one of the bivalue wing patterns.
        </p>
        <PuzzleBoard givens={PREVIEW_PUZZLE}>Puzzle 1 from the Hard booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</PuzzleBoard>
        <PrintableDownloadCard fileName="hard.pdf" pageCount={PAGE_COUNT} puzzleCount={PRINTABLE_BOOKLET_SIZE} title="Hard Sudoku" />
        <h2>What is inside the booklet</h2>
        <p>
            Our published sample of {hardReport.sampleSize} Hard boards measures the tier at SE <SeRatingRange report={hardReport} />, with
            the <TechniqueLink technique={hardReport.typicalHardestTechnique} /> as the most common hardest step — numbers the{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> measures directly rather than
            assumes. The {PRINTABLE_BOOKLET_SIZE} puzzles here print {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page with room to mark
            candidates, and the solved grids on the closing pages let you confirm a fish elimination actually held.
        </p>
        <h2>Verifying fish and wings on paper</h2>
        <p>
            A fish is easy to miss on a screen where only a handful of cells are visible at once, because the pattern lives in where one
            digit can go across two, three or four whole lines at the same time. On a full printed grid you can mark that digit’s remaining
            positions down a column and read the shape off the page. Wings need the opposite view — a few bivalue cells that see each other
            across the grid — and circling them in pencil makes the overlap obvious. Because both families are easy to apply incorrectly the
            first few times, checking your work against the solution pages at the back is worth doing every time until the shape becomes
            automatic.
        </p>
        <h2>Where to go next</h2>
        <p>
            Spotting fish and wings reliably? Move up to the{' '}
            <Link href={printableNightmareSudokuPageMetadata.path}>printable Nightmare sudoku booklet</Link> for chains and coloring. Step
            back to <Link href={printableMediumSudokuPageMetadata.path}>printable Medium sudoku</Link> for intersections and subsets only,
            or play Hard on a screen at the <Link href={hardSudokuPageMetadata.path}>Hard sudoku lander</Link>.
        </p>
        <DifficultyNavigation next={printableNightmareSudokuPageMetadata} previous={printableMediumSudokuPageMetadata} />
    </main>
);

export default PrintableHardSudokuPage;
