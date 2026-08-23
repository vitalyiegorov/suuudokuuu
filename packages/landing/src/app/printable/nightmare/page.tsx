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
        <PageHeader metadata={printableNightmareSudokuPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Nightmare</BreadcrumbListItem>
        </PageHeader>
        <p>
            Nightmare holds just {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues, and it is the booklet where the printed page
            genuinely earns its keep. Every puzzle in it was tested against a solver that already knows every fish and wing — including the{' '}
            <Link href={swordfishPageMetadata.path}>swordfish</Link> and the <Link href={xyWingPageMetadata.path}>XY-Wing</Link> — and kept
            only because that solver stalled. What finishes them is chain reasoning, and a chain is far easier to build on paper, where you
            can pencil the links in and follow them, than on a cramped screen. Our sample of {nightmareReport.sampleSize} boards measures
            the tier at SE <SeRatingRange report={nightmareReport} />.
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
            The {PRINTABLE_BOOKLET_SIZE} puzzles print {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, sized so a chain crossing the whole
            grid still fits comfortably on one sheet. Full solved grids close the booklet, which matters more here than at the easier tiers
            — a single missed elimination partway along a chain compounds quickly, and a printed answer key catches it. The measured spread
            behind these claims lives in the <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link>.
        </p>
        <h2>Why paper helps with chains</h2>
        <p>
            A chain has no fixed shape: it is built link by link, and the only way to keep track of it is to write it down. On paper you can
            mark each strong and weak link as you go, follow the alternation to the far end, and see immediately which cells both ends can
            see. That is genuinely awkward on a phone screen you have to scroll. It is also the booklet where a wrong elimination compounds
            worst: mark a candidate as gone that should have stayed, and every link after it is unsound, so treat the solution pages as a
            real checkpoint rather than a formality.
        </p>
        <h2>Where to go next</h2>
        <p>
            Chains falling into place? The <Link href={printableHellSudokuPageMetadata.path}>printable Hell sudoku booklet</Link> is the
            last tier, built from a verified 17-clue corpus. Step back to{' '}
            <Link href={printableHardSudokuPageMetadata.path}>printable Hard sudoku</Link> for fish and wings only, or play Nightmare on a
            screen at the <Link href={nightmareSudokuPageMetadata.path}>Nightmare sudoku lander</Link>.
        </p>
        <DifficultyNavigation next={printableHellSudokuPageMetadata} previous={printableHardSudokuPageMetadata} />
    </main>
);

export default PrintableNightmareSudokuPage;
