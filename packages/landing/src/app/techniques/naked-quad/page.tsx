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
import { hiddenPairPageMetadata } from '../hidden-pair/metadata';
import { nakedTriplePageMetadata } from '../naked-triple/metadata';

import { nakedQuadPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(nakedQuadPageMetadata);

const EXAMPLE_BOARD = '..3.......56..4123..43.5...57...3..443.......16..42.3.681.3....3974....8245...36.';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const NakedQuadPage = () => (
    <main>
        <TechniquePageHeader metadata={nakedQuadPageMetadata} />
        <p>
            A naked quad is four cells in the same unit whose candidates, taken together, use only four different digits, which reserves
            those four digits for those four cells and removes them from every other cell of the unit.
        </p>
        <TechniqueSummary>
            <p>
                Four cells, four digits between them. As with pairs and triples, the cells may show different subsets; only the union
                matters. Once it is exactly four digits wide, no other cell in the unit can use any of them.
            </p>
        </TechniqueSummary>
        <h2>When a naked quad applies</h2>
        <p>
            Naked quads need room. A unit has to keep at least six empty cells for a quad to be worth anything, because four of them form
            the quad and there must still be somebody left to eliminate from. That makes quads a mid-solve technique on hard puzzles rather
            than something you will meet on an easy grid.
        </p>
        <p>
            The counting argument is the same one that powers every naked subset. Four cells that between them can only hold four digits
            will use up all four, one per cell. The unit contains each digit once, so those digits are unavailable to the rest of it.
        </p>
        <p>
            In practice quads are frequently spotted the other way around. If a unit has six blanks and two of them form a hidden pair, the
            other four automatically form a naked quad. Recognising the complement is often faster than testing combinations by hand.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.NakedQuad}>
            Row 3 carries a naked quad on 6, 7, 8 and 9 across r3c1, r3c7, r3c8 and r3c9. All four digits are stripped from r3c5.
        </TechniqueWorkedExample>
        <p>
            Row 3 has six empty cells. Four of them share a narrow set of options: r3c1 holds 7, 8 and 9; r3c7 holds 6, 7, 8 and 9; r3c8
            holds 7, 8 and 9; r3c9 holds 6, 7 and 9. Merging those lists gives exactly 6, 7, 8 and 9, so the quad is genuine.
        </p>
        <p>
            The remaining blanks are r3c2 and r3c5. r3c2 already held only 1 and 2, so it is untouched. r3c5 held 1, 2, 6, 7, 8 and 9, and
            loses four candidates in one stroke, leaving 1 and 2. Row 3 now has a naked pair on 1 and 2, and the row has effectively split
            into two closed groups.
        </p>
        <h2>How to spot a naked quad</h2>
        <HowTo name="How to spot a naked quad in Sudoku">
            <HowToStep name="Find a unit with six or more blanks">
                Quads need space. A unit with five blanks or fewer cannot produce a useful quad elimination.
            </HowToStep>
            <HowToStep name="Discard cells with five or more candidates">
                No cell in a quad can hold more than four candidates, so any wider cell is out of the running straight away.
            </HowToStep>
            <HowToStep name="Try the complement first">
                If two cells in the unit form a hidden pair, or if the unit has exactly six blanks and two of them share a tight pair, the
                other four are your quad.
            </HowToStep>
            <HowToStep name="Merge four candidate lists and count">
                A union of exactly four digits confirms the quad. Then remove all four digits from every other cell of the unit.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>Accepting a union of five digits. Four cells covering five digits carry no information.</li>
            <li>
                Testing every four-cell combination by brute force. There are far too many; filter by candidate count first and look at the
                complement.
            </li>
            <li>
                Announcing a quad in a unit with only five blanks. The pattern may be real but there is at most one cell left to eliminate
                from, and it is usually already solved by a simpler technique.
            </li>
            <li>Erasing candidates from the quad cells. As with every naked subset, the quad keeps everything it had.</li>
        </ul>
        <h2>Naked quad FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Do all four cells need four candidates?</FaqQuestion>
                <FaqAnswer>
                    No. Cells with two or three candidates are welcome members of a quad. The only rule is that the union across the four
                    cells contains exactly four digits.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is a naked quad worth looking for?</FaqQuestion>
                <FaqAnswer>
                    Only after pairs, triples and the intersection techniques have been exhausted. A quad usually implies a simpler hidden
                    subset elsewhere in the same unit, and that simpler pattern is quicker to find.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How does a naked quad relate to a hidden pair?</FaqQuestion>
                <FaqAnswer>
                    They are complements. In a unit with six empty cells, a naked quad on four of them is exactly a hidden pair on the other
                    two, and either name describes the same underlying deduction.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is there a naked quint?</FaqQuestion>
                <FaqAnswer>
                    In principle yes, but a five-cell subset in a nine-cell unit is always the complement of a four-cell hidden subset, so
                    solvers stop at four. Suuudokuuu implements naked and hidden subsets up to size four for the same reason.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={hiddenPairPageMetadata} previous={nakedTriplePageMetadata} />
    </main>
);

export default NakedQuadPage;
