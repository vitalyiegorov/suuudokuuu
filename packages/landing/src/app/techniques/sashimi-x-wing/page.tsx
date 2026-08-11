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
import { finnedSwordfishPageMetadata } from '../finned-swordfish/metadata';
import { sashimiSwordfishPageMetadata } from '../sashimi-swordfish/metadata';

import { sashimiXWingPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(sashimiXWingPageMetadata);

const EXAMPLE_BOARD = '953168742862734951417..28367.6..3.252816453973.527..68.38.2.674.7438.2196294.7.83';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const SashimiXWingPage = () => (
    <main>
        <TechniquePageHeader title="Sashimi X-Wing" />
        <p>
            A Sashimi X-Wing is a finned X-Wing where one of the two base lines is missing its normal second corner candidate entirely,
            leaving only a single cell there, yet the pattern still forces the same kind of eliminations as an ordinary finned fish.
        </p>
        <TechniqueSummary>
            <p>
                Find a near-X-Wing where one base line offers only one candidate cell for the digit, and the other base line offers its
                corner cell plus a fin. The single cell and the fin together still justify eliminating the digit from cells that see the
                fin.
            </p>
        </TechniqueSummary>
        <h2>When a Sashimi X-Wing applies</h2>
        <p>
            An ordinary finned X-Wing keeps both base lines close to the plain X-Wing shape: each line has its corner cell inside the two
            cover lines, and one line has an extra fin outside them. A Sashimi X-Wing goes one step further by letting a base line drop its
            corner cell in one of the cover lines altogether, so that line contributes only one candidate cell rather than two. The missing
            corner is “cut away”, which is where the sashimi name comes from.
        </p>
        <p>
            The two-branch argument still works. One base line supplies exactly one candidate inside the cover lines. The other supplies a
            candidate inside the cover lines plus a fin outside them. Whichever way the digit actually falls — at the lone cell, at the
            other line’s cover cell, or at the fin — any cell that shares a unit with the fin and also sits in a cover line is ruled out,
            for the same either/or reason as a regular finned fish.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.SashimiXWing}>
            The digit 1 has base rows 6 and 9 over cover columns 5 and 7. Row 9 keeps only its column-5 corner, while row 6 keeps its
            column-7 corner plus a fin at r6c6. The solver reports an elimination at r4c5.
        </TechniqueWorkedExample>
        <p>
            In row 9, the only cell left that can hold 1 is r9c5 — the cover-column-5 corner, with no candidate at column 7 at all. In row
            6, 1 is a candidate at r6c7 — the cover-column-7 corner — and also at r6c6, a cell outside both cover columns. That third cell
            is the fin. Because row 9 is missing its column-7 corner, the base lines only supply the digit through r9c5, r6c7 and the fin at
            r6c6, rather than the four-cell rectangle a plain X-Wing would need.
        </p>
        <p>
            r6c6 sits in the same box as r4c5 — both fall in the middle box that spans rows 4 to 6 and columns 4 to 6. r4c5 was carrying 1
            and 9 before the deduction. Whichever cell in the base lines actually holds 1, r4c5 cannot, because it shares that box with the
            fin, and the fin is the only base-line candidate that reaches outside the two cover columns. The solver removes the 1 and leaves
            9 behind.
        </p>
        <h2>How to spot a Sashimi X-Wing</h2>
        <HowTo name="How to spot a Sashimi X-Wing in Sudoku">
            <HowToStep name="Look for a base line with only one candidate cell">
                Find a row or column where a digit’s only remaining candidate inside a would-be pair of cover lines sits at just one of
                them, not both.
            </HowToStep>
            <HowToStep name="Find the other base line’s corner and fin">
                In the second base line, confirm the digit has a candidate at the matching cover line plus exactly one more cell outside the
                cover lines — the fin.
            </HowToStep>
            <HowToStep name="Check which cells share the fin’s box">
                Look at the cells inside the cover lines, outside the two base lines, and keep only the ones that also share a box with the
                fin.
            </HowToStep>
            <HowToStep name="Eliminate the digit there">
                Remove the digit from that narrower set of cells. The missing corner does not widen the elimination; it only changes how the
                base lines are justified.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Requiring both base lines to have a full corner pair. A Sashimi fish is defined by one base line having only a single
                candidate cell in the cover lines.
            </li>
            <li>
                Forgetting to check the fin’s box against the elimination target. The missing corner does not change that requirement; it is
                identical to a regular finned fish.
            </li>
            <li>
                Confusing a Sashimi X-Wing with a plain finned one. If both base lines still have a full corner pair inside the cover lines,
                the extra cell is an ordinary fin, not a sashimi cut.
            </li>
            <li>
                Assuming the missing corner means the digit is already solved for that line. It only means the digit has one home there
                among the cover columns; the line may still carry the digit in other, unrelated columns.
            </li>
        </ul>
        <h2>Sashimi X-Wing FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Why is it called Sashimi?</FaqQuestion>
                <FaqAnswer>
                    The name follows a common convention in fish-pattern terminology: a normal fin is a small extra piece attached to the
                    fish, while a sashimi fish has had one of its own corner cells cut away, leaving a thinner shape that still functions.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does a Sashimi X-Wing eliminate more or less than a Finned X-Wing?</FaqQuestion>
                <FaqAnswer>
                    Neither, in general. Both restrict eliminations to cells that share the fin’s box. The difference is only in how the
                    base lines are shaped, not in how far the elimination reaches once the fin is found.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can both base lines be missing a corner at once?</FaqQuestion>
                <FaqAnswer>
                    No. At least one base line still needs a full corner pair, or the pattern loses the second cover line’s coverage
                    entirely and stops being a fish at all.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How does this relate to a Sashimi Swordfish?</FaqQuestion>
                <FaqAnswer>
                    A Sashimi Swordfish applies the same missing-corner idea to a three-line fish instead of two. The Sashimi Swordfish page
                    walks through that larger version.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={sashimiSwordfishPageMetadata} previous={finnedSwordfishPageMetadata} />
    </main>
);

export default SashimiXWingPage;
