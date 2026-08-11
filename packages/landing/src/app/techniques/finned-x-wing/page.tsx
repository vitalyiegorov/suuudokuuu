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
import { jellyfishPageMetadata } from '../jellyfish/metadata';

import { finnedXWingPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(finnedXWingPageMetadata);

const EXAMPLE_BOARD = '953168742862734..1417..28367.6..3.2...1.4...7..5.7..6..38.2..74.7438.2.96294.7...';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const FinnedXWingPage = () => (
    <main>
        <TechniquePageHeader title="Finned X-Wing" />
        <p>
            A Finned X-Wing is an X-Wing that has picked up one extra candidate cell, called a fin, in one of its base rows or columns, and
            still supports a smaller but safe set of eliminations near that fin.
        </p>
        <TechniqueSummary>
            <p>
                Find an almost-X-Wing where one base line has a third candidate cell outside the two cover lines. The pattern still works,
                but only against cells that also see the fin, not the whole cover line.
            </p>
        </TechniqueSummary>
        <h2>When a Finned X-Wing applies</h2>
        <p>
            A plain X-Wing needs exactly two candidate cells in each of its two base rows. Real boards are less tidy than that, and a digit
            often has a third candidate cell in one of the rows, sitting outside the two shared columns. That extra cell is the fin. A fin
            does not automatically break the pattern; it just means the digit could be placed there instead of at the fish’s corner in that
            row, so the clean rectangle logic no longer covers the whole cover line unconditionally.
        </p>
        <p>
            What still holds is narrower but genuine: any cell that would be eliminated by the ordinary X-Wing, and that also sees the fin
            cell — shares its row, column or box — cannot hold the digit either way. If the fin turns out to hold the digit, that cell is
            eliminated because it sees the fin. If the fin does not hold the digit, the row collapses back into a clean X-Wing and the cell
            is eliminated by the ordinary rectangle logic. Either branch removes the candidate, so the elimination is safe even though the
            fin’s own value is still unknown.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.FinnedXWing}>
            The digit 1 forms an X-Wing on rows 4 and 9 across columns 5 and 7, but row 9 also carries 1 at r9c8 — the fin. Because r7c7
            shares the fin’s box, the solver reports an elimination there.
        </TechniqueWorkedExample>
        <p>
            In row 4, the digit 1 is a candidate at r4c5 and r4c7. In row 9, it is a candidate at r9c5 and r9c7 as well — the same two
            columns — which is exactly an X-Wing shape. Row 9 also carries 1 at r9c8, a third cell outside columns 5 and 7. That third
            candidate is the fin: it stops the pattern from eliminating 1 across the whole of columns 5 and 7, because row 9 might end up
            placing its 1 at the fin instead of at r9c5 or r9c7.
        </p>
        <p>
            r9c8 sits in the bottom-right box together with r7c7, r8c7 and the rest of that 3×3 block. r7c7 was carrying 1, 5 and 6 before
            the deduction. If the fin at r9c8 holds 1, r7c7 cannot, because they share a box. If the fin does not hold 1, row 9 falls back
            to the clean X-Wing on columns 5 and 7, and r7c7 cannot hold 1 for that reason instead. Either way 1 is impossible at r7c7, so
            the solver removes it and leaves 5 and 6 behind.
        </p>
        <h2>How to spot a Finned X-Wing</h2>
        <HowTo name="How to spot a Finned X-Wing in Sudoku">
            <HowToStep name="Look for an almost-X-Wing">
                Find two rows where a digit’s candidates mostly line up in the same two columns, but one row has exactly one extra candidate
                cell outside those columns.
            </HowToStep>
            <HowToStep name="Identify the fin">
                The extra candidate cell is the fin. If a row has two or more extra cells, the pattern does not qualify as a Finned X-Wing.
            </HowToStep>
            <HowToStep name="Find cells that see both a cover line and the fin">
                Look at the cells the ordinary X-Wing would have cleared, and keep only the ones that also share a row, column or box with
                the fin.
            </HowToStep>
            <HowToStep name="Eliminate the digit from those cells only">
                Remove the digit from that narrower set of cells. Cells that see a cover line but not the fin are not provably clear.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Eliminating the digit from the whole cover line, as a clean X-Wing would. A finned pattern only clears cells that also see
                the fin.
            </li>
            <li>
                Allowing more than one fin cell per base line. Two or more extra candidates usually mean the fish needs a bigger frame, not
                a fin.
            </li>
            <li>
                Forgetting to check whether the fin sits in the same box as a candidate cell, not just the same row or column. Box
                visibility is often the only link available.
            </li>
            <li>
                Treating the fin as a placement. The fin is still just a candidate; the technique never decides whether it holds the digit,
                only that either outcome clears the target cells.
            </li>
        </ul>
        <h2>Finned X-Wing FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Can a base line have more than one fin?</FaqQuestion>
                <FaqAnswer>
                    Some solvers allow several fin cells as long as they all sit in the same box, which keeps the shared-visibility argument
                    intact. A single fin, as in the worked example, is the simplest and most common case.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why does the elimination only reach one cell here?</FaqQuestion>
                <FaqAnswer>
                    Because r7c7 was the only cell, outside the base rows, that both carried the digit and shared a box with the fin. A
                    different board could have several such cells.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does a Finned X-Wing ever collapse back into a plain X-Wing?</FaqQuestion>
                <FaqAnswer>
                    Yes. If the fin candidate is removed by some other deduction, the row goes back to exactly two candidate cells and the
                    pattern becomes an ordinary X-Wing with the wider set of eliminations.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How does a Finned X-Wing relate to a Sashimi X-Wing?</FaqQuestion>
                <FaqAnswer>
                    A Sashimi X-Wing is a special case where removing the fin cell’s own candidate would leave a smaller, still valid X-Wing
                    behind. The Sashimi X-Wing page covers that variant directly.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={finnedSwordfishPageMetadata} previous={jellyfishPageMetadata} />
    </main>
);

export default FinnedXWingPage;
