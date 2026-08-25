import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import { getDifficultyClueCount } from '../../../difficulty/utils/get-difficulty-clue-count.util';
import { PrintableDownloadCard } from '../../../printable/components/printable-download-card/printable-download-card';
import { PrintableDownloadFact } from '../../../printable/components/printable-download-fact/printable-download-fact';
import { PRINTABLE_BOOKLET_PUZZLES_PER_PAGE } from '../../../printable/constants/printable-layout.constant';
import { PRINTABLE_BOOKLET_PAGE_COUNT } from '../../../printable/constants/printable-page-count.constant';
import { PRINTABLE_BOOKLET_PUZZLES, PRINTABLE_BOOKLET_SIZE } from '../../../printable/constants/printable-sample.constant';
import { getPrintableFileSizeLabel } from '../../../printable/utils/get-printable-file-size-label.util';
import { PuzzleBoard } from '../../../puzzle/components/puzzle-board/puzzle-board';
import { SeRatingRange } from '../../../rating/components/se-rating-range/se-rating-range';
import { getTierTechniqueReport } from '../../../rating/utils/get-tier-technique-reports.util';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueLink } from '../../../techniques/components/technique-link/technique-link';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
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

const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Hard];
const hardReport = getTierTechniqueReport(DifficultyEnum.Hard);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
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
        <TechniqueSummary>
            <ul>
                <li>
                    {getDifficultyClueCount(DifficultyEnum.Hard)} clues out of 81 cells, guaranteed to need at least one fish or wing
                    pattern beyond every subset.
                </li>
                <li>
                    {PRINTABLE_BOOKLET_SIZE} puzzles, printed {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with a full solution key.
                </li>
                <li>
                    Our sample of {hardReport.sampleSize} Hard boards measures SE <SeRatingRange report={hardReport} />.
                </li>
                <li>Nothing in the booklet needs a chain — that starts at the Nightmare tier.</li>
            </ul>
        </TechniqueSummary>
        <PuzzleBoard givens={PREVIEW_PUZZLE}>Puzzle 1 from the Hard booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</PuzzleBoard>
        <PrintableDownloadCard fileName="hard.pdf" title="Hard Sudoku">
            <PrintableDownloadFact>{PRINTABLE_BOOKLET_SIZE} puzzles</PrintableDownloadFact>
            <PrintableDownloadFact>{PRINTABLE_BOOKLET_PAGE_COUNT} pages</PrintableDownloadFact>
            <PrintableDownloadFact>{getPrintableFileSizeLabel('hard.pdf')} PDF, US Letter</PrintableDownloadFact>
            <PrintableDownloadFact>Solutions included on the last pages</PrintableDownloadFact>
        </PrintableDownloadCard>
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
        <FaqPage>
            <FaqHeading>Printable Hard Sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is the printable Hard sudoku PDF free?</FaqQuestion>
                <FaqAnswer>Yes, with no account and no watermark, and every puzzle’s solved grid is included at the back.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What techniques does this Hard booklet require?</FaqQuestion>
                <FaqAnswer>
                    At least one fish (<Link href={xWingPageMetadata.path}>X-Wing</Link> and its larger and finned relatives) or one bivalue
                    wing pattern, on top of every intersection and subset the easier booklets already need.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How is a fish or wing easier to verify on paper?</FaqQuestion>
                <FaqAnswer>
                    A fish spans whole rows or columns at once, which is easier to trace by marking a digit’s remaining positions down a
                    printed column than by scrolling a screen. Wings need the opposite view — a few bivalue cells seen at a glance.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How many puzzles are in the printable Hard sudoku PDF?</FaqQuestion>
                <FaqAnswer>
                    {PRINTABLE_BOOKLET_SIZE} puzzles across {PRINTABLE_BOOKLET_PAGE_COUNT} pages, four to a page, with the solved grids at
                    the back.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <DifficultyNavigation next={printableNightmareSudokuPageMetadata} previous={printableMediumSudokuPageMetadata} />
    </main>
);

export default PrintableHardSudokuPage;
