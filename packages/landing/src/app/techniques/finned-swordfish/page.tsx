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
import { finnedXWingPageMetadata } from '../finned-x-wing/metadata';
import { sashimiXWingPageMetadata } from '../sashimi-x-wing/metadata';

import { finnedSwordfishPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(finnedSwordfishPageMetadata);

const EXAMPLE_BOARD = '953168742862734951417..28367.6..3.252816453973.527..68.38.2.674.7438.2.96294.7..3';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const FinnedSwordfishPage = () => (
    <main>
        <TechniquePageHeader title="Finned Swordfish" />
        <p>
            A Finned Swordfish is a Swordfish pattern with one extra candidate cell, called a fin, sitting outside the three cover columns,
            which narrows the elimination down to whatever the fin itself can still see.
        </p>
        <TechniqueSummary>
            <p>
                Find an almost-Swordfish where the three base rows carry a digit in four columns instead of three. The pattern still works,
                but only against cells that also see the extra, fourth candidate.
            </p>
        </TechniqueSummary>
        <h2>When a Finned Swordfish applies</h2>
        <p>
            A plain Swordfish needs three rows whose candidate cells for a digit span exactly three columns between them. A Finned Swordfish
            starts from the same three rows, but one of them carries a fourth, stray candidate cell outside the shared three columns. That
            stray cell is the fin, and just as with the Finned X-Wing, it does not automatically break the pattern — it narrows what the
            pattern can safely prove.
        </p>
        <p>
            The reasoning is the same two-branch argument as the smaller finned fish. If the fin holds the digit, any cell that shares a
            unit with the fin cannot. If the fin does not hold the digit, the three rows collapse back into a clean Swordfish, and any cell
            inside the three cover columns cannot hold the digit either. A cell that satisfies both branches — inside a cover column and
            visible to the fin, most often because it shares the fin’s box — is safe to clear regardless of which branch turns out to be
            true.
        </p>
        <p>
            Because the fin restricts the safe cells to only those that also see it, a Finned Swordfish usually proves far less than a clean
            one would. It is still worth checking, because it can surface eliminations that a strict three-by-three frame never would on a
            real board.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.FinnedSwordfish}>
            The digit 1 spans rows 6, 7 and 8 across columns 1, 6 and 7, but row 8 also carries 1 at r8c8 — the fin. Because r9c7 shares the
            fin’s box, the solver reports an elimination there.
        </TechniqueWorkedExample>
        <p>
            Across rows 6, 7 and 8, the digit 1 is a candidate at r6c6, r6c7, r7c1, r7c6, r8c1 and r8c6 — six cells spanning columns 1, 6
            and 7, which is a clean Swordfish shape. Row 8 also carries 1 at r8c8, a seventh cell in a fourth column. That extra candidate
            is the fin: it stops the pattern from clearing 1 across the whole of columns 1, 6 and 7, because row 8 might place its 1 at the
            fin instead of at r8c1 or r8c6.
        </p>
        <p>
            r8c8 sits in the bottom-right box together with r9c7. r9c7 was carrying 1 and 5 before the deduction. If the fin at r8c8 holds
            1, r9c7 cannot, because they share a box. If the fin does not hold 1, rows 6, 7 and 8 fall back to the clean Swordfish on
            columns 1, 6 and 7, and r9c7 cannot hold 1 for that reason instead, since column 7 is one of the cover columns. Either way 1 is
            impossible at r9c7, so the solver removes it and leaves 5 behind — a naked single for the next pass.
        </p>
        <h2>How to spot a Finned Swordfish</h2>
        <HowTo name="How to spot a Finned Swordfish in Sudoku">
            <HowToStep name="Look for an almost-Swordfish">
                Find three rows where a digit’s candidates mostly line up in the same three columns, but the combined span reaches a fourth
                column through exactly one extra cell.
            </HowToStep>
            <HowToStep name="Identify the fin">
                The extra candidate cell is the fin. If more than one cell sits outside the three shared columns, the pattern does not
                qualify as a Finned Swordfish.
            </HowToStep>
            <HowToStep name="Find cells that see both a cover column and the fin">
                Look at the cells the ordinary Swordfish would have cleared, and keep only the ones that also share a row, column or box
                with the fin.
            </HowToStep>
            <HowToStep name="Eliminate the digit from those cells only">
                Remove the digit from that narrower set of cells. Cells that see a cover column but not the fin are not provably clear.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Eliminating the digit across the whole cover columns, as a clean Swordfish would. A finned pattern only clears cells that
                also see the fin.
            </li>
            <li>
                Missing the fin entirely and dismissing the near-Swordfish as invalid. One extra candidate cell does not rule the pattern
                out, it just changes what it can prove.
            </li>
            <li>
                Allowing two or more stray cells and still calling it a Finned Swordfish. Beyond one fin, the argument needs every fin cell
                to share a box for the elimination to hold.
            </li>
            <li>Forgetting box visibility. Fin-based eliminations most often depend on a shared box, not just a shared row or column.</li>
        </ul>
        <h2>Finned Swordfish FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>How is a Finned Swordfish different from a Finned X-Wing?</FaqQuestion>
                <FaqAnswer>
                    Only in size. A Finned X-Wing starts from a two-by-two fish with one stray cell; a Finned Swordfish starts from a
                    three-by-three fish with one stray cell. The two-branch reasoning is identical.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why does the worked example only eliminate one candidate?</FaqQuestion>
                <FaqAnswer>
                    Because r9c7 was the only cell, outside the three base rows and inside the cover columns, that also shared a box with
                    the fin at r8c8. A clean Swordfish without the fin would have cleared more cells across all three columns.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can the fin sit in any of the three base rows?</FaqQuestion>
                <FaqAnswer>
                    Yes, any one of them. What matters is that only one row carries the extra candidate, and that the fin’s own unit
                    overlaps with the cells being eliminated.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What happens if the fin cell is later ruled out?</FaqQuestion>
                <FaqAnswer>
                    The three rows collapse back into a plain Swordfish, and the wider set of eliminations across all three cover columns
                    becomes valid.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={sashimiXWingPageMetadata} previous={finnedXWingPageMetadata} />
    </main>
);

export default FinnedSwordfishPage;
