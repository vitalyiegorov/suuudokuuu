import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { HowTo } from '../../../seo/components/how-to/how-to';
import { HowToStep } from '../../../seo/components/how-to-step/how-to-step';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueExampleBoard } from '../../../techniques/components/technique-example-board/technique-example-board';
import { TechniqueNavigation } from '../../../techniques/components/technique-navigation/technique-navigation';
import { TechniquePageHeader } from '../../../techniques/components/technique-page-header/technique-page-header';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { buildTechniqueExample } from '../../../techniques/utils/build-technique-example.util';
import { sashimiSwordfishPageMetadata } from '../sashimi-swordfish/metadata';
import { xyzWingPageMetadata } from '../xyz-wing/metadata';

import { xyWingPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(xyWingPageMetadata);

const EXAMPLE_BOARD = '953168742862734951417..28367.6..3.252816453973.527..68.38.2.674.7438.2196294.7583';

const example = buildTechniqueExample(EXAMPLE_BOARD, SolutionTechniqueEnum.XYWing);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const XYWingPage = () => (
    <main>
        <TechniquePageHeader title="XY-Wing" />
        <p>
            An XY-Wing links three cells that each hold exactly two candidates so that, whichever value the middle cell turns out to hold, a
            shared candidate can be erased from any cell that sees both of the other two.
        </p>
        <TechniqueSummary>
            <p>
                Find a pivot cell with candidates X and Y, and two pincer cells that each share one of those values with the pivot and also
                share a third value, Z, with each other. Z can then be erased from any cell that sees both pincers.
            </p>
        </TechniqueSummary>
        <h2>When an XY-Wing applies</h2>
        <p>
            The fish patterns reason about one digit across several units. An XY-Wing reasons about three digits across three cells instead.
            Pick a pivot cell with exactly two candidates, X and Y. Find two pincer cells, each seeing the pivot, where one pincer holds X
            and a third value Z, and the other holds Y and the same Z. The pivot must hold either X or Y — there is no third option — and
            whichever it holds forces one of the two pincers to hold Z instead.
        </p>
        <p>
            If the pivot turns out to hold X, the X-sharing pincer cannot also hold X, so it must hold Z. If the pivot holds Y, the same
            argument forces the other pincer to hold Z. Either branch ends with some cell in the wing holding Z, so any cell that sees both
            pincers — even though it sees neither branch specifically — cannot hold Z itself.
        </p>
        <p>
            The pivot does not need to see both pincers through the same kind of unit. One pincer might share the pivot’s row, and the other
            its box; what matters is that both pincers see each other closely enough that a target cell can see them both, usually because
            all three cells share a row, column or box in some combination.
        </p>
        <h2>Worked example</h2>
        <TechniqueExampleBoard example={example}>
            The pivot r4c7 holds 1 and 4. Pincer r4c5 holds 1 and 9; pincer r4c2 holds 4 and 9. Because r4c4 sees both pincers along row 4,
            the solver eliminates the shared value 9 there.
        </TechniqueExampleBoard>
        <p>
            r4c7 is the pivot, with candidates 1 and 4. r4c5 shares the pivot’s candidate 1 and also carries 9. r4c2 shares the pivot’s
            candidate 4 and also carries 9. The pivot must hold either 1 or 4. If it holds 1, r4c5 cannot, so r4c5 must hold 9. If the pivot
            holds 4, r4c2 cannot, so r4c2 must hold 9 instead. Either way, one of the two pincers ends up holding 9.
        </p>
        <p>
            r4c4 sits in row 4 alongside both r4c5 and r4c2, so it sees both pincers directly. It was carrying 8 and 9 before the deduction.
            Since one of the two pincers must hold 9 regardless of which value the pivot takes, r4c4 cannot hold 9 either, and the solver
            removes it, leaving 8 behind as a naked single for the next pass.
        </p>
        <h2>How to spot an XY-Wing</h2>
        <HowTo name="How to spot an XY-Wing in Sudoku">
            <HowToStep name="Find a bivalue pivot">
                Look for a cell with exactly two candidates, X and Y. Cells with only two candidates are the only useful pivots.
            </HowToStep>
            <HowToStep name="Find two pincers that each see the pivot">
                Each pincer must share a row, column or box with the pivot, hold exactly two candidates, and include one of X or Y.
            </HowToStep>
            <HowToStep name="Check the pincers share a third value">
                Both pincers must carry the same third candidate, Z, alongside their shared value with the pivot. If they do not match on Z,
                the wing does not close.
            </HowToStep>
            <HowToStep name="Erase Z from cells that see both pincers">
                Any cell, other than the pivot and pincers themselves, that sees both pincers cannot hold Z and can have it removed.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Allowing a pivot or pincer with three or more candidates. Every cell in an XY-Wing must be strictly bivalue for the
                either/or argument to hold.
            </li>
            <li>Eliminating Z from the pivot or the pincers themselves. The elimination only reaches other cells that see both pincers.</li>
            <li>
                Accepting two pincers that do not actually share the same third value. If one pincer’s non-pivot candidate differs from the
                other’s, there is no shared Z to eliminate.
            </li>
            <li>
                Forgetting that a pincer only needs to see the pivot, not the other pincer. The target cell is what needs to see both
                pincers, not the pincers needing to see each other.
            </li>
        </ul>
        <h2>XY-Wing FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Does the pivot need to see both pincers through the same kind of unit?</FaqQuestion>
                <FaqAnswer>
                    No. One pincer might share the pivot’s row and the other its box. What matters is that each pincer individually sees the
                    pivot, not that they see each other the same way.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can an XY-Wing place a digit directly?</FaqQuestion>
                <FaqAnswer>
                    No, it only eliminates candidates. As with the fish patterns, the removal often exposes a naked or hidden single on the
                    next pass, as it does in the worked example.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What is the difference between an XY-Wing and an XYZ-Wing?</FaqQuestion>
                <FaqAnswer>
                    An XYZ-Wing uses a pivot that already carries all three candidates, X, Y and Z, rather than just X and Y. That extra
                    candidate tightens which cells the elimination can reach.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why is it called a wing rather than a chain?</FaqQuestion>
                <FaqAnswer>
                    The three cells fan out from the pivot like two wings, and the deduction closes in exactly one step per branch. Chains,
                    covered later in this list, extend the same either/or logic across more than three cells.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={xyzWingPageMetadata} previous={sashimiSwordfishPageMetadata} />
    </main>
);

export default XYWingPage;
