import { DifficultyEnum } from '@suuudokuuu/generator';
import { SE_RATING_CEILING } from '@suuudokuuu/rating';
import Link from 'next/link';

import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import {
    INFINITY_HIGHEST_RATING,
    INFINITY_LOWEST_RATING,
    INFINITY_MAXIMUM_GIVEN_COUNT,
    INFINITY_MINIMUM_GIVEN_COUNT
} from '../../../difficulty/constants/infinity-corpus.constant';
import { PrintableDownloadCard } from '../../../printable/components/printable-download-card/printable-download-card';
import { PrintableDownloadFact } from '../../../printable/components/printable-download-fact/printable-download-fact';
import { PRINTABLE_BOOKLET_PUZZLES_PER_PAGE } from '../../../printable/constants/printable-layout.constant';
import { PRINTABLE_BOOKLET_PAGE_COUNT } from '../../../printable/constants/printable-page-count.constant';
import { PRINTABLE_BOOKLET_PUZZLES, PRINTABLE_BOOKLET_SIZE } from '../../../printable/constants/printable-sample.constant';
import { getPrintableFileSizeLabel } from '../../../printable/utils/get-printable-file-size-label.util';
import { PuzzleBoard } from '../../../puzzle/components/puzzle-board/puzzle-board';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { hardestSudokuPuzzlesPageMetadata } from '../../hardest-sudoku-puzzles/metadata';
import { homePageMetadata } from '../../metadata';
import { infinitySudokuPageMetadata } from '../../sudoku/infinity/metadata';
import { printableHellSudokuPageMetadata } from '../hell/metadata';
import { printableSudokuPageMetadata } from '../metadata';

import { printableInfinitySudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableInfinitySudokuPageMetadata);

const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Infinity];
const lowestRatingLabel = INFINITY_LOWEST_RATING.toFixed(1);
const highestRatingLabel = INFINITY_HIGHEST_RATING.toFixed(1);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const PrintableInfinitySudokuPage = () => (
    <main>
        <PageHeader metadata={printableInfinitySudokuPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Infinity</BreadcrumbListItem>
        </PageHeader>
        <p>
            This booklet prints {PRINTABLE_BOOKLET_SIZE} of the hardest sudoku puzzles ever published, taken from Suuudokuuu’s Infinity
            tier: Arto Inkala’s Everest, AI Escargot, Platinum Blonde, Golden Nugget and other record grids, each with a published SE
            (Sudoku Explainer) rating between {lowestRatingLabel} and {highestRatingLabel}. Every one has exactly one solution, and the
            solved grids are at the back.
        </p>
        <TechniqueSummary>
            <ul>
                <li>
                    {PRINTABLE_BOOKLET_SIZE} record puzzles, printed {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with a full solution
                    key.
                </li>
                <li>Includes Everest (SE 11.9), Platinum Blonde (SE 10.9) and AI Escargot (SE 10.6).</li>
                <li>
                    Infinity puzzles carry {INFINITY_MINIMUM_GIVEN_COUNT} to {INFINITY_MAXIMUM_GIVEN_COUNT} clues and are checked for a
                    single solution by two independent solving algorithms.
                </li>
                <li>The ratings are the values independent raters publish, not our own measurements.</li>
            </ul>
        </TechniqueSummary>
        <PuzzleBoard givens={PREVIEW_PUZZLE}>Puzzle 1 from the Infinity booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</PuzzleBoard>
        <PrintableDownloadCard fileName="infinity.pdf" title="Infinity Sudoku">
            <PrintableDownloadFact>{PRINTABLE_BOOKLET_SIZE} puzzles</PrintableDownloadFact>
            <PrintableDownloadFact>{PRINTABLE_BOOKLET_PAGE_COUNT} pages</PrintableDownloadFact>
            <PrintableDownloadFact>{getPrintableFileSizeLabel('infinity.pdf')} PDF, US Letter</PrintableDownloadFact>
            <PrintableDownloadFact>Solutions included on the last pages</PrintableDownloadFact>
        </PrintableDownloadCard>
        <h2>What is inside the booklet</h2>
        <p>
            The puzzles are printed exactly as they were published, with no reshuffling, so you can compare your grid with the originals
            discussed on the <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> page. They print{' '}
            {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page with room for a full set of pencil marks, which you will need: at this level most
            solvers keep every candidate written in and test chains on a separate sheet. The final pages hold the completed grids, so you
            can check a long line of reasoning without having to finish it first.
        </p>
        <h2>How hard these puzzles are</h2>
        <p>
            Very. Every puzzle in the Infinity set has a published SE rating of at least {lowestRatingLabel}, well past anything the
            generated tiers or the Hell corpus produce. Our own rater stops pricing the SE ladder at {SE_RATING_CEILING}, so the figures
            quoted here come from independent raters, and our technique engine cannot finish any of these grids on its own. Expect to need
            long forcing chains and forcing nets, and expect a single puzzle to take far longer than anything else on this site.
        </p>
        <h2>Where to go next</h2>
        <p>
            Want to warm up first? The <Link href={printableHellSudokuPageMetadata.path}>printable Hell sudoku booklet</Link> holds
            forcing-chain puzzles that are hard but still within reach of our technique ladder. Prefer a screen? Play the same record
            puzzles on the <Link href={infinitySudokuPageMetadata.path}>Infinity sudoku lander</Link>, where each game reshuffles the grid,
            or browse every booklet on the <Link href={printableSudokuPageMetadata.path}>printable sudoku hub</Link>.
        </p>
        <FaqPage>
            <FaqHeading>Printable Infinity Sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is the printable Infinity sudoku PDF free?</FaqQuestion>
                <FaqAnswer>Yes, with no account and no watermark, and every puzzle’s solved grid is included at the back.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is AI Escargot in the printable booklet?</FaqQuestion>
                <FaqAnswer>
                    Yes, along with Everest, Platinum Blonde and Golden Nugget. The booklet prints the puzzles as they were originally
                    published.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Who rated these puzzles?</FaqQuestion>
                <FaqAnswer>
                    The SE ratings are the values independent raters and the sudoku-solving community publish. Suuudokuuu’s own rater
                    reports {SE_RATING_CEILING} with a ceiling flag for anything harder than that, so it does not produce its own figure for
                    these puzzles.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How many puzzles are in the printable Infinity sudoku PDF?</FaqQuestion>
                <FaqAnswer>
                    {PRINTABLE_BOOKLET_SIZE} puzzles across {PRINTABLE_BOOKLET_PAGE_COUNT} pages, four to a page, with the solved grids at
                    the back.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <DifficultyNavigation previous={printableHellSudokuPageMetadata} />
    </main>
);

export default PrintableInfinitySudokuPage;
