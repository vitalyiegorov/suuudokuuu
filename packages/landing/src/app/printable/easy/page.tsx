import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import { getDifficultyClueCount } from '../../../difficulty/utils/get-difficulty-clue-count.util';
import { PrintableDownloadCard } from '../../../printable/components/printable-download-card/printable-download-card';
import { PrintableDownloadFact } from '../../../printable/components/printable-download-fact/printable-download-fact';
import { PRINTABLE_BOOKLET_PUZZLES_PER_PAGE } from '../../../printable/constants/printable-layout.constant';
import { PRINTABLE_BOOKLET_PAGE_COUNT } from '../../../printable/constants/printable-page-count.constant';
import {
    PRINTABLE_BOOKLET_PUZZLES,
    PRINTABLE_BOOKLET_SIZE,
    PRINTABLE_LARGE_PRINT_SIZE
} from '../../../printable/constants/printable-sample.constant';
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
import { easySudokuPageMetadata } from '../../sudoku/easy/metadata';
import { hiddenSinglePageMetadata } from '../../techniques/hidden-single/metadata';
import { printableMediumSudokuPageMetadata } from '../medium/metadata';
import { printableSudokuPageMetadata } from '../metadata';
import { printableNewbieSudokuPageMetadata } from '../newbie/metadata';

import { printableEasySudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableEasySudokuPageMetadata);

const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Easy];
const easyReport = getTierTechniqueReport(DifficultyEnum.Easy);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const PrintableEasySudokuPage = () => (
    <main>
        <PageHeader metadata={printableEasySudokuPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Easy</BreadcrumbListItem>
        </PageHeader>
        <p>
            Easy starts at {getDifficultyClueCount(DifficultyEnum.Easy)} clues, six below Newbie, and adds exactly one technique: every
            puzzle in this booklet needs at least one <Link href={hiddenSinglePageMetadata.path}>hidden single</Link>, and none of them
            needs anything harder. That single extra pattern is what makes this the booklet people print for a relaxed coffee-break solve
            rather than a teaching aid. It is also the source tier for our large-print PDF, sampled at {PRINTABLE_LARGE_PRINT_SIZE}
            puzzles for readers who want bigger cells.
        </p>
        <TechniqueSummary>
            <ul>
                <li>
                    {getDifficultyClueCount(DifficultyEnum.Easy)} clues out of 81 cells, guaranteed to need a hidden single and nothing
                    harder.
                </li>
                <li>
                    {PRINTABLE_BOOKLET_SIZE} puzzles, printed {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with a full solution key.
                </li>
                <li>
                    Our sample of {easyReport.sampleSize} Easy boards measures SE <SeRatingRange report={easyReport} />.
                </li>
                <li>Also the source tier for the large-print PDF, sampled at {PRINTABLE_LARGE_PRINT_SIZE} puzzles.</li>
            </ul>
        </TechniqueSummary>
        <PuzzleBoard givens={PREVIEW_PUZZLE}>Puzzle 1 from the Easy booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</PuzzleBoard>
        <PrintableDownloadCard fileName="easy.pdf" title="Easy Sudoku">
            <PrintableDownloadFact>{PRINTABLE_BOOKLET_SIZE} puzzles</PrintableDownloadFact>
            <PrintableDownloadFact>{PRINTABLE_BOOKLET_PAGE_COUNT} pages</PrintableDownloadFact>
            <PrintableDownloadFact>{getPrintableFileSizeLabel('easy.pdf')} PDF, US Letter</PrintableDownloadFact>
            <PrintableDownloadFact>Solutions included on the last pages</PrintableDownloadFact>
        </PrintableDownloadCard>
        <h2>What is inside the booklet</h2>
        <p>
            A cover page states the puzzle and page counts up front, then {PRINTABLE_BOOKLET_SIZE} puzzles print{' '}
            {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page so a single sheet holds four complete grids. The last pages hold every solved
            grid at the same layout, so checking an answer never means hunting through a different page format. The whole file is vector
            graphics and a standard PDF font, so it prints cleanly at any size a printer supports. Our published sample of{' '}
            {easyReport.sampleSize} Easy boards measures SE <SeRatingRange report={easyReport} /> — numbers the{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> measures directly rather than
            assumes.
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
        <FaqPage>
            <FaqHeading>Printable Easy Sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is the printable Easy sudoku PDF free?</FaqQuestion>
                <FaqAnswer>Yes, with no account and no watermark, and every puzzle’s solved grid is included at the back.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What technique does an Easy sudoku booklet require?</FaqQuestion>
                <FaqAnswer>
                    At least one <Link href={hiddenSinglePageMetadata.path}>hidden single</Link> per puzzle, on top of the full houses and
                    naked singles Newbie already uses, and nothing harder.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does Suuudokuuu offer a large-print version of this booklet?</FaqQuestion>
                <FaqAnswer>
                    Yes. Easy is the source tier for the large-print PDF, sampled at {PRINTABLE_LARGE_PRINT_SIZE} puzzles with bigger cells
                    for readers who want more room to write.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How many puzzles are in the printable Easy sudoku PDF?</FaqQuestion>
                <FaqAnswer>
                    {PRINTABLE_BOOKLET_SIZE} puzzles across {PRINTABLE_BOOKLET_PAGE_COUNT} pages, four to a page, with the solved grids at
                    the back.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <DifficultyNavigation next={printableMediumSudokuPageMetadata} previous={printableNewbieSudokuPageMetadata} />
    </main>
);

export default PrintableEasySudokuPage;
