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
import { seventeenClueSudokuPageMetadata } from '../../17-clue-sudoku/metadata';
import { homePageMetadata } from '../../metadata';
import { hellSudokuPageMetadata } from '../../sudoku/hell/metadata';
import { aicPageMetadata } from '../../techniques/aic/metadata';
import { printableSudokuPageMetadata } from '../metadata';
import { printableNightmareSudokuPageMetadata } from '../nightmare/metadata';

import { printableHellSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableHellSudokuPageMetadata);

const PAGE_COUNT = getPrintableBookletPageCount(
    PRINTABLE_BOOKLET_SIZE,
    PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
    PRINTABLE_BOOKLET_SOLUTIONS_PER_PAGE
);
const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Hell];
const hellReport = getTierTechniqueReport(DifficultyEnum.Hell);

const PrintableHellSudokuPage = () => (
    <main>
        <ArticleSchema
            dateModified={printableHellSudokuPageMetadata.updatedAt}
            datePublished={printableHellSudokuPageMetadata.publishedAt}
            description={printableHellSudokuPageMetadata.metaDescription}
            headline={printableHellSudokuPageMetadata.title}
            path={printableHellSudokuPageMetadata.path}
        />
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Hell</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Printable Hell Sudoku PDF (17 Clues)</h1>
        <p>
            Every puzzle in this booklet carries exactly {getDifficultyClueCount(DifficultyEnum.Hell)} clues, the proven minimum for a
            sudoku with one unique solution, drawn from our bundled and independently verified 17-clue corpus rather than generated fresh.
            It is the only tier where singles never finish the job on their own: in our published sample,{' '}
            {hellReport.singlesOnlyPuzzleCount} of {hellReport.sampleSize} Hell puzzles needed chain or coloring techniques such as{' '}
            <Link href={aicPageMetadata.path}>AIC</Link>. See the <Link href={seventeenClueSudokuPageMetadata.path}>17-clue guide</Link> for
            why the clue count itself is the headline fact here.
        </p>
        <PuzzleBoard givens={PREVIEW_PUZZLE}>Puzzle 1 from the Hell booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</PuzzleBoard>
        <PrintableDownloadCard fileName="hell.pdf" pageCount={PAGE_COUNT} puzzleCount={PRINTABLE_BOOKLET_SIZE} title="Hell Sudoku" />
        <h2>What is inside the booklet</h2>
        <p>
            With so few givens, the printed grid looks almost empty at first glance — the {PRINTABLE_BOOKLET_SIZE} puzzles print{' '}
            {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page with generous cell size specifically so there is room to track candidates by hand
            across a long chain. The final pages hold the completed grids, which is close to essential at this tier: verifying a chain of
            eliminations by eye is slow, and a printed key lets you confirm the end state without re-deriving the whole path.
        </p>
        <h2>How the puzzles are verified</h2>
        <p>
            Every 17-clue puzzle in this booklet comes from a bundled corpus that Suuudokuuu checks with two independent solving algorithms
            — a Dancing Links exact-cover solver and a typed-array bitmask solver — before it ships, rather than generating a fresh grid and
            hoping the clue count still leaves a unique solution. That is deliberate: seventeen clues is the smallest mathematically proven
            count that can still guarantee one solution, so there is no safety margin for a generator to get it slightly wrong. Printing
            from a pre-verified source means every puzzle here is guaranteed solvable before you ever pick up a pencil.
        </p>
        <h2>Where to go next</h2>
        <p>
            Not ready for chains on paper yet? Step back to the{' '}
            <Link href={printableNightmareSudokuPageMetadata.path}>printable Nightmare sudoku booklet</Link> for fish and wings without
            chain-length reasoning, or play Hell on a screen at the <Link href={hellSudokuPageMetadata.path}>Hell sudoku lander</Link>,
            where the same 17-clue corpus powers every puzzle.
        </p>
        <DifficultyNavigation previous={printableNightmareSudokuPageMetadata} />
    </main>
);

export default PrintableHellSudokuPage;
