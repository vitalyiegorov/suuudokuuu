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
import { aicPageMetadata } from '../aic/metadata';
import { xyChainPageMetadata } from '../xy-chain/metadata';

import { simpleColoringPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(simpleColoringPageMetadata);

const EXAMPLE_BOARD = '953168742862734..1417..28367.6..3.252.164...73.527..68.38.2.674.7438.2.96294.7...';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const SimpleColoringPage = () => (
    <main>
        <TechniquePageHeader title="Simple Coloring" />
        <p>
            Simple coloring assigns two alternating colors to a chain of strong links on one digit, then erases any candidate for that digit
            that can see cells of both colors at once.
        </p>
        <TechniqueSummary>
            <p>
                Follow a digit’s strong links — units where it has exactly two candidate cells — and paint the cells two alternating colors
                along the chain. A cell outside the chain that sees one color and one of the other cannot hold the digit.
            </p>
        </TechniqueSummary>
        <h2>When simple coloring applies</h2>
        <p>
            Simple coloring builds the same kind of network an X-Chain does, but uses only strong links — no weak links — and tracks the
            whole connected network at once instead of a single path between two endpoints. Starting from any cell in the network, alternate
            two colors along every strong link: if a cell is one color, the cell it is strongly linked to must be the other, because a
            strong link means one of the two must hold the digit whenever the other does not.
        </p>
        <p>
            Once every reachable cell in the network is colored, two elimination rules apply. A cell outside the network that sees two cells
            of the same color proves that color is impossible everywhere — a color wrap — clearing every cell of that color at once. A cell
            outside the network that sees one cell of each color cannot hold the digit either, because whichever color turns out to be
            correct, that cell sees a cell holding the digit — a color trap, and the more common case in practice.
        </p>
        <p>
            Because coloring only follows strong links, it misses patterns that need a weak link somewhere in the middle, which is exactly
            what X-Chains and the more general AIC add on top of it.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.SimpleColoring}>
            The digit 1 colors r9c5 and r4c7 one color, r4c5 and r6c7 the other, through strong links on row 4, row 6, column 5 and a box.
            Because r9c7 sees both colors, the solver eliminates 1 there.
        </TechniqueWorkedExample>
        <p>
            r4c5 and r9c5 are the only candidates for 1 in column 5, a strong link. r4c5 and r4c7 are the only candidates for 1 in row 4,
            another strong link. r4c7 and r6c7 are the only candidates for 1 in their shared box, a third strong link. r6c6 and r6c7 are the
            only candidates for 1 in row 6, a fourth strong link. Coloring from r4c5 outward: r4c5 is color A, which makes r9c5 color B
            through column 5 and r4c7 color B through row 4. r4c7 being B makes r6c7 color A through the box link, and r6c7 being A makes
            r6c6 color B through row 6.
        </p>
        <p>
            r9c7 was carrying 1, 3 and 5 before the deduction. It sees r6c7, color A, through column 7, and it sees r9c5, color B, through
            row 9. Whichever color turns out to hold the actual 1, r9c7 sees a cell of that color, so it cannot hold 1 itself. The solver
            removes it and leaves 3 and 5 behind.
        </p>
        <h2>How to spot simple coloring</h2>
        <HowTo name="How to spot simple coloring in Sudoku">
            <HowToStep name="Pick a digit and map its strong links">
                For one digit, find every unit where it has exactly two candidate cells, and note both cells of each such strong link.
            </HowToStep>
            <HowToStep name="Color the connected network">
                Starting from any cell, alternate two colors across every strong link that connects to it, following the network as far as
                it reaches.
            </HowToStep>
            <HowToStep name="Look for a color wrap">
                Check whether any cell outside the network sees two cells of the same color. If so, every cell of that color can be cleared.
            </HowToStep>
            <HowToStep name="Look for a color trap">
                Check whether any cell outside the network sees one cell of each color. If so, that cell can have the digit erased.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Coloring across a weak link. Simple coloring only follows strong links; a unit with three or more candidate cells for the
                digit does not extend the network.
            </li>
            <li>
                Eliminating the digit from a cell inside the colored network. The network’s own cells are exactly where the digit is still
                being decided.
            </li>
            <li>
                Mixing up the wrap and trap rules. A wrap clears an entire color because two same-colored cells contradict each other; a
                trap clears one outside cell because it sees both colors.
            </li>
            <li>
                Stopping at the first strong link found. The network can spread through many cells before a trap or wrap becomes visible.
            </li>
        </ul>
        <h2>Simple coloring FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>What if the network contains a strong link that would color a cell both colors?</FaqQuestion>
                <FaqAnswer>
                    That contradiction means the whole network is invalid at that digit and one of the two colors must be false, which is
                    the color wrap rule — every cell holding that color can have the digit erased.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can a coloring network cover the whole board?</FaqQuestion>
                <FaqAnswer>
                    In principle yes, if every strong link on the digit connects into one network. In practice most boards split into
                    several smaller, separate networks for the same digit.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How does simple coloring relate to an X-Chain?</FaqQuestion>
                <FaqAnswer>
                    Both work on a single digit’s strong links. An X-Chain also allows weak links between strong ones, which lets it find a
                    path between two specific cells that pure coloring, using only strong links, cannot reach.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does simple coloring ever place a digit directly?</FaqQuestion>
                <FaqAnswer>
                    No, it is purely an elimination technique, though a color wrap or trap can strip a cell down to its last remaining
                    candidate and expose a single on the next pass.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={aicPageMetadata} previous={xyChainPageMetadata} />
    </main>
);

export default SimpleColoringPage;
