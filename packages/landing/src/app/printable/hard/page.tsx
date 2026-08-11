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
import { getTierTechniqueReport } from '../../../rating/utils/get-tier-technique-reports.util';
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../../seo/components/breadcrumbs/breadcrumbs';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
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
        <ArticleSchema
            dateModified={printableHardSudokuPageMetadata.updatedAt}
            datePublished={printableHardSudokuPageMetadata.publishedAt}
            description={printableHardSudokuPageMetadata.metaDescription}
            headline={printableHardSudokuPageMetadata.title}
            path={printableHardSudokuPageMetadata.path}
        />
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Hard</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Printable Sudoku Hard PDF</h1>
        <p>
            Hard drops to {getDifficultyClueCount(DifficultyEnum.Hard)} clues, fewer than half the grid, and this is the first printable
            booklet on the site where a pair alone will not carry you to the end. Solving it on paper means counting to three and four:
            naked and hidden triples, naked and hidden quads, and the <Link href={xWingPageMetadata.path}>X-Wing</Link>, the first pattern
            that reasons across two rows or columns rather than one unit.
        </p>
        <PuzzleBoard givens={PREVIEW_PUZZLE}>Puzzle 1 from the Hard booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</PuzzleBoard>
        <PrintableDownloadCard fileName="hard.pdf" pageCount={PAGE_COUNT} puzzleCount={PRINTABLE_BOOKLET_SIZE} title="Hard Sudoku" />
        <h2>What is inside the booklet</h2>
        <p>
            Not every Hard puzzle actually needs a fish pattern — in our published sample, {hardReport.singlesOnlyPuzzleCount} of{' '}
            {hardReport.sampleSize} Hard puzzles finished on singles alone, a fact the{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> measures directly rather than
            assumes. The {PRINTABLE_BOOKLET_SIZE} puzzles here print {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page with room to mark
            candidates, and the solved grids on the closing pages let you confirm an X-Wing elimination actually held.
        </p>
        <h2>Verifying triples, quads and the X-Wing on paper</h2>
        <p>
            A naked triple or a naked quad is easy to miss on a screen where only a handful of cells are visible at once, but on a full
            printed grid you can circle three or four candidate-sharing cells directly and see the rest of the unit at the same time. The
            X-Wing needs the same wide view across two full rows or columns, which is exactly what a printed page gives you and a small
            phone screen does not. Because these patterns are easy to apply incorrectly the first few times, checking your work against the
            solution pages at the back is worth doing every time until the shape becomes automatic.
        </p>
        <h2>Where to go next</h2>
        <p>
            Chaining subsets and fish together reliably? Move up to the{' '}
            <Link href={printableNightmareSudokuPageMetadata.path}>printable Nightmare sudoku booklet</Link> for swordfish, jellyfish and
            wing patterns. Step back to <Link href={printableMediumSudokuPageMetadata.path}>printable Medium sudoku</Link> for intersections
            only, or play Hard on a screen at the <Link href={hardSudokuPageMetadata.path}>Hard sudoku lander</Link>.
        </p>
        <DifficultyNavigation next={printableNightmareSudokuPageMetadata} previous={printableMediumSudokuPageMetadata} />
    </main>
);

export default PrintableHardSudokuPage;
