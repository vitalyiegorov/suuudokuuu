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
import { hiddenTriplePageMetadata } from '../hidden-triple/metadata';
import { nakedQuadPageMetadata } from '../naked-quad/metadata';

import { hiddenPairPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(hiddenPairPageMetadata);

const EXAMPLE_BOARD = '.......43..5....12..3..4.76......3.4..7.152.8..6...7.1..9721485758...129214958637';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const HiddenPairPage = () => (
    <main>
        <TechniquePageHeader metadata={hiddenPairPageMetadata} />
        <p>
            A hidden pair is two digits that can only go in the same two cells of a row, column or box, which reserves both cells for those
            digits and removes every other candidate from them.
        </p>
        <TechniqueSummary>
            <p>
                Two digits, two cells. Because the unit needs both digits and both have the same two homes, those cells are committed. Any
                other candidate sitting in them is impossible and can be erased.
            </p>
        </TechniqueSummary>
        <h2>When a hidden pair applies</h2>
        <p>
            Hidden subsets are read digit-first. Take a unit, pick two digits it still needs, and list the cells where each digit is
            possible. If both lists are the same two cells, the two digits will fill those cells between them. Nothing else fits, so every
            unrelated candidate inside the pair comes off.
        </p>
        <p>
            The eliminations therefore land inside the pattern rather than around it, which is the exact opposite of a naked pair. That is
            the single most useful thing to remember about hidden subsets: naked subsets clean the neighbours, hidden subsets clean
            themselves.
        </p>
        <p>
            Hidden pairs are common on hard puzzles and easy to walk past, because the two cells often carry four or five candidates each
            and look unremarkable. They usually surface right after a run of intersection eliminations has thinned a unit out.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.HiddenPair}>
            In column 4 the digits 1 and 5 fit only in r1c4 and r3c4. Both cells are stripped down to that pair, which the solver reports as
            five eliminations.
        </TechniqueWorkedExample>
        <p>
            Column 4 has seven empty cells. Follow the digit 1: it is possible only in r1c4 and r3c4. Follow the digit 5: also only r1c4 and
            r3c4. Two digits, the same two homes, so those two cells will take 1 and 5 in some order.
        </p>
        <p>
            r1c4 was carrying 1, 2, 5, 6 and 8, and loses the 2, the 6 and the 8. r3c4 was carrying 1, 2, 5 and 8, and loses the 2 and the
            8. Both cells now read 1 and 5, and the pattern has converted itself into a naked pair that will clear those digits from the
            rest of the column on the next pass.
        </p>
        <h2>How to spot a hidden pair</h2>
        <HowTo name="How to spot a hidden pair in Sudoku">
            <HowToStep name="List the digits a unit still needs">
                Work unit by unit. Write down which digits are missing before you look at any individual cell.
            </HowToStep>
            <HowToStep name="Count homes for each missing digit">
                For every missing digit, note the cells in the unit that can still hold it. Digits with exactly two homes are your
                candidates.
            </HowToStep>
            <HowToStep name="Match two digits to the same two cells">
                If two of those digits share the identical pair of homes, you have found a hidden pair.
            </HowToStep>
            <HowToStep name="Strip the two cells down to the pair">
                Delete every other candidate from both cells. The result is a naked pair, so immediately clear those two digits from the
                rest of the unit as well.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>Eliminating from the wrong cells. A hidden pair removes candidates inside the pair, not from its neighbours.</li>
            <li>
                Requiring the two digits to be the only candidates in the cells. If they were, the pattern would already be a naked pair;
                the hidden version is precisely the case where they are buried among others.
            </li>
            <li>
                Accepting a digit that has three homes. Both digits must be restricted to exactly the same two cells for the deduction to
                hold.
            </li>
            <li>Stopping after the strip. The pair becomes a naked pair, and that second step often does the real damage.</li>
        </ul>
        <h2>Hidden pair FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>How do I tell a hidden pair from a naked pair?</FaqQuestion>
                <FaqAnswer>
                    Look at what you counted. If you counted candidates inside two cells, it is naked. If you counted cells available to two
                    digits, it is hidden. The eliminations then land in opposite places.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does a hidden pair place any digits?</FaqQuestion>
                <FaqAnswer>
                    No. It reduces two cells to two candidates each. The placement comes later, usually from the naked pair it creates or
                    from a hidden single elsewhere in the unit.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why is a hidden pair harder to see than a naked pair?</FaqQuestion>
                <FaqAnswer>
                    Because nothing about the two cells looks special. They can be the widest cells in the unit. The pattern is only visible
                    once you count homes per digit rather than candidates per cell.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can a hidden pair span a row and a box?</FaqQuestion>
                <FaqAnswer>
                    The deduction is made within one unit, but if both cells also share a second unit, the naked pair it produces can be
                    applied to that unit too, which doubles the payoff.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={hiddenTriplePageMetadata} previous={nakedQuadPageMetadata} />
    </main>
);

export default HiddenPairPage;
