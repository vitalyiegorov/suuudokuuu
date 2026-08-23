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
import { hiddenTriplePageMetadata } from '../hidden-triple/metadata';
import { xWingPageMetadata } from '../x-wing/metadata';

import { hiddenQuadPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(hiddenQuadPageMetadata);

const EXAMPLE_BOARD = '..7..1..2..8..7..1912..3745423795168679.18534185..4.79294176853856432917731..9426';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const HiddenQuadPage = () => (
    <main>
        <TechniquePageHeader metadata={hiddenQuadPageMetadata} />
        <p>
            A hidden quad is four digits that between them can only go in the same four cells of a row, column or box, which reserves those
            cells for the four digits and removes every other candidate from them.
        </p>
        <TechniqueSummary>
            <p>
                Four digits, four cells. Each digit may fit in only two or three of the cells, but none of the four reaches any further into
                the unit, so the cells are committed and everything else inside them is impossible.
            </p>
        </TechniqueSummary>
        <h2>When a hidden quad applies</h2>
        <p>
            Hidden quads are the largest subset most solvers bother with, and they are also the rarest thing on this list that is still
            worth naming. Take four digits a unit still needs, collect every cell where any of them can land, and check whether that
            collection is exactly four cells. If it is, those four cells will take the four digits between them.
        </p>
        <p>
            There is an important structural catch. In a unit with n empty cells, a hidden quad on four of them is the exact complement of a
            naked subset on the other n − 4 cells. When the unit has six, seven or eight blanks, that complement is a naked pair, triple or
            quad, and any solver checking naked subsets first will find the simpler pattern and never report the quad at all.
        </p>
        <p>
            That is not a quirk of one implementation. It is why hidden quads almost never appear in solver logs, and why the honest advice
            is to look for the complement instead. Learning to see the quad is still worthwhile, because on paper the complement is
            sometimes the harder half to spot.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.HiddenQuad}>
            In the top-middle box the digits 2, 4, 5 and 9 fit only in r1c4, r1c5, r2c4 and r2c5. Those four cells lose their 6 and 8
            candidates.
        </TechniqueWorkedExample>
        <p>
            The top-middle box has six empty cells and is missing 2, 4, 5, 6, 8 and 9. Track four of those digits. 2 fits only in r2c4 and
            r2c5. 4 fits only in r1c5 and r2c5. 9 fits only in r1c4 and r2c4. 5 fits in all four of those cells. Together, 2, 4, 5 and 9
            reach exactly four cells, so the quad is confirmed.
        </p>
        <p>
            Those cells therefore hold the four digits between them, and their other candidates go. r1c4 drops from 5, 6, 8, 9 to 5 and 9.
            r1c5 drops from 4, 5, 6, 8 to 4 and 5. r2c4 loses its 6 and keeps 2, 5 and 9. r2c5 loses its 6 and keeps 2, 4 and 5.
        </p>
        <p>
            Look at what is left in the box: r3c4 and r3c5 both read 6 and 8. That naked pair is the complement of the quad and proves
            exactly the same thing in two cells instead of four. A solver working in difficulty order will always report the pair, which is
            why the board above had to be handed to the hidden quad detector directly to produce this diagram.
        </p>
        <h2>How to spot a hidden quad</h2>
        <HowTo name="How to spot a hidden quad in Sudoku">
            <HowToStep name="Count the blanks in the unit">
                Note how many empty cells the row, column or box still has. Anything from five to nine blanks can carry a hidden quad.
            </HowToStep>
            <HowToStep name="Check the complement first">
                Subtract four from the blank count. If the answer is two, three or four, look for a naked subset of that size instead. It is
                the same deduction and far quicker to confirm.
            </HowToStep>
            <HowToStep name="Otherwise list homes per digit">
                For each digit the unit still needs, write down the cells where it can go. Digits with two, three or four homes are quad
                material.
            </HowToStep>
            <HowToStep name="Find four digits covering four cells">
                Combine four home lists. If the union is exactly four cells, delete every other candidate from those cells and rescan the
                unit.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Searching for four digits that each fit in all four cells. That shape is possible but unusual; two or three homes per digit
                is the normal case.
            </li>
            <li>Missing a fifth home for one of the digits. A single stray cell anywhere in the unit destroys the pattern.</li>
            <li>Clearing the four digits from the rest of the unit. That is the naked version; a hidden quad cleans its own cells.</li>
            <li>
                Spending time on a quad when the unit has six blanks. The complementary naked pair is sitting right there and takes seconds
                to verify.
            </li>
        </ul>
        <FaqPage>
            <FaqHeading>Hidden quad FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Why do I almost never see a hidden quad in a solver log?</FaqQuestion>
                <FaqAnswer>
                    Because its complement inside the same unit is always a smaller naked subset, and solvers try naked subsets first. The
                    pattern is real, but a difficulty-ordered engine will label the move with the cheaper name.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is a hidden quad ever necessary to solve a puzzle?</FaqQuestion>
                <FaqAnswer>
                    Not in the strict sense. Anything a hidden quad proves can also be proved by the complementary naked subset in the same
                    unit, so it is a matter of which half of the pattern you happen to notice.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do the four digits need four homes each?</FaqQuestion>
                <FaqAnswer>
                    No. Each digit needs at least two homes among the four cells, and the union of all four home lists must be exactly those
                    four cells. Mixed shapes are the norm.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is there a hidden quint?</FaqQuestion>
                <FaqAnswer>
                    In a nine-cell unit a five-digit hidden subset is always the complement of a four-cell naked subset, so nothing is
                    gained by naming it. Both naked and hidden subsets stop at four in practice.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={xWingPageMetadata} previous={hiddenTriplePageMetadata} />
    </main>
);

export default HiddenQuadPage;
