import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { HowTo } from '../../../seo/components/how-to/how-to';
import { HowToStep } from '../../../seo/components/how-to-step/how-to-step';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueNavigation } from '../../../techniques/components/technique-navigation/technique-navigation';
import { TechniquePageHeader } from '../../../techniques/components/technique-page-header/technique-page-header';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { TechniqueWorkedExample } from '../../../techniques/components/technique-worked-example/technique-worked-example';
import { nakedSinglePageMetadata } from '../naked-single/metadata';

import { fullHousePageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(fullHousePageMetadata);

const EXAMPLE_BOARD = '..1..6..5.....5..18521937647956.21382149386576....1942147..95865238674199..514..3';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const FullHousePage = () => (
    <main>
        <TechniquePageHeader title="Full House" />
        <p>
            A full house is a row, column or box in which exactly one cell is still empty, and the digit that belongs in it is simply the
            one value that unit has not used yet.
        </p>
        <TechniqueSummary>
            <p>
                Find a unit with a single blank, read off the eight digits already written there, and place the ninth. A full house needs no
                candidate marks and no case analysis, which is why every solver checks for it first.
            </p>
        </TechniqueSummary>
        <h2>When a full house applies</h2>
        <p>
            Sudoku has one rule: every row, every column and every 3×3 box holds each digit from 1 to 9 exactly once. That rule makes a unit
            with a single empty cell answer itself. Eight of the nine digits are already on the board, so the ninth has nowhere else to go
            and the cell can be filled without looking at anything outside the unit.
        </p>
        <p>
            Full houses turn up in three situations. They are common at the end of a puzzle when the grid is nearly complete, they appear
            the moment you place a digit that happened to be a unit’s second-to-last value, and easy puzzles often ship with one or two
            already on the board. Because a full house costs a single count to verify, Suuudokuuu’s technique engine ranks it as the very
            first strategy to try, ahead of the naked single.
        </p>
        <p>
            The technique is worth naming even though it looks trivial. When a solver reports that a puzzle was finished with nothing but
            full houses and singles, that is a precise statement about difficulty: no candidate bookkeeping was ever required.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.FullHouse}>
            Row 4 holds eight digits and one blank. The highlighted cells are the row the Suuudokuuu solver used as its reason, and r4c5 is
            the placement it returned.
        </TechniqueWorkedExample>
        <p>
            Row 4 of this position reads 7, 9, 5, 6, blank, 2, 1, 3 and 8. Comparing that list against 1 to 9 leaves exactly one absent
            digit, 4, so r4c5 takes 4. No other cell in the grid needs to be examined and no pencil marks are involved.
        </p>
        <p>
            The board above is not a drawing. The grid string is handed to the technique engine that ships inside the Suuudokuuu app, and
            the highlighted reason cells, the placed digit and the coordinates listed under the board are exactly what the engine returned
            for this position at build time. If the engine ever stopped reporting a full house here, this page would fail to build.
        </p>
        <h2>How to spot a full house</h2>
        <HowTo name="How to spot a full house in Sudoku">
            <HowToStep name="Scan for units with one blank">
                Run your eye along each row, then each column, then each box, and stop at the first unit that has a single empty cell.
            </HowToStep>
            <HowToStep name="Read the digits already present">
                List the eight digits written in that unit. Reading them in board order is faster than trying to hold them in memory.
            </HowToStep>
            <HowToStep name="Name the missing digit">
                Compare your list against 1 to 9. Exactly one digit is absent, and that digit is the answer for the empty cell.
            </HowToStep>
            <HowToStep name="Place it and rescan the crossing units">
                Writing the digit often reduces the crossing row, column or box to one blank as well, so immediately re-check all three
                units that pass through the cell you just filled.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>Counting empty cells instead of missing digits, which turns a one-second check into a guess.</li>
            <li>Stopping after one placement. Full houses cascade, and the next one is usually adjacent to the cell you just filled.</li>
            <li>
                Applying the technique on a grid that already contains a mistake. A full house is only as trustworthy as the eight digits
                you are reading, so a wrong digit earlier in the solve produces a confident wrong answer here.
            </li>
            <li>Treating a box with one blank as less reliable than a row with one blank. All three unit types work identically.</li>
        </ul>
        <h2>Full house FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Is a full house the same as a naked single?</FaqQuestion>
                <FaqAnswer>
                    Every full house is also a naked single, but not every naked single is a full house. A full house is recognised from the
                    digits in one unit, while a naked single generally needs candidates from all three units that cross the cell.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do I need pencil marks to use a full house?</FaqQuestion>
                <FaqAnswer>
                    No. A full house is the only technique that works purely from the digits printed on the board, which is why it is the
                    first thing to look for when you pick a partly solved grid back up.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why do solvers rank a full house as the easiest technique?</FaqQuestion>
                <FaqAnswer>
                    Difficulty ranking in a Sudoku engine reflects how much work a deduction costs. A full house needs one pass over nine
                    cells, so it sits at the top of the order and is tried before naked singles, hidden singles and everything else.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How many full houses does a typical puzzle contain?</FaqQuestion>
                <FaqAnswer>
                    Very few at the start and many at the end. Hard puzzles usually offer none until the middle of the solve, while gentle
                    puzzles can open with one or two, and almost every puzzle finishes with a run of them.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={nakedSinglePageMetadata} />
    </main>
);

export default FullHousePage;
