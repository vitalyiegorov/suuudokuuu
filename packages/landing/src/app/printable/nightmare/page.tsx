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
import { nightmareSudokuPageMetadata } from '../../sudoku/nightmare/metadata';
import { swordfishPageMetadata } from '../../techniques/swordfish/metadata';
import { xyWingPageMetadata } from '../../techniques/xy-wing/metadata';
import { printableHardSudokuPageMetadata } from '../hard/metadata';
import { printableHellSudokuPageMetadata } from '../hell/metadata';
import { printableSudokuPageMetadata } from '../metadata';

import { printableNightmareSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableNightmareSudokuPageMetadata);

const PAGE_COUNT = getPrintableBookletPageCount(
    PRINTABLE_BOOKLET_SIZE,
    PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
    PRINTABLE_BOOKLET_SOLUTIONS_PER_PAGE
);
const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Nightmare];
const nightmareReport = getTierTechniqueReport(DifficultyEnum.Nightmare);

const PrintableNightmareSudokuPage = () => (
    <main>
        <ArticleSchema
            dateModified={printableNightmareSudokuPageMetadata.updatedAt}
            datePublished={printableNightmareSudokuPageMetadata.publishedAt}
            description={printableNightmareSudokuPageMetadata.metaDescription}
            headline={printableNightmareSudokuPageMetadata.title}
            path={printableNightmareSudokuPageMetadata.path}
        />
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Nightmare</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Printable Nightmare Sudoku (PDF)</h1>
        <p>
            Nightmare holds just {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues, and it is the first booklet where the printed
            page genuinely earns its keep: fish patterns like <Link href={swordfishPageMetadata.path}>swordfish</Link> and jellyfish, and
            wing patterns like <Link href={xyWingPageMetadata.path}>XY-Wing</Link>, are far easier to spot on paper where you can circle
            candidates across rows and columns than on a cramped screen. In our sample, {nightmareReport.singlesOnlyPuzzleCount} of{' '}
            {nightmareReport.sampleSize} Nightmare puzzles still finish on singles alone, while the rest genuinely need one of these
            patterns.
        </p>
        <PuzzleBoard givens={PREVIEW_PUZZLE}>Puzzle 1 from the Nightmare booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</PuzzleBoard>
        <PrintableDownloadCard
            fileName="nightmare.pdf"
            pageCount={PAGE_COUNT}
            puzzleCount={PRINTABLE_BOOKLET_SIZE}
            title="Nightmare Sudoku"
        />
        <h2>What is inside the booklet</h2>
        <p>
            The {PRINTABLE_BOOKLET_SIZE} puzzles print {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, sized so a fish pattern spanning
            three or four lines still fits comfortably on one sheet. Full solved grids close the booklet, which matters more here than at
            the easier tiers — a single missed elimination in a chain of subset and fish reasoning compounds quickly, and a printed answer
            key catches it. The measured spread behind these claims lives in the{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link>.
        </p>
        <h2>Why paper helps with fish and wings</h2>
        <p>
            A swordfish or a jellyfish only becomes obvious once you can trace one digit’s candidates across three or four full lines at
            once, and a wing pattern needs you to hold three separate cells and their shared candidates in mind together. Both are far
            easier to spot with a pencil circling candidates directly on a printed row than by scrolling a phone screen back and forth. It
            is also the first booklet where a wrong elimination compounds: mark a candidate as gone that should have stayed, and the rest of
            the solve can quietly go wrong, so treat the solution pages as a real checkpoint rather than a formality.
        </p>
        <h2>Where to go next</h2>
        <p>
            Fish and wings falling into place? The <Link href={printableHellSudokuPageMetadata.path}>printable Hell sudoku booklet</Link> is
            the last tier, built from a verified 17-clue corpus and solved with chains. Step back to{' '}
            <Link href={printableHardSudokuPageMetadata.path}>printable Hard sudoku</Link> for subsets and the X-Wing only, or play
            Nightmare on a screen at the <Link href={nightmareSudokuPageMetadata.path}>Nightmare sudoku lander</Link>.
        </p>
        <DifficultyNavigation next={printableHellSudokuPageMetadata} previous={printableHardSudokuPageMetadata} />
    </main>
);

export default PrintableNightmareSudokuPage;
