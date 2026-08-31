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
import { seventeenClueSudokuPageMetadata } from '../../17-clue-sudoku/metadata';
import { homePageMetadata } from '../../metadata';
import { hellSudokuPageMetadata } from '../../sudoku/hell/metadata';
import { aicPageMetadata } from '../../techniques/aic/metadata';
import { printableHardSudokuPageMetadata } from '../hard/metadata';
import { printableSudokuPageMetadata } from '../metadata';
import { printableNightmareSudokuPageMetadata } from '../nightmare/metadata';

import { printableHellSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableHellSudokuPageMetadata);

const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Hell];
const hellReport = getTierTechniqueReport(DifficultyEnum.Hell);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const PrintableHellSudokuPage = () => (
    <main>
        <PageHeader metadata={printableHellSudokuPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Hell</BreadcrumbListItem>
        </PageHeader>
        <p>
            Every puzzle in this booklet carries exactly {getDifficultyClueCount(DifficultyEnum.Hell)} clues, the proven minimum for a
            sudoku with one unique solution, drawn from our bundled and independently verified 17-clue corpus rather than generated fresh.
            Our published sample of {hellReport.sampleSize} boards measures the tier at SE <SeRatingRange report={hellReport} />, with the{' '}
            <Link href={aicPageMetadata.path}>AIC</Link> as the most common hardest step. See the{' '}
            <Link href={seventeenClueSudokuPageMetadata.path}>17-clue guide</Link> for what the clue count does and does not tell you here.
        </p>
        <TechniqueSummary>
            <ul>
                <li>
                    {getDifficultyClueCount(DifficultyEnum.Hell)} clues, the proven minimum for a sudoku with a unique solution, drawn from
                    a bundled and independently verified 17-clue corpus.
                </li>
                <li>
                    {PRINTABLE_BOOKLET_SIZE} puzzles, printed {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with a full solution key.
                </li>
                <li>
                    Our sample of {hellReport.sampleSize} Hell boards measures SE <SeRatingRange report={hellReport} />, with the{' '}
                    <Link href={aicPageMetadata.path}>AIC</Link> as the most common hardest step.
                </li>
                <li>Hardness here comes from the SE rating filter applied to the corpus, not from the clue count.</li>
            </ul>
        </TechniqueSummary>
        <PuzzleBoard givens={PREVIEW_PUZZLE}>Puzzle 1 from the Hell booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</PuzzleBoard>
        <PrintableDownloadCard fileName="hell.pdf" title="Hell Sudoku">
            <PrintableDownloadFact>{PRINTABLE_BOOKLET_SIZE} puzzles</PrintableDownloadFact>
            <PrintableDownloadFact>{PRINTABLE_BOOKLET_PAGE_COUNT} pages</PrintableDownloadFact>
            <PrintableDownloadFact>{getPrintableFileSizeLabel('hell.pdf')} PDF, US Letter</PrintableDownloadFact>
            <PrintableDownloadFact>Solutions included on the last pages</PrintableDownloadFact>
        </PrintableDownloadCard>
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
            count that can still guarantee one solution, so there is no safety margin for a generator to get it slightly wrong. Each puzzle
            is also rated on the SE scale as the corpus is packed, and anything that rates too low for the tier is dropped — the clue count
            alone would not be enough to promise a hard puzzle. Printing from a pre-verified source means every puzzle here is guaranteed
            solvable before you ever pick up a pencil.
        </p>
        <h2>Where to go next</h2>
        <p>
            Not ready for chains on paper yet? Step back to the{' '}
            <Link href={printableNightmareSudokuPageMetadata.path}>printable Nightmare sudoku booklet</Link> for the same chain reasoning
            with more of the grid filled in, or to <Link href={printableHardSudokuPageMetadata.path}>printable Hard sudoku</Link> for fish
            and wings without chain-length reasoning, or play Hell on a screen at the{' '}
            <Link href={hellSudokuPageMetadata.path}>Hell sudoku lander</Link>, where the same 17-clue corpus powers every puzzle.
        </p>
        <FaqPage>
            <FaqHeading>Printable Hell Sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is the printable Hell sudoku PDF free?</FaqQuestion>
                <FaqAnswer>Yes, with no account and no watermark, and every puzzle’s solved grid is included at the back.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Are these real 17-clue puzzles?</FaqQuestion>
                <FaqAnswer>
                    Yes. Every puzzle is drawn from a bundled corpus checked by two independent solving algorithms and rated on the SE scale
                    before it is packed, rather than generated fresh at print time.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does 17 clues mean these puzzles are the hardest possible?</FaqQuestion>
                <FaqAnswer>
                    No. Clue count and difficulty are separate facts — see the{' '}
                    <Link href={seventeenClueSudokuPageMetadata.path}>17-clue sudoku guide</Link>. These puzzles are hard because they are
                    filtered by SE rating, not because of the clue count alone.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How many puzzles are in the printable Hell sudoku PDF?</FaqQuestion>
                <FaqAnswer>
                    {PRINTABLE_BOOKLET_SIZE} puzzles across {PRINTABLE_BOOKLET_PAGE_COUNT} pages, four to a page, with the solved grids at
                    the back.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <DifficultyNavigation previous={printableNightmareSudokuPageMetadata} />
    </main>
);

export default PrintableHellSudokuPage;
