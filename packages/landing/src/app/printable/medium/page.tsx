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
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../../seo/components/breadcrumbs/breadcrumbs';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { homePageMetadata } from '../../metadata';
import { mediumSudokuPageMetadata } from '../../sudoku/medium/metadata';
import { boxLineReductionPageMetadata } from '../../techniques/box-line-reduction/metadata';
import { pointingPairPageMetadata } from '../../techniques/pointing-pair/metadata';
import { printableEasySudokuPageMetadata } from '../easy/metadata';
import { printableHardSudokuPageMetadata } from '../hard/metadata';
import { printableSudokuPageMetadata } from '../metadata';

import { printableMediumSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableMediumSudokuPageMetadata);

const PAGE_COUNT = getPrintableBookletPageCount(
    PRINTABLE_BOOKLET_SIZE,
    PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
    PRINTABLE_BOOKLET_SOLUTIONS_PER_PAGE
);
const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Medium];

const PrintableMediumSudokuPage = () => (
    <main>
        <ArticleSchema
            dateModified={printableMediumSudokuPageMetadata.updatedAt}
            datePublished={printableMediumSudokuPageMetadata.publishedAt}
            description={printableMediumSudokuPageMetadata.metaDescription}
            headline={printableMediumSudokuPageMetadata.title}
            path={printableMediumSudokuPageMetadata.path}
        />
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Medium</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Printable Medium Sudoku (PDF)</h1>
        <p>
            At {getDifficultyClueCount(DifficultyEnum.Medium)} clues out of 81 cells, this booklet is the first one worth solving with a
            pencil. Singles carry a Medium grid part of the way, but every puzzle in it provably stalls on them — that is the test each
            board had to fail to be printed here — until you spot a <Link href={pointingPairPageMetadata.path}>pointing pair</Link> or a{' '}
            <Link href={boxLineReductionPageMetadata.path}>box-line reduction</Link>, an intersection between a box and a line that only
            eliminates candidates, never places a digit outright. Nothing in the booklet needs a fish, a wing or a chain.
        </p>
        <PuzzleBoard givens={PREVIEW_PUZZLE}>Puzzle 1 from the Medium booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</PuzzleBoard>
        <PrintableDownloadCard fileName="medium.pdf" pageCount={PAGE_COUNT} puzzleCount={PRINTABLE_BOOKLET_SIZE} title="Medium Sudoku" />
        <h2>What is inside the booklet</h2>
        <p>
            Print space here matters more than at the easier tiers, because intersections and pairs work by marking candidates in the
            margins. The {PRINTABLE_BOOKLET_SIZE} puzzles print {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page at full cell size, leaving
            enough room around each digit to pencil in the small numbers an intersection or a pair reasons over. Solved grids close out the
            file so you can check your candidate marks against a confirmed answer.
        </p>
        <h2>Tips for pencil-mark solving</h2>
        <p>
            An intersection or a pair only becomes visible once you can see every remaining candidate in a row, column or box at a glance,
            which is why paper genuinely helps here more than a screen does: write small digits in the corner of each blank cell, then scan
            a line for a digit trapped inside one box, or two cells sharing exactly two candidates between them. Neither pattern places a
            digit by itself — each one only removes candidates — so expect to mark a few eliminations before a fresh naked single actually
            appears. Working in pencil rather than pen means a wrong mark costs nothing to erase.
        </p>
        <h2>Where to go next</h2>
        <p>
            When intersections start feeling automatic, move up to the{' '}
            <Link href={printableHardSudokuPageMetadata.path}>printable Hard sudoku booklet</Link> for fish and wing patterns. Drop back to{' '}
            <Link href={printableEasySudokuPageMetadata.path}>printable Easy sudoku</Link> for a singles-only warm-up, or play Medium on a
            screen at the <Link href={mediumSudokuPageMetadata.path}>Medium sudoku lander</Link>.
        </p>
        <DifficultyNavigation next={printableHardSudokuPageMetadata} previous={printableEasySudokuPageMetadata} />
    </main>
);

export default PrintableMediumSudokuPage;
