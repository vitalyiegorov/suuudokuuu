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
import { newbieSudokuPageMetadata } from '../../sudoku/newbie/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { printableEasySudokuPageMetadata } from '../easy/metadata';
import { printableSudokuPageMetadata } from '../metadata';

import { printableNewbieSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableNewbieSudokuPageMetadata);

const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Newbie];
const newbieReport = getTierTechniqueReport(DifficultyEnum.Newbie);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const PrintableNewbieSudokuPage = () => (
    <main>
        <PageHeader metadata={printableNewbieSudokuPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Newbie</BreadcrumbListItem>
        </PageHeader>
        <p>
            The printable Newbie Sudoku booklet is a free PDF of {getDifficultyClueCount(DifficultyEnum.Newbie)}-clue puzzles where every
            blank is reachable with a full house or a naked single — a property each puzzle was checked for before it went into the PDF. It
            is the booklet to hand a first-time solver, a classroom just learning the rules, or anyone who wants a puzzle that never demands
            a second guess.
        </p>
        <TechniqueSummary>
            <ul>
                <li>
                    {getDifficultyClueCount(DifficultyEnum.Newbie)} clues out of 81 cells, solvable with full houses and naked singles
                    alone.
                </li>
                <li>
                    {PRINTABLE_BOOKLET_SIZE} puzzles, printed {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with a full solution key.
                </li>
                <li>
                    Our sample of {newbieReport.sampleSize} Newbie boards measures SE <SeRatingRange report={newbieReport} />.
                </li>
                <li>No pencil marks, no elimination logic and no guessing required for any puzzle in the booklet.</li>
            </ul>
        </TechniqueSummary>
        <PuzzleBoard givens={PREVIEW_PUZZLE}>Puzzle 1 from the Newbie booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</PuzzleBoard>
        <PrintableDownloadCard fileName="newbie.pdf" title="Newbie Sudoku">
            <PrintableDownloadFact>{PRINTABLE_BOOKLET_SIZE} puzzles</PrintableDownloadFact>
            <PrintableDownloadFact>{PRINTABLE_BOOKLET_PAGE_COUNT} pages</PrintableDownloadFact>
            <PrintableDownloadFact>{getPrintableFileSizeLabel('newbie.pdf')} PDF, US Letter</PrintableDownloadFact>
            <PrintableDownloadFact>Solutions included on the last pages</PrintableDownloadFact>
        </PrintableDownloadCard>
        <h2>What is inside the booklet</h2>
        <p>
            The PDF opens with a cover page stating the puzzle and page counts, moves into {PRINTABLE_BOOKLET_SIZE} puzzles printed{' '}
            {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, and closes with every solved grid on the final pages so answers never sit next
            to an unsolved puzzle. Every grid is drawn with vector lines and the standard PDF Helvetica font, so it stays sharp at any print
            size and never depends on a scanned image. Our published sample of {newbieReport.sampleSize} Newbie boards measures SE{' '}
            <SeRatingRange report={newbieReport} /> — numbers the{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> measures directly rather than
            assumes.
        </p>
        <h2>Good for a first sudoku habit</h2>
        <p>
            This is the booklet to print for a short daily habit rather than a long sitting: fold it into a notebook, work one grid at a
            time, and there is never a candidate to write down or a pair to track across the row. It also suits a classroom introducing the
            rules for the first time, since a full class can finish a puzzle in the same short window without anyone stalling on an
            intersection they have not been taught yet. The four-per-page layout still leaves each grid large enough to write in
            comfortably, even for a child’s handwriting, and the answer key at the back means a teacher never has to solve the sheet
            themselves to check it.
        </p>
        <h2>Where to go next</h2>
        <p>
            Once full houses and naked singles feel automatic, step up to the{' '}
            <Link href={printableEasySudokuPageMetadata.path}>printable Easy sudoku booklet</Link>, which adds exactly one technique on top:
            the hidden single. To play Newbie puzzles on a screen instead, visit the{' '}
            <Link href={newbieSudokuPageMetadata.path}>Newbie sudoku lander</Link>. For the full technique ladder and the measured data
            behind these claims, see the <Link href={techniquesPageMetadata.path}>technique index</Link> and the{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link>.
        </p>
        <FaqPage>
            <FaqHeading>Printable Newbie Sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is this printable Newbie sudoku booklet free?</FaqQuestion>
                <FaqAnswer>
                    Yes. The PDF downloads free, with no account and no watermark, and includes a full solution key for every puzzle.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How many puzzles are in the printable Newbie sudoku PDF?</FaqQuestion>
                <FaqAnswer>
                    {PRINTABLE_BOOKLET_SIZE} puzzles across {PRINTABLE_BOOKLET_PAGE_COUNT} pages, printed{' '}
                    {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page with the solved grids at the back.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is Newbie the right level for a child or a first-time solver?</FaqQuestion>
                <FaqAnswer>
                    Yes. Every puzzle in the booklet is solvable with a full house or a naked single alone, so no candidate marking or
                    elimination logic is ever required.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I print this Newbie booklet in large print?</FaqQuestion>
                <FaqAnswer>
                    The standard PDF already uses a generous four-puzzles-per-page layout. For bigger cells specifically, see the{' '}
                    <Link href={printableEasySudokuPageMetadata.path}>printable Easy sudoku booklet</Link>, which is also the source tier
                    for our large-print PDF.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <DifficultyNavigation next={printableEasySudokuPageMetadata} />
    </main>
);

export default PrintableNewbieSudokuPage;
