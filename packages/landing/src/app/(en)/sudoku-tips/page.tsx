import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import Link from 'next/link';

import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { SITE_NAME, SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueStaticExample } from '../../../techniques/components/technique-static-example/technique-static-example';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { blankSudokuGridPageMetadata } from '../blank-sudoku-grid/metadata';
import { techniqueFrequencyByDifficultyPageMetadata } from '../guides/technique-frequency-by-difficulty/metadata';
import { howToPlayPageMetadata } from '../how-to-play/metadata';
import { learnSudokuPageMetadata } from '../learn-sudoku/metadata';
import { homePageMetadata } from '../metadata';
import { solverPageMetadata } from '../solver/metadata';
import { newbieSudokuPageMetadata } from '../sudoku/newbie/metadata';
import { boxLineReductionPageMetadata } from '../techniques/box-line-reduction/metadata';
import { fullHousePageMetadata } from '../techniques/full-house/metadata';
import { hiddenPairPageMetadata } from '../techniques/hidden-pair/metadata';
import { hiddenSinglePageMetadata } from '../techniques/hidden-single/metadata';
import { techniquesPageMetadata } from '../techniques/metadata';
import { nakedPairPageMetadata } from '../techniques/naked-pair/metadata';
import { nakedSinglePageMetadata } from '../techniques/naked-single/metadata';
import { pointingPairPageMetadata } from '../techniques/pointing-pair/metadata';
import { xWingPageMetadata } from '../techniques/x-wing/metadata';

import { sudokuTipsPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(sudokuTipsPageMetadata);

const FULL_HOUSE_BOARD = '..1..6..5.....5..18521937647956.21382149386576....1942147..95865238674199..514..3';
const HIDDEN_SINGLE_BOARD = '.67..1.82.54..8.711827.3.4.491..685783657.12.27581..3.748192.6.629.8571.513..7298';
const NAKED_SINGLE_BOARD = '9.3.68..2862.34.514.7..28367.68.3.252816453973.527..68.38.2.674.7438.2.96294.7..3';
const POINTING_PAIR_BOARD = '9.3.....2..2.....1..7..2.36..6..3.2...1.4......5....6..3......4.74.8...962.4.7...';
const BOX_LINE_REDUCTION_BOARD = '.486.1.23.362...411.2.3486.2.1...63..8435621.36.12..846..8134.241.7623.8823...176';
const NAKED_PAIR_BOARD = '.....1.73.....7.61172.63.484.71856.221...6857586.721.4.2..1478.8.17.942.745628319';
const HIDDEN_PAIR_BOARD = '.......43..5....12..3..4.76......3.4..7.152.8..6...7.1..9721485758...129214958637';
const X_WING_BOARD = '953168742862734..1417..28367.6..3.2...1.4...7..5.7..6..38....74.7438...96294.7...';

const BOARD_CAPTION = 'The highlighted cells are the pattern the solver found on this board.';

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const SudokuTipsPage = () => (
    <main>
        <ArticleSchema metadata={sudokuTipsPageMetadata} />
        <PageHeader metadata={sudokuTipsPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Sudoku tips</BreadcrumbListItem>
        </PageHeader>
        <p>
            Good sudoku play is mostly a handful of habits repeated in the right order. These ten tips take you from a blank first move to
            the pair and fish patterns that open harder puzzles, and every board below is checked by the same solver that powers the hints
            in {SITE_NAME}.
        </p>
        <TechniqueSummary>
            <ul>
                <li>Finish nearly complete rows, columns and boxes first, then scan by digit and by cell for singles.</li>
                <li>Re-scan after every placement, and only write pencil marks when the singles run out.</li>
                <li>Pointing pairs, box/line reduction, naked and hidden pairs come next; an X-Wing is the first fish pattern.</li>
                <li>Never guess: every {SITE_NAME} puzzle has exactly one solution reachable by logic.</li>
            </ul>
        </TechniqueSummary>
        <h2>1. Start with the nearly complete houses</h2>
        <p>
            A row, column or box with eight digits placed needs only the ninth. That move is a{' '}
            <Link href={fullHousePageMetadata.path}>full house</Link>, the cheapest deduction in sudoku, so check every house for a single
            missing digit before anything else.
        </p>
        <TechniqueStaticExample board={FULL_HOUSE_BOARD} technique={SolutionTechniqueEnum.FullHouse}>
            {BOARD_CAPTION}
        </TechniqueStaticExample>
        <h2>2. Scan by digit</h2>
        <p>
            Pick one digit and ask where it can still go in each box, row and column. When only one cell in a house can hold it, that is a{' '}
            <Link href={hiddenSinglePageMetadata.path}>hidden single</Link>. Working one digit at a time, starting with the digit that
            appears most often on the board, finds most early moves.
        </p>
        <TechniqueStaticExample board={HIDDEN_SINGLE_BOARD} technique={SolutionTechniqueEnum.HiddenSingle}>
            {BOARD_CAPTION}
        </TechniqueStaticExample>
        <h2>3. Scan by cell</h2>
        <p>
            Look at one empty cell and cross out every digit already in its row, column and box. If one digit survives, it is a{' '}
            <Link href={nakedSinglePageMetadata.path}>naked single</Link>. Cells in crowded areas, where a row, a column and a box are all
            nearly full, are the best places to look.
        </p>
        <TechniqueStaticExample board={NAKED_SINGLE_BOARD} technique={SolutionTechniqueEnum.NakedSingle}>
            {BOARD_CAPTION}
        </TechniqueStaticExample>
        <h2>4. Re-scan after every placement</h2>
        <p>
            Each new digit changes what its row, column and box can hold. Before hunting for anything clever, run the same two scans again
            around the cell you just filled: placements often chain into more placements without any new technique.
        </p>
        <h2>5. Write candidates only when singles run out</h2>
        <p>
            When the scans stop finding moves, note the possible digits in each empty cell. In {SITE_NAME} the notes mode does this by hand
            and a show-all-candidates button fills them in for you. Candidates are what make every technique below visible, but keeping them
            up to date by hand costs time, so earn them with a stalled grid first.
        </p>
        <h2>6. Use pointing pairs</h2>
        <p>
            If a digit can only go in one row or column inside a box, it cannot appear elsewhere in that row or column. That is a{' '}
            <Link href={pointingPairPageMetadata.path}>pointing pair</Link>, and it clears candidates from cells outside the box.
        </p>
        <TechniqueStaticExample board={POINTING_PAIR_BOARD} technique={SolutionTechniqueEnum.PointingPair}>
            {BOARD_CAPTION}
        </TechniqueStaticExample>
        <h2>7. Use box/line reduction</h2>
        <p>
            The mirror image: if a digit in a row or column can only sit inside one box, it is removed from the rest of that box. See{' '}
            <Link href={boxLineReductionPageMetadata.path}>box/line reduction</Link>.
        </p>
        <TechniqueStaticExample board={BOX_LINE_REDUCTION_BOARD} technique={SolutionTechniqueEnum.BoxLineReduction}>
            {BOARD_CAPTION}
        </TechniqueStaticExample>
        <h2>8. Spot naked pairs</h2>
        <p>
            Two cells in one house that share the same two candidates must hold those two digits between them, so both digits leave every
            other cell in the house. See <Link href={nakedPairPageMetadata.path}>naked pair</Link>.
        </p>
        <TechniqueStaticExample board={NAKED_PAIR_BOARD} technique={SolutionTechniqueEnum.NakedPair}>
            {BOARD_CAPTION}
        </TechniqueStaticExample>
        <h2>9. Spot hidden pairs</h2>
        <p>
            Two digits that appear in only two cells of a house own those cells, so every other candidate in them can go. See{' '}
            <Link href={hiddenPairPageMetadata.path}>hidden pair</Link>.
        </p>
        <TechniqueStaticExample board={HIDDEN_PAIR_BOARD} technique={SolutionTechniqueEnum.HiddenPair}>
            {BOARD_CAPTION}
        </TechniqueStaticExample>
        <h2>10. Learn the X-Wing, and never guess</h2>
        <p>
            When a digit is confined to the same two columns in two different rows, the four corners form an{' '}
            <Link href={xWingPageMetadata.path}>X-Wing</Link> and the digit leaves the rest of those columns. Beyond that, the{' '}
            <Link href={techniquesPageMetadata.path}>technique library</Link> keeps going, and every puzzle here can be solved by logic, so
            a guess is never the answer. If a board stalls, paste it into the{' '}
            <Link href={solverPageMetadata.path}>step-by-step solver</Link> to see which technique is next.
        </p>
        <TechniqueStaticExample board={X_WING_BOARD} technique={SolutionTechniqueEnum.XWing}>
            {BOARD_CAPTION}
        </TechniqueStaticExample>
        <h2>Where to go next</h2>
        <p>
            Practice the first habits on <Link href={newbieSudokuPageMetadata.path}>Newbie</Link> puzzles. New to the rules? Read{' '}
            <Link href={howToPlayPageMetadata.path}>how to play</Link> first, or follow the{' '}
            <Link href={learnSudokuPageMetadata.path}>learn sudoku</Link> path. To see which techniques each difficulty actually asks for,
            read the <Link href={techniqueFrequencyByDifficultyPageMetadata.path}>technique frequency by difficulty</Link> data. Want to
            practice on paper? Print a <Link href={blankSudokuGridPageMetadata.path}>blank sudoku grid</Link>.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play {SITE_NAME} now
        </a>
        <FaqPage>
            <FaqHeading>Sudoku tips FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>What is the best tip for a sudoku beginner?</FaqQuestion>
                <FaqAnswer>
                    Scan for singles, by digit and by cell, and repeat the scan after every placement. Newbie puzzles can be finished with
                    those two ideas alone.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Should I write pencil marks from the start?</FaqQuestion>
                <FaqAnswer>
                    Not usually. Fill in every single you can find first, then add candidates once the scans stall, so you spend effort on
                    notes only when the puzzle needs them.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is it ever right to guess in sudoku?</FaqQuestion>
                <FaqAnswer>
                    No. A well-made puzzle has one solution that logic alone can reach. Every {SITE_NAME} puzzle is checked for a unique
                    solution, and a stuck board means a technique is still waiting to be spotted.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default SudokuTipsPage;
