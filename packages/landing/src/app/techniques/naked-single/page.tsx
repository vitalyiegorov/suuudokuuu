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
import { fullHousePageMetadata } from '../full-house/metadata';
import { hiddenSinglePageMetadata } from '../hidden-single/metadata';

import { nakedSinglePageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(nakedSinglePageMetadata);

const EXAMPLE_BOARD = '9.3.68..2862.34.514.7..28367.68.3.252816453973.527..68.38.2.674.7438.2.96294.7..3';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const NakedSinglePage = () => (
    <main>
        <TechniquePageHeader metadata={nakedSinglePageMetadata} />
        <p>
            A naked single is an empty cell whose row, column and box between them already contain eight of the nine digits, so exactly one
            candidate survives and that candidate is the answer.
        </p>
        <TechniqueSummary>
            <p>
                Pick an empty cell, cross off every digit that appears in its row, its column or its box, and if one digit is left, write
                it. The deduction lives entirely inside a single cell, which is what separates it from a hidden single.
            </p>
        </TechniqueSummary>
        <h2>When a naked single applies</h2>
        <p>
            Every cell in a Sudoku grid sits at the intersection of three units: one row, one column and one 3×3 box. A digit is a candidate
            for that cell only if it is absent from all three. A naked single is the case where those three units, taken together, account
            for eight distinct digits and leave a single survivor.
        </p>
        <p>
            The word “naked” refers to how the deduction is read. You look at the cell, see one candidate and place it. Nothing about the
            other cells in the unit matters. That is the opposite of a hidden single, where the cell may show several candidates and the
            proof comes from the fact that no other cell in the unit can take a particular digit.
        </p>
        <p>
            Naked singles are the workhorse of every easy and medium puzzle. They also appear constantly as a follow-up: almost every
            elimination technique on this site is worth using precisely because the candidates it removes turn some nearby cell into a naked
            single.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.NakedSingle}>
            The Suuudokuuu solver marks r1c8 as its reason cell and places 4 there. Every other digit is blocked by row 1, column 8 or the
            top-right box.
        </TechniqueWorkedExample>
        <p>
            Look only at r1c8. Row 1 already holds 9, 3, 6, 8 and 2. Column 8 already holds 5, 3, 2, 9, 6 and 7. The top-right box already
            holds 2, 5, 1, 8, 3 and 6. Put those three lists together and they cover 1, 2, 3, 5, 6, 7, 8 and 9. Only 4 is left, so 4 goes in
            r1c8.
        </p>
        <p>
            Note how little of the grid was needed: twenty cells at most, all of them visible from the target. That locality is why naked
            singles are cheap to scan for and why a solver tries them immediately after full houses.
        </p>
        <h2>How to spot a naked single</h2>
        <HowTo name="How to spot a naked single in Sudoku">
            <HowToStep name="Choose a promising empty cell">
                Prefer cells sitting in a crowded row, column or box. The more digits already surround a cell, the fewer candidates it can
                have.
            </HowToStep>
            <HowToStep name="Eliminate along the row and the column">
                Read the row across and the column down, crossing off each digit you meet. Most cells fall apart at this stage.
            </HowToStep>
            <HowToStep name="Eliminate inside the box">
                Add the digits in the surrounding 3×3 box. This third pass is the one people skip, and it is often the pass that removes the
                last competing candidate.
            </HowToStep>
            <HowToStep name="Place the survivor and re-scan its neighbours">
                If exactly one digit survives, write it and immediately re-check the twenty cells that can see it, because a naked single
                very often creates another one.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>Checking the row and column but forgetting the box, which leaves a phantom second candidate and stalls the solve.</li>
            <li>
                Confusing a naked single with a hidden single. If the cell shows two or more candidates and you are arguing about where a
                digit can go in the unit, you are using a hidden single instead.
            </li>
            <li>
                Trusting stale pencil marks. A naked single found from candidate notes you forgot to update after your last placement is
                simply a guess in disguise.
            </li>
            <li>Hunting for exotic patterns while naked singles are still on the board. They are always the cheaper move.</li>
        </ul>
        <h2>Naked single FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>What is the difference between a naked single and a hidden single?</FaqQuestion>
                <FaqAnswer>
                    A naked single has one candidate in the cell. A hidden single may have several candidates in the cell, but one of those
                    digits fits nowhere else in the row, column or box, so it must be placed there anyway.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is a naked single also called a sole candidate?</FaqQuestion>
                <FaqAnswer>
                    Yes. “Sole candidate”, “forced cell” and “singleton” all describe the same deduction. Suuudokuuu reports it as Naked
                    Single so that its move log matches the vocabulary used by most solving guides.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do I have to write pencil marks to find naked singles?</FaqQuestion>
                <FaqAnswer>
                    Not necessarily. On a busy grid you can often run the three eliminations in your head. Pencil marks become worthwhile
                    once the easy placements dry up and you need to see subsets and intersections.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can a puzzle be solved with naked singles alone?</FaqQuestion>
                <FaqAnswer>
                    Some can, and those are the puzzles most apps grade as very easy. Anything harder eventually stalls, and you then need
                    hidden singles, intersections or subsets to create the next naked single.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={hiddenSinglePageMetadata} previous={fullHousePageMetadata} />
    </main>
);

export default NakedSinglePage;
