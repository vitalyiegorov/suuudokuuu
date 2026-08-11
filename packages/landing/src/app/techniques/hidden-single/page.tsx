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
import { pointingPairPageMetadata } from '../pointing-pair/metadata';

import { hiddenSinglePageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(hiddenSinglePageMetadata);

const EXAMPLE_BOARD = '.67..1.82.54..8.711827.3.4.491..685783657.12.27581..3.748192.6.629.8571.513..7298';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const HiddenSinglePage = () => (
    <main>
        <TechniquePageHeader title="Hidden Single" />
        <p>
            A hidden single is a digit that can legally go in only one cell of a row, column or box, so that cell must take the digit even
            though it still shows other candidates.
        </p>
        <TechniqueSummary>
            <p>
                Pick a unit and a digit, then count the cells in that unit where the digit could still go. If the count is one, place it.
                The candidate is “hidden” because the target cell looks undecided until you argue from the digit instead of from the cell.
            </p>
        </TechniqueSummary>
        <h2>When a hidden single applies</h2>
        <p>
            Each of the nine digits has to appear exactly once in every row, column and box. That gives you a second way to reason. Instead
            of asking “what can go in this cell?”, you ask “where can this digit go in this unit?”. When the answer is a single cell, the
            placement is forced regardless of how many other candidates that cell carries.
        </p>
        <p>
            Hidden singles are the most common non-trivial move in Sudoku and the technique most beginners skip, because pencil marks make a
            cell with four candidates look unsolvable. They are especially frequent inside boxes, where the three surrounding rows and three
            surrounding columns cut a digit down quickly.
        </p>
        <p>
            A hidden single never needs an elimination step first, which is why it sits directly after full houses and naked singles in the
            Suuudokuuu solving order. Only when the board runs out of all three does the engine reach for intersections and subsets.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.HiddenSingle}>
            The highlighted cells are column 5. The solver reports that 3 fits nowhere in that column except r4c5, so it places 3 there.
        </TechniqueWorkedExample>
        <p>
            Column 5 already contains 7, 1, 9 and 8, so it still needs 2, 3, 4, 5 and 6 across its five empty cells: r1c5, r2c5, r3c5, r4c5
            and r9c5. Now follow the digit 3. The top-middle box already has a 3 at r3c6, which blocks r1c5, r2c5 and r3c5. Row 9 already
            has a 3 at r9c3, which blocks r9c5. Only r4c5 is left, so 3 goes there.
        </p>
        <p>
            The point worth absorbing is that r4c5 was never a naked single: it still had 2 as a candidate at the moment of the deduction.
            Reading the cell alone would have told you nothing. Reading the digit across the unit solved it in one pass.
        </p>
        <h2>How to spot a hidden single</h2>
        <HowTo name="How to spot a hidden single in Sudoku">
            <HowToStep name="Pick a digit, not a cell">
                Choose a digit that already appears several times on the board. The more copies exist, the more units it is blocked from.
            </HowToStep>
            <HowToStep name="Sweep the box with rows and columns">
                For a box that still needs your digit, trace the three rows and three columns crossing it. Every line that already contains
                the digit rules out three cells of the box.
            </HowToStep>
            <HowToStep name="Count the surviving cells">
                If exactly one cell in the unit can still hold the digit, you have a hidden single. Two or more survivors may still be
                useful later as a pointing pair or a hidden pair.
            </HowToStep>
            <HowToStep name="Place it and repeat for the same digit">
                A newly placed digit blocks a fresh row, column and box, so re-sweep the same digit across the rest of the grid before
                switching to another one.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>Only scanning boxes. Hidden singles hide in rows and columns just as often, and those are the ones most solvers miss.</li>
            <li>
                Assuming a cell with several pencil marks cannot be solved. The whole point of the technique is that the winning argument
                comes from the unit, not from the cell.
            </li>
            <li>
                Forgetting that a hidden single also removes every other candidate from the cell. Update those pencil marks or you will trip
                over stale notes later.
            </li>
            <li>Sweeping one digit and moving on. Placing it changes the picture for that same digit elsewhere on the board.</li>
        </ul>
        <h2>Hidden single FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>How is a hidden single different from a naked single?</FaqQuestion>
                <FaqAnswer>
                    A naked single is proved from inside the cell: one candidate remains. A hidden single is proved from inside the unit:
                    one cell remains for a given digit. A cell can be a hidden single while still displaying three or four candidates.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Which unit should I scan first for hidden singles?</FaqQuestion>
                <FaqAnswer>
                    Boxes are the fastest because six lines cross each one, but a full sweep must cover rows and columns too. Puzzles that
                    feel stuck usually contain a hidden single in a row or column that was never checked.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do I need pencil marks to find hidden singles?</FaqQuestion>
                <FaqAnswer>
                    No. Cross-hatching, where you trace the rows and columns that already contain a digit, finds hidden singles without any
                    notes at all, and it is the classic pencil-free scanning method.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can one cell be a hidden single for two different digits?</FaqQuestion>
                <FaqAnswer>
                    No. If two digits both had that cell as their only home in the same unit, the puzzle would have no solution. Seeing that
                    situation means an earlier placement was wrong.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={pointingPairPageMetadata} previous={nakedSinglePageMetadata} />
    </main>
);

export default HiddenSinglePage;
