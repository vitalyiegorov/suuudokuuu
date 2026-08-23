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
import { boxLineReductionPageMetadata } from '../box-line-reduction/metadata';
import { pointingPairPageMetadata } from '../pointing-pair/metadata';

import { pointingTriplePageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(pointingTriplePageMetadata);

const EXAMPLE_BOARD = '.91.52.4354.937.122.3..4.59.5...3..443...5..612..49537912378465..5491328384526971';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const PointingTriplePage = () => (
    <main>
        <TechniquePageHeader metadata={pointingTriplePageMetadata} />
        <p>
            A pointing triple occurs when a digit can only go in three cells of a box and all three sit on the same row or column, which
            locks the digit into that line and clears it from the line outside the box.
        </p>
        <TechniqueSummary>
            <p>
                Same deduction as a pointing pair, one cell wider. A box needs the digit, its three remaining homes fill exactly one row or
                one column of the box, so the six cells of that line outside the box lose the candidate.
            </p>
        </TechniqueSummary>
        <h2>When a pointing triple applies</h2>
        <p>
            A box has three cells in each of its rows and three in each of its columns. If a digit survives in three cells of the box and
            they happen to be an entire row or an entire column of that box, the digit is confined to that line. Since the box must contain
            the digit exactly once, it will be placed on that line, and no other cell of the line can hold it.
        </p>
        <p>
            The pattern arises naturally in two shapes. Sometimes the box has many blanks but the digit is blocked from six of them by
            crossing lines. More often the box is nearly full and simply has three cells left, all in the same band. That second shape is
            the one to look for on a busy grid.
        </p>
        <p>
            Because pointing triples remove candidates from six cells at once, they are often the single most productive elimination
            available on a mid-difficulty puzzle, even though the reasoning is no harder than a pointing pair.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.PointingTriple}>
            The top-right box has three blanks, r1c7, r2c7 and r3c7, and all of them lie in column 7. The digit 8 is therefore removed from
            r4c7 and r5c7.
        </TechniqueWorkedExample>
        <p>
            The top-right box is missing 6, 7 and 8, and its only empty cells are r1c7, r2c7 and r3c7. Every one of them can still take an
            8. Because the box has to place its 8 somewhere, and all three homes stand in column 7, column 7 receives its 8 from inside that
            box.
        </p>
        <p>
            Two cells further down the column still had 8 in their candidate lists, r4c7 and r5c7. Both lose it, and both are left with 1
            and 2 only. That immediately sets up a naked pair in column 7, which is a good illustration of how intersections feed the subset
            techniques.
        </p>
        <h2>How to spot a pointing triple</h2>
        <HowTo name="How to spot a pointing triple in Sudoku">
            <HowToStep name="Find a box with three blanks in one band">
                Boxes whose remaining empty cells all sit in one row or one column of the box are the natural home of this pattern.
            </HowToStep>
            <HowToStep name="Pick a digit the box still needs">
                Check each missing digit in turn and mark the cells of the box where it is still possible.
            </HowToStep>
            <HowToStep name="Confirm all survivors share one line">
                Three survivors in the same row or the same column point. Three survivors spread across different rows and columns do not.
            </HowToStep>
            <HowToStep name="Clear the line outside the box">
                Remove the digit from the six cells of that row or column that lie in the other two boxes, then rescan those boxes for new
                singles.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Treating three aligned cells as a pointing triple when the digit is also possible in a fourth cell of the box. Every
                survivor must be on the line.
            </li>
            <li>Confusing it with a naked triple. A pointing triple is about one digit in three cells, not three digits in three cells.</li>
            <li>Eliminating inside the box. The box cells keep the candidate; only the rest of the line loses it.</li>
            <li>
                Assuming a box with three blanks always gives a pointing triple. It only does so for digits that can still land in all
                three, and only when those three form a straight line.
            </li>
        </ul>
        <FaqPage>
            <FaqHeading>Pointing triple FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is a pointing triple harder than a pointing pair?</FaqQuestion>
                <FaqAnswer>
                    The reasoning is identical, so most solvers rate them together. Suuudokuuu ranks the triple one step above the pair only
                    because scanning three-cell patterns takes slightly more work than scanning two-cell ones.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can a pointing triple exist in a box with more than three empty cells?</FaqQuestion>
                <FaqAnswer>
                    Yes. What matters is where the digit can go, not how many blanks the box has. A box with six blanks still gives a
                    pointing triple if crossing lines block the digit from three of them.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How many candidates does it remove?</FaqQuestion>
                <FaqAnswer>
                    Up to six, one for each cell of the line outside the box. In practice several of those cells are already solved or never
                    had the candidate, so a typical triple removes one to three marks.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is there a pointing quad?</FaqQuestion>
                <FaqAnswer>
                    No. A box row or box column only holds three cells, so a digit confined to a line inside a box can never occupy four
                    cells. Pointing patterns stop at three.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={boxLineReductionPageMetadata} previous={pointingPairPageMetadata} />
    </main>
);

export default PointingTriplePage;
