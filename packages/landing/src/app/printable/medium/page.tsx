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
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { sudokuDifficultyRatingPageMetadata } from '../../guides/sudoku-difficulty-rating/metadata';
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

const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Medium];
const mediumReport = getTierTechniqueReport(DifficultyEnum.Medium);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const PrintableMediumSudokuPage = () => (
    <main>
        <PageHeader metadata={printableMediumSudokuPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Medium</BreadcrumbListItem>
        </PageHeader>
        <p>
            At {getDifficultyClueCount(DifficultyEnum.Medium)} clues out of 81 cells, this booklet is the first one worth solving with a
            pencil. Singles carry a Medium grid part of the way, but every puzzle in it provably stalls on them — that is the test each
            board had to fail to be printed here — until you spot a <Link href={pointingPairPageMetadata.path}>pointing pair</Link> or a{' '}
            <Link href={boxLineReductionPageMetadata.path}>box-line reduction</Link>, an intersection between a box and a line that only
            eliminates candidates, never places a digit outright. Nothing in the booklet needs a fish, a wing or a chain.
        </p>
        <TechniqueSummary>
            <ul>
                <li>
                    {getDifficultyClueCount(DifficultyEnum.Medium)} clues out of 81 cells, guaranteed to stall on singles and yield to an
                    intersection or a subset.
                </li>
                <li>
                    {PRINTABLE_BOOKLET_SIZE} puzzles, printed {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with a full solution key.
                </li>
                <li>
                    Our sample of {mediumReport.sampleSize} Medium boards measures SE <SeRatingRange report={mediumReport} />.
                </li>
                <li>Nothing in the booklet needs a fish, a wing or a chain.</li>
            </ul>
        </TechniqueSummary>
        <PuzzleBoard givens={PREVIEW_PUZZLE}>Puzzle 1 from the Medium booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</PuzzleBoard>
        <PrintableDownloadCard fileName="medium.pdf" title="Medium Sudoku">
            <PrintableDownloadFact>{PRINTABLE_BOOKLET_SIZE} puzzles</PrintableDownloadFact>
            <PrintableDownloadFact>{PRINTABLE_BOOKLET_PAGE_COUNT} pages</PrintableDownloadFact>
            <PrintableDownloadFact>{getPrintableFileSizeLabel('medium.pdf')} PDF, US Letter</PrintableDownloadFact>
            <PrintableDownloadFact>Solutions included on the last pages</PrintableDownloadFact>
        </PrintableDownloadCard>
        <h2>What is inside the booklet</h2>
        <p>
            Print space here matters more than at the easier tiers, because intersections and pairs work by marking candidates in the
            margins. The {PRINTABLE_BOOKLET_SIZE} puzzles print {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page at full cell size, leaving
            enough room around each digit to pencil in the small numbers an intersection or a pair reasons over. Solved grids close out the
            file so you can check your candidate marks against a confirmed answer. Our published sample of {mediumReport.sampleSize} Medium
            boards measures SE <SeRatingRange report={mediumReport} /> — numbers the{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> measures directly rather than
            assumes.
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
        <FaqPage>
            <FaqHeading>Printable Medium Sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is the printable Medium sudoku PDF free?</FaqQuestion>
                <FaqAnswer>Yes, with no account and no watermark, and every puzzle’s solved grid is included at the back.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What techniques does this Medium booklet require?</FaqQuestion>
                <FaqAnswer>
                    At least one <Link href={pointingPairPageMetadata.path}>pointing pair</Link>,{' '}
                    <Link href={boxLineReductionPageMetadata.path}>box-line reduction</Link>, or a naked or hidden pair, on top of the
                    singles the easier booklets already use. Nothing needs a fish, a wing or a chain.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why does this booklet leave more room around each digit?</FaqQuestion>
                <FaqAnswer>
                    Intersections and pairs are found by marking every remaining candidate in a unit, so the layout leaves space in each
                    cell specifically for those pencil marks.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How many puzzles are in the printable Medium sudoku PDF?</FaqQuestion>
                <FaqAnswer>
                    {PRINTABLE_BOOKLET_SIZE} puzzles across {PRINTABLE_BOOKLET_PAGE_COUNT} pages, four to a page, with the solved grids at
                    the back.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <DifficultyNavigation next={printableHardSudokuPageMetadata} previous={printableEasySudokuPageMetadata} />
    </main>
);

export default PrintableMediumSudokuPage;
