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
import { simpleColoringPageMetadata } from '../simple-coloring/metadata';
import { xChainPageMetadata } from '../x-chain/metadata';

import { xyChainPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(xyChainPageMetadata);

const EXAMPLE_BOARD = '953168742862734951417..28367.6..3.2528164..973.527..68.38.2.674.7438.2.96294.7..3';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const XYChainPage = () => (
    <main>
        <TechniquePageHeader title="XY-Chain" />
        <p>
            An XY-Chain links bivalue cells end to end, each one sharing a candidate with the next, so that the chain’s two endpoints agree
            on one value between them and that value can be erased from every cell both endpoints see.
        </p>
        <TechniqueSummary>
            <p>
                Follow a path of two-candidate cells where each consecutive pair shares one candidate, alternating which of a cell’s two
                values links backward and which links forward. Whatever the first cell turns out to be, the chain forces the same candidate
                onto the last cell.
            </p>
        </TechniqueSummary>
        <h2>When an XY-Chain applies</h2>
        <p>
            An XY-Wing is a three-cell XY-Chain. The same idea extends to any length: string together cells that each carry exactly two
            candidates, where consecutive cells share one value in common. At each interior cell, one of its two candidates connects back to
            the previous cell and the other connects forward to the next one — the two values alternate down the chain like a line of
            dominoes.
        </p>
        <p>
            The proof follows the chain from one end. Assume the first cell does not hold the value that links it to the second cell. Then
            it must hold its other candidate. That forces the second cell away from the shared value, so the second cell must take its own
            other candidate, which forces the third cell, and so on to the last cell. That reasoning shows that whenever the first cell is
            not its own “other” candidate, the last cell ends up holding that same candidate. Combined with the case where the first cell is
            that candidate directly, one of the two endpoints always holds it.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.XYChain}>
            The chain r4c5 → r9c5 → r9c7 → r6c7 → r6c2 links candidates 1, 5, 1 and 4 in turn, leaving 9 as the value both endpoints agree
            on. The solver eliminates 9 from r4c2 and r6c6.
        </TechniqueWorkedExample>
        <p>
            r4c5 holds 1 and 9. r9c5 holds 1 and 5, sharing 1 with r4c5. r9c7 also holds 1 and 5, sharing 5 with r9c5. r6c7 holds 1 and 4,
            sharing 1 with r9c7. r6c2 holds 4 and 9, sharing 4 with r6c7. If r4c5 is not 1, it must be 9 — the chain ends immediately. If
            r4c5 is 1, then r9c5 cannot be 1 and must be 5; then r9c7 cannot be 5 and must be 1; then r6c7 cannot be 1 and must be 4; then
            r6c2 cannot be 4 and must be 9. Either way, one of r4c5 or r6c2 ends up holding 9.
        </p>
        <p>
            r4c2 sits in row 4 with r4c5 and in column 2 with r6c2, so it sees both endpoints. r6c6 sits in the same box as r4c5 and in row
            6 with r6c2, so it sees both endpoints too. r4c2 was carrying 4 and 9, and r6c6 was carrying 1 and 9, before the deduction.
            Since 9 must land at one endpoint or the other, neither r4c2 nor r6c6 can hold it, and the solver removes both.
        </p>
        <p>
            XY-Chains, alongside X-Chains and simple coloring, are the kind of technique that typically pushes a Sudoku-Explainer rating
            past 7.0 — the point where the grid needs reasoning across a whole path of cells rather than a fixed small pattern.
        </p>
        <h2>How to spot an XY-Chain</h2>
        <HowTo name="How to spot an XY-Chain in Sudoku">
            <HowToStep name="Map every bivalue cell">
                List every cell with exactly two remaining candidates, along with what those two candidates are.
            </HowToStep>
            <HowToStep name="Link cells that share a candidate">
                Connect two bivalue cells if they see each other and share exactly one candidate. That shared candidate is the link between
                them.
            </HowToStep>
            <HowToStep name="Follow the chain to a consistent endpoint value">
                Trace a path where each cell’s incoming and outgoing links use its two different candidates, until the chain’s two endpoints
                share their remaining, unlinked candidate.
            </HowToStep>
            <HowToStep name="Erase that candidate from shared peers">
                Remove the endpoints’ shared candidate from any cell, outside the chain, that sees both endpoints.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Allowing a chain cell with three or more candidates. Every cell in an XY-Chain must be strictly bivalue for the alternating
                argument to hold.
            </li>
            <li>
                Reusing the same candidate for both the incoming and outgoing link at one cell. Each interior cell must alternate between
                its two different values.
            </li>
            <li>
                Eliminating the wrong candidate. Only the value shared by both endpoints — not any value seen along the way — can be erased
                from their common peers.
            </li>
            <li>
                Stopping the search at short chains. XY-Chains can run through many cells; a pattern that fails at three or four cells might
                still close a few links later.
            </li>
        </ul>
        <h2>XY-Chain FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Is an XY-Wing just a short XY-Chain?</FaqQuestion>
                <FaqAnswer>
                    Yes. An XY-Wing is the three-cell case: a pivot and two pincers. An XY-Chain is the general form, with as many
                    intermediate cells as the board provides.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do the chain cells need to be connected in a straight line?</FaqQuestion>
                <FaqAnswer>
                    No. Each link just needs the two cells to see each other, through any row, column or box. The chain can zigzag across
                    the grid in any direction.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How is an XY-Chain different from an X-Chain?</FaqQuestion>
                <FaqAnswer>
                    An X-Chain follows one digit across many cells using strong and weak links on that single value. An XY-Chain follows
                    bivalue cells instead, changing which digit is “active” at every step along the path.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can an XY-Chain eliminate more than one candidate at once?</FaqQuestion>
                <FaqAnswer>
                    Yes, as the worked example shows. Every cell that sees both endpoints loses the shared candidate, and a chain’s
                    endpoints can often be seen by more than one other cell.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={simpleColoringPageMetadata} previous={xChainPageMetadata} />
    </main>
);

export default XYChainPage;
