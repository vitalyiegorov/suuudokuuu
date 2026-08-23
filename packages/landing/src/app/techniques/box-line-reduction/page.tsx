import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { HowTo } from '../../../seo/components/how-to/how-to';
import { HowToStep } from '../../../seo/components/how-to-step/how-to-step';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueNavigation } from '../../../techniques/components/technique-navigation/technique-navigation';
import { TechniquePageHeader } from '../../../techniques/components/technique-page-header/technique-page-header';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { TechniqueWorkedExample } from '../../../techniques/components/technique-worked-example/technique-worked-example';
import { nakedPairPageMetadata } from '../naked-pair/metadata';
import { pointingTriplePageMetadata } from '../pointing-triple/metadata';

import { boxLineReductionPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(boxLineReductionPageMetadata);

const EXAMPLE_BOARD = '.486.1.23.362...411.2.3486.2.1...63..8435621.36.12..846..8134.241.7623.8823...176';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const BoxLineReductionPage = () => (
    <main>
        <TechniquePageHeader metadata={boxLineReductionPageMetadata} />
        <p>
            Box line reduction happens when a digit can only go in cells of one row or column that all belong to the same box, which forces
            the digit into that box segment and removes it from the rest of the box.
        </p>
        <TechniqueSummary>
            <p>
                Start from a line rather than a box. If every remaining home for a digit on that row or column falls inside one 3×3 box, the
                box will get its copy of the digit from the line, so the box cells that are off the line lose the candidate.
            </p>
        </TechniqueSummary>
        <h2>When box line reduction applies</h2>
        <p>
            A row and a box overlap in exactly three cells. Box line reduction is the deduction that runs through that overlap in the
            line-to-box direction. Every row must contain the digit once. If the only cells on the row that can still take it are inside a
            single box, then the digit is somewhere in that three-cell overlap, and the other six cells of the box cannot hold it.
        </p>
        <p>
            Compare that with a pointing pair, which runs the other way: there the digit is confined to a line inside a box, and the line
            outside the box is cleared. Both are called locked candidates, and it is worth practising them as a pair so the direction of the
            elimination never gets muddled.
        </p>
        <p>
            Box line reduction is the harder of the two to see by eye, because you have to notice an absence along a whole line rather than
            a cluster inside a box. Solvers who keep full pencil marks find it easily; solvers who cross-hatch tend to miss it.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.BoxLineReduction}>
            In column 1 the digit 5 survives only in r1c1 and r2c1, and both belong to the top-left box, so 5 is removed from r3c2.
        </TechniqueWorkedExample>
        <p>
            Column 1 still has three empty cells: r1c1, r2c1 and r5c1. The digit 5 is possible in r1c1 and r2c1 but not in r5c1, whose row
            already carries a 5. Both surviving cells sit in the top-left box, so that box receives its 5 from column 1.
        </p>
        <p>
            The top-left box has one further blank away from column 1, namely r3c2, and it still listed 5 among its candidates. That is now
            impossible and the mark comes off, leaving r3c2 with 7 and 9. As always with an intersection, no digit is placed; the value of
            the move is the smaller candidate list it leaves behind.
        </p>
        <h2>How to spot box line reduction</h2>
        <HowTo name="How to spot a box line reduction in Sudoku">
            <HowToStep name="Work along a line, not a box">
                Pick a row or column that still needs a particular digit and list the cells on it where the digit is still possible.
            </HowToStep>
            <HowToStep name="Check whether the survivors share a box">
                Two or three survivors that all fall inside the same 3×3 box is the pattern. Survivors spread over two boxes prove nothing.
            </HowToStep>
            <HowToStep name="Erase the digit from the rest of that box">
                Remove the candidate from the six box cells that are not on the line. This is the opposite direction from a pointing pair.
            </HowToStep>
            <HowToStep name="Rescan the box for singles">
                The cleared cells often collapse to one candidate, and the box frequently gains a hidden single for an unrelated digit.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Running the elimination backwards and clearing the line instead of the box. That is a pointing pair, and here it is wrong.
            </li>
            <li>
                Missing the pattern because the line still has several blanks. What matters is where the digit can go, not how empty the
                line looks.
            </li>
            <li>Forgetting that the three overlap cells keep the candidate. The deduction never says which of them takes the digit.</li>
            <li>
                Only checking rows. Columns produce box line reductions just as often, and a stuck puzzle frequently hides one in a column.
            </li>
        </ul>
        <FaqPage>
            <FaqHeading>Box line reduction FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is box line reduction the same as a claiming candidate?</FaqQuestion>
                <FaqAnswer>
                    Yes. “Claiming”, “locked candidate type 2” and “line-box interaction” all describe this deduction. The line claims the
                    digit and the box gives up its other cells.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How is it different from a pointing pair?</FaqQuestion>
                <FaqAnswer>
                    A pointing pair reasons from the box and eliminates along the line. Box line reduction reasons from the line and
                    eliminates inside the box. They use the same three-cell intersection in opposite directions.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can it involve three cells rather than two?</FaqQuestion>
                <FaqAnswer>
                    Yes. If all three cells of the overlap are the only homes for the digit on the line, the same elimination applies. Two
                    or three survivors work identically.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why do I keep missing this pattern?</FaqQuestion>
                <FaqAnswer>
                    Because it is defined by what is absent from the rest of the line, and absences are harder to see than clusters. Keeping
                    complete pencil marks, or scanning digit by digit along each line, makes it much easier to catch.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={nakedPairPageMetadata} previous={pointingTriplePageMetadata} />
    </main>
);

export default BoxLineReductionPage;
