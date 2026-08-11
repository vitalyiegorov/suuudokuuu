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
import { sashimiXWingPageMetadata } from '../sashimi-x-wing/metadata';
import { xyWingPageMetadata } from '../xy-wing/metadata';

import { sashimiSwordfishPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(sashimiSwordfishPageMetadata);

const EXAMPLE_BOARD = '953168742862734951417..28367.6..3.252816453973.527..68.38.2.674.7438.2196294.7583';

const example = buildTechniqueExample(EXAMPLE_BOARD, SolutionTechniqueEnum.SashimiSwordfish);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const SashimiSwordfishPage = () => (
    <main>
        <TechniquePageHeader title="Sashimi Swordfish" />
        <p>
            A Sashimi Swordfish is the three-line sashimi pattern: one of the three base lines is missing a candidate at one of the cover
            lines, but the fish still proves the same finned-style eliminations once the fin’s box is found.
        </p>
        <TechniqueSummary>
            <p>
                Find a near-Swordfish where one base line contributes only one cover-line candidate instead of two, and one of its remaining
                candidates falls outside the cover lines as a fin. Cells that share the fin’s box are still safe to clear.
            </p>
        </TechniqueSummary>
        <h2>When a Sashimi Swordfish applies</h2>
        <p>
            A Finned Swordfish keeps all three base lines close to a full Swordfish shape, with one stray candidate acting as a fin. A
            Sashimi Swordfish is thinner: one of the base lines has a candidate that would normally sit inside the three cover lines, but
            instead sits outside them, so that base line contributes only one cover-line cell rather than two or three. The line has been
            “cut”, in the same sense as the Sashimi X-Wing, and the displaced candidate becomes the fin.
        </p>
        <p>
            The proof is unchanged from any other finned fish. Every cell that sits inside the three cover lines, outside the three base
            lines, and shares a unit with the fin, cannot hold the digit — because either the fin holds it, or the base lines settle back
            into a shape that covers the cell some other way. The sashimi cut only changes how thin the base lines are allowed to be, not
            the elimination rule itself.
        </p>
        <p>
            As with the X-Wing’s sashimi variant, this pattern is stricter to confirm than a regular Finned Swordfish, since one base line
            is down to a single relevant candidate, but it still reaches real eliminations that a plain three-by-three Swordfish would miss.
        </p>
        <h2>Worked example</h2>
        <TechniqueExampleBoard example={example}>
            The digit 1 uses base columns 1, 5 and 7 over cover rows 4, 6 and 7. Column 5 keeps only r4c5 inside those rows, leaving r9c5 as
            a fin. The solver reports an elimination at r7c6.
        </TechniqueExampleBoard>
        <p>
            Column 1 has one candidate for 1 in the cover rows: r7c1. Column 7 has two: r4c7 and r6c7. Column 5 also has two candidates for
            1 overall, but only one of them, r4c5, falls inside rows 4, 6 and 7 — the other, r9c5, sits in row 9, outside the chosen cover
            rows. That leftover candidate is the fin, and column 5 supplying only one cover-row cell is the sashimi cut.
        </p>
        <p>
            r9c5 sits in the bottom-middle box, the same box that holds r7c4, r7c5 and r7c6. r7c6 was carrying 1 and 9 before the deduction.
            Column 5 is already one of the fish’s own base columns, so it is excluded from the elimination search regardless; r7c6 sits in
            column 6, inside the box, and inside cover row 7. Whichever cell in the base lines actually holds 1, r7c6 cannot, because it
            shares the fin’s box and column 5 cannot itself be the source of that elimination. The solver removes the 1 and leaves 9 behind.
        </p>
        <h2>How to spot a Sashimi Swordfish</h2>
        <HowTo name="How to spot a Sashimi Swordfish in Sudoku">
            <HowToStep name="Look for a thin base line">
                Find three lines where a digit’s candidates mostly line up across three cover lines, but one base line has only one
                candidate inside them.
            </HowToStep>
            <HowToStep name="Find that base line’s leftover candidate">
                Confirm the thin base line has exactly one more candidate for the digit, sitting outside the three cover lines. That is the
                fin.
            </HowToStep>
            <HowToStep name="Check which cells share the fin’s box">
                Look at the cells inside the cover lines, outside the three base lines, and keep only the ones that also share a box with
                the fin.
            </HowToStep>
            <HowToStep name="Eliminate the digit there">
                Remove the digit from that narrower set of cells, remembering that cells inside a base line itself are never eliminated.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>Requiring every base line to reach two or three of the cover lines. A sashimi cut means one base line only reaches one.</li>
            <li>
                Eliminating the digit from a cell that sits inside one of the base lines. Base-line cells are exactly where the digit may
                still legally go.
            </li>
            <li>
                Missing that the fin has to fall in a single box shared with the target cells. If the fin’s remaining candidates spread
                across more than one box, the pattern does not qualify.
            </li>
            <li>
                Confusing which line is base and which is cover. The sashimi cut always applies to a base line losing a cover-line
                candidate, not the other way around.
            </li>
        </ul>
        <h2>Sashimi Swordfish FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>How is this different from a Finned Swordfish?</FaqQuestion>
                <FaqAnswer>
                    A Finned Swordfish keeps all three base lines at their full corner count and adds one stray candidate. A Sashimi
                    Swordfish instead lets one base line drop to a single cover-line candidate, with the fin taking the place of the missing
                    one.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can more than one base line be cut at once?</FaqQuestion>
                <FaqAnswer>
                    No. At least two of the three base lines need to keep enough cover-line coverage for the fish to still prove anything;
                    cutting more than one line collapses the pattern.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does the sashimi cut change where eliminations land?</FaqQuestion>
                <FaqAnswer>
                    No. Eliminations still land only on cells inside the cover lines that also share the fin’s box. The cut changes how thin
                    the base lines are, not the elimination rule.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What comes after the fish family in difficulty?</FaqQuestion>
                <FaqAnswer>
                    The wing patterns — XY-Wing, XYZ-Wing and W-Wing — which reason about bivalue cells and strong links rather than rows
                    and columns of the same digit.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={xyWingPageMetadata} previous={sashimiXWingPageMetadata} />
    </main>
);

export default SashimiSwordfishPage;
