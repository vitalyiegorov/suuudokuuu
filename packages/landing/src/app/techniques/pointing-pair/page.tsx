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
import { hiddenSinglePageMetadata } from '../hidden-single/metadata';
import { pointingTriplePageMetadata } from '../pointing-triple/metadata';

import { pointingPairPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(pointingPairPageMetadata);

const EXAMPLE_BOARD = '9.3.....2..2.....1..7..2.36..6..3.2...1.4......5....6..3......4.74.8...962.4.7...';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const PointingPairPage = () => (
    <main>
        <TechniquePageHeader title="Pointing Pair" />
        <p>
            A pointing pair occurs when a digit can only go in two cells of a box and both of those cells lie on the same row or column, so
            the digit can be erased from every other cell of that line.
        </p>
        <TechniqueSummary>
            <p>
                Two cells, one box, one line. Because the box must contain the digit somewhere, and both of its remaining homes sit on the
                same line, the digit is committed to that line inside the box and cannot appear anywhere else along it.
            </p>
        </TechniqueSummary>
        <h2>When a pointing pair applies</h2>
        <p>
            A pointing pair is the first technique on this list that never places a digit. It removes candidates, and those removals are
            what make the next single visible. The logic is short: every box contains each digit exactly once, so if a digit has only two
            possible cells left in a box and both share a row, the digit is definitely in that row. Anything else on the row, outside the
            box, can therefore lose the candidate.
        </p>
        <p>
            The technique is also known as a locked candidate or box-line interaction of type one. The direction matters: a pointing pair
            reasons from the box outward to the line. The reverse deduction, from a line inward to a box, is box line reduction and is
            listed separately.
        </p>
        <p>
            Pointing pairs are extremely common in medium puzzles. They usually appear the moment a box loses most of its blanks, because
            the surviving candidates for a digit get squeezed into a single band of three cells.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.PointingPair}>
            In the bottom-left box the digit 1 survives only in r7c1 and r8c1, both in column 1. The solver therefore erases 1 from r3c1.
        </TechniqueWorkedExample>
        <p>
            The bottom-left box has four empty cells: r7c1, r7c3, r8c1 and r9c3. Only r7c1 and r8c1 can still take a 1, and they sit one
            above the other in column 1. Whichever of the two ends up holding the digit, column 1 gets its 1 from inside that box.
        </p>
        <p>
            Column 1 has one other cell that still listed 1 as a candidate, r3c1, and it is now impossible. Removing it leaves r3c1 with 4,
            5 and 8. Nothing was placed, but the column is one step closer to a single, which is exactly what an intersection technique is
            for.
        </p>
        <h2>How to spot a pointing pair</h2>
        <HowTo name="How to spot a pointing pair in Sudoku">
            <HowToStep name="Choose a box that is missing a digit">
                Work box by box and pick a digit the box still needs. Boxes with three or four blanks give the best odds.
            </HowToStep>
            <HowToStep name="Mark every cell in the box that can hold it">
                Cross out cells blocked by their row or column. You are looking for exactly two survivors.
            </HowToStep>
            <HowToStep name="Check whether the two survivors share a line">
                Both in the same row, or both in the same column, is what makes the pair point. Two cells sitting diagonally prove nothing.
            </HowToStep>
            <HowToStep name="Erase the digit from the rest of that line">
                Delete the candidate from the six cells of the line that lie outside the box, then look for a naked or hidden single among
                them.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>Erasing the candidate from the wrong direction, that is from the rest of the box instead of the rest of the line.</li>
            <li>
                Accepting two survivors that are not aligned. If the pair is diagonal inside the box, the digit is not locked to any line
                and there is nothing to remove.
            </li>
            <li>
                Forgetting that the two pair cells keep the candidate. A pointing pair says nothing about which of the two takes the digit.
            </li>
            <li>Skipping the follow-up scan. The elimination is only useful if you then look for the single it exposed.</li>
        </ul>
        <h2>Pointing pair FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Is a pointing pair the same as a locked candidate?</FaqQuestion>
                <FaqAnswer>
                    Yes. “Locked candidate type 1” and “box-line interaction” are the same deduction. Suuudokuuu names it Pointing Pair when
                    two cells are involved and Pointing Triple when three are.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does a pointing pair ever place a digit?</FaqQuestion>
                <FaqAnswer>
                    Not by itself. It only removes candidates. Those removals frequently turn a nearby cell into a naked single or a digit
                    into a hidden single, which is where the placement comes from.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What is the difference from box line reduction?</FaqQuestion>
                <FaqAnswer>
                    A pointing pair starts in a box and eliminates along a line. Box line reduction starts on a line and eliminates inside a
                    box. Same intersection, opposite direction of reasoning.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do I need full pencil marks to use it?</FaqQuestion>
                <FaqAnswer>
                    You need the candidates for one digit in one box, which is easy to work out by cross-hatching. Full pencil marks make
                    the pattern obvious but are not required to find it.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={pointingTriplePageMetadata} previous={hiddenSinglePageMetadata} />
    </main>
);

export default PointingPairPage;
