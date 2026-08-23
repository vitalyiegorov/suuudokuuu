import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import { getDifficultyClueCount } from '../../../difficulty/utils/get-difficulty-clue-count.util';
import { PrintableDownloadCard } from '../../../printable/components/printable-download-card/printable-download-card';
import {
    PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
    PRINTABLE_BOOKLET_SOLUTIONS_PER_PAGE
} from '../../../printable/constants/printable-layout.constant';
import {
    PRINTABLE_BOOKLET_PUZZLES,
    PRINTABLE_BOOKLET_SIZE,
    PRINTABLE_LARGE_PRINT_SIZE
} from '../../../printable/constants/printable-sample.constant';
import { getPrintableBookletPageCount } from '../../../printable/utils/get-printable-booklet-page-count.util';
import { PuzzleBoard } from '../../../puzzle/components/puzzle-board/puzzle-board';
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../../seo/components/breadcrumbs/breadcrumbs';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { homePageMetadata } from '../../metadata';
import { easySudokuPageMetadata } from '../../sudoku/easy/metadata';
import { printableMediumSudokuPageMetadata } from '../medium/metadata';
import { printableSudokuPageMetadata } from '../metadata';
import { printableNewbieSudokuPageMetadata } from '../newbie/metadata';

import { printableEasySudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableEasySudokuPageMetadata);

const PAGE_COUNT = getPrintableBookletPageCount(
    PRINTABLE_BOOKLET_SIZE,
    PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
    PRINTABLE_BOOKLET_SOLUTIONS_PER_PAGE
);
const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Easy];

const PrintableEasySudokuPage = () => (
    <main>
        <ArticleSchema
            dateModified={printableEasySudokuPageMetadata.updatedAt}
            datePublished={printableEasySudokuPageMetadata.publishedAt}
            description={printableEasySudokuPageMetadata.metaDescription}
            headline={printableEasySudokuPageMetadata.title}
            path={printableEasySudokuPageMetadata.path}
        />
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Easy</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Printable Easy Sudoku (PDF)</h1>
        <p>
            Easy starts at {getDifficultyClueCount(DifficultyEnum.Easy)} clues, six below Newbie, and adds exactly one technique: every
            puzzle in this booklet needs at least one hidden single, and none of them needs anything harder. That single extra pattern is
            what makes this the booklet people print for a relaxed coffee-break solve rather than a teaching aid. It is also the source tier
            for our large-print PDF, sampled at {PRINTABLE_LARGE_PRINT_SIZE} puzzles for readers who want bigger cells.
        </p>
        <PuzzleBoard givens={PREVIEW_PUZZLE}>Puzzle 1 from the Easy booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</PuzzleBoard>
        <PrintableDownloadCard fileName="easy.pdf" pageCount={PAGE_COUNT} puzzleCount={PRINTABLE_BOOKLET_SIZE} title="Easy Sudoku" />
        <h2>What is inside the booklet</h2>
        <p>
            A cover page states the puzzle and page counts up front, then {PRINTABLE_BOOKLET_SIZE} puzzles print{' '}
            {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page so a single sheet holds four complete grids. The last pages hold every solved
            grid at the same layout, so checking an answer never means hunting through a different page format. The whole file is vector
            graphics and a standard PDF font, so it prints cleanly at any size a printer supports.
        </p>
        <h2>Good for a relaxed solve</h2>
        <p>
            Easy is the booklet people reach for when they want to finish a puzzle without stopping to think hard about it — on a train,
            over a coffee break, or as a wind-down before bed. Every deduction still reads off the board rather than off a candidate grid,
            so there is rarely a reason to write a candidate in the margin; the hidden single asks you to scan a whole unit rather than one
            cell, which is a change of habit and not of difficulty. That makes it a natural size for printing several at once and working
            through a small stack over a week, since no single puzzle demands the concentration a Medium or Hard grid does.
        </p>
        <h2>Where to go next</h2>
        <p>
            Ready for intersections and subsets to start mattering? Move on to the{' '}
            <Link href={printableMediumSudokuPageMetadata.path}>printable Medium sudoku booklet</Link>, or step back to{' '}
            <Link href={printableNewbieSudokuPageMetadata.path}>printable Newbie sudoku</Link> for an even gentler grid. To play Easy
            puzzles on a screen instead, visit the <Link href={easySudokuPageMetadata.path}>Easy sudoku lander</Link>.
        </p>
        <DifficultyNavigation next={printableMediumSudokuPageMetadata} previous={printableNewbieSudokuPageMetadata} />
    </main>
);

export default PrintableEasySudokuPage;
