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
import { boxLineReductionPageMetadata } from '../box-line-reduction/metadata';
import { nakedTriplePageMetadata } from '../naked-triple/metadata';

import { nakedPairPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(nakedPairPageMetadata);

const EXAMPLE_BOARD = '.....1.73.....7.61172.63.484.71856.221...6857586.721.4.2..1478.8.17.942.745628319';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const NakedPairPage = () => (
    <main>
        <TechniquePageHeader metadata={nakedPairPageMetadata} />
        <p>
            A naked pair is two cells in the same row, column or box that both hold exactly the same two candidates, which reserves those
            two digits for those two cells and removes them from every other cell of the unit.
        </p>
        <TechniqueSummary>
            <p>
                Two cells, two candidates, one unit. Whichever way round the two digits fall, they are used up by the pair, so no other cell
                in that unit can take either of them.
            </p>
        </TechniqueSummary>
        <h2>When a naked pair applies</h2>
        <p>
            The argument is a counting argument. Two cells that can only hold the digits a and b will between them consume both a and b. The
            unit contains each digit once, so a and b are now spoken for and any other cell sharing that unit must give them up.
        </p>
        <p>
            Two conditions have to hold exactly. Both cells must show the same two candidates, and neither may show a third. A cell with
            candidates 3, 9 pairs with another 3, 9 cell; it does not pair with a 3, 8, 9 cell. If you relax that rule you will make
            eliminations the puzzle does not support.
        </p>
        <p>
            Naked pairs are the entry point to subset thinking and the first technique on this list that genuinely requires pencil marks.
            They are also the most common way out of a stall once singles and intersections have been exhausted.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.NakedPair}>
            r5c3 and r7c3 both carry exactly 3 and 9. Column 3 therefore loses those candidates elsewhere, which the solver reports as three
            eliminations.
        </TechniqueWorkedExample>
        <p>
            Column 3 has four empty cells. Two of them, r5c3 and r7c3, are down to the candidates 3 and 9 with nothing else. One will take 3
            and the other 9, so both digits are consumed inside the pair.
        </p>
        <p>
            The other two cells in the column must let them go. r1c3 held 4, 8 and 9, and loses the 9. r2c3 held 3, 4, 8 and 9, and loses
            both the 3 and the 9. Both cells are now down to 4 and 8, which is itself a second naked pair and shows how quickly subsets can
            cascade through a unit.
        </p>
        <h2>How to spot a naked pair</h2>
        <HowTo name="How to spot a naked pair in Sudoku">
            <HowToStep name="Fill in candidates for one unit">
                Choose a row, column or box with four to six blanks and write out the candidates. Naked pairs are invisible without marks.
            </HowToStep>
            <HowToStep name="Look for cells with exactly two candidates">
                Scan for bi-value cells. A unit needs at least two of them before a pair is possible.
            </HowToStep>
            <HowToStep name="Match the two candidate sets exactly">
                The two cells must show the same pair of digits. Overlapping but different pairs, such as 3, 9 and 3, 8, prove nothing on
                their own.
            </HowToStep>
            <HowToStep name="Erase the pair from the rest of the unit">
                Remove both digits from every other cell in that row, column or box, then look for a naked single among the survivors.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>Pairing two cells that share only one candidate. Both digits must match for the counting argument to work.</li>
            <li>Erasing the candidates from the pair cells themselves. The pair keeps both digits; everyone else gives them up.</li>
            <li>
                Applying the pair across two units at once. A pair in a row only clears that row, unless both cells also share a box, in
                which case the box can be cleared too.
            </li>
            <li>Working from pencil marks that were never updated after the last placement, which invents pairs that do not exist.</li>
        </ul>
        <h2>Naked pair FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Does a naked pair ever solve a cell?</FaqQuestion>
                <FaqAnswer>
                    Not directly. It is an elimination technique. What it usually produces is a naked single or a hidden single somewhere
                    else in the unit, and that is where the placement comes from.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can a naked pair clear two units at once?</FaqQuestion>
                <FaqAnswer>
                    Yes, when both cells sit in the same box as well as the same row or column. Then the digits can be removed from the rest
                    of the line and the rest of the box.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How does a naked pair differ from a hidden pair?</FaqQuestion>
                <FaqAnswer>
                    A naked pair is found by looking at cells that hold only two digits. A hidden pair is found by looking at two digits
                    that fit in only two cells. The naked version removes candidates from other cells; the hidden version removes candidates
                    from the pair cells themselves.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Are naked pairs enough to finish a hard puzzle?</FaqQuestion>
                <FaqAnswer>
                    Rarely on their own, but they are usually the move that restarts a stalled solve. Harder grids also need triples, quads
                    and eventually the fish and chain patterns.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={nakedTriplePageMetadata} previous={boxLineReductionPageMetadata} />
    </main>
);

export default NakedPairPage;
