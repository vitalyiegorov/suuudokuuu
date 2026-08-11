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
import { simpleColoringPageMetadata } from '../simple-coloring/metadata';

import { aicPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(aicPageMetadata);

const EXAMPLE_BOARD = '953168742862734..1417..28367.6..3.252.164...73.527..68.38.2.674.7438.2.96294.7..3';

const example = buildTechniqueExample(EXAMPLE_BOARD, SolutionTechniqueEnum.AIC);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const AICPage = () => (
    <main>
        <TechniquePageHeader title="AIC" />
        <p>
            An Alternating Inference Chain, or AIC, follows a path of alternating strong and weak links across candidates and cells,
            generalising X-Chains, XY-Chains and simple coloring into one technique that is not limited to a single digit or to bivalue
            cells.
        </p>
        <TechniqueSummary>
            <p>
                Build a chain that alternates strong and weak links, switching digit and cell freely as the links allow, until it either
                connects two candidates that share a peer or loops back to contradict its own starting assumption.
            </p>
        </TechniqueSummary>
        <h2>When an AIC applies</h2>
        <p>
            Every chain technique earlier on this list is a restricted case of an AIC. An X-Chain sticks to one digit. An XY-Chain sticks to
            bivalue cells. Simple coloring sticks to strong links only. An AIC drops all three restrictions: a link can be a strong or weak
            link between two candidates of the same cell, or between two cells that share a unit and a digit, and consecutive links can
            switch digits entirely as long as the chain keeps alternating strong and weak.
        </p>
        <p>
            Two link types feed an AIC. A cell link connects two different candidates in the same cell — always at least weak, since a cell
            holds only one value, and strong as well when the cell is bivalue. A unit link connects the same candidate in two cells that
            share a row, column or box — weak if both cells merely allow the digit, strong if the unit has no other cell that can hold it.
        </p>
        <p>
            An AIC can close in two ways. If the two ends land on different cells that share a peer, the shared candidate can be erased from
            that peer, just as in an X-Chain or XY-Chain. If the chain instead loops back to a second candidate of its own starting cell, or
            to a cell in the same unit as its start, forcing a contradiction, the starting candidate itself is eliminated.
        </p>
        <h2>Worked example</h2>
        <TechniqueExampleBoard example={example}>
            Assuming r4c7 is 9 forces r6c7 to 1, then r9c7 to 5, then r2c7 to 9 — which cannot be, since r2c7 and r4c7 share column 7 and
            cannot both be 9. The solver eliminates 9 from r4c7 itself.
        </TechniqueExampleBoard>
        <p>
            Column 7’s only two candidates for 1 are r4c7 and r6c7, a strong link. r9c7 is bivalue at 1 and 5. Column 7’s only two
            candidates for 5 are r2c7 and r9c7, another strong link. r2c7 is bivalue at 5 and 9.
        </p>
        <p>
            Suppose r4c7 is 9. Then r4c7 is not 1, so the strong link on 1 forces r6c7 to be 1. r6c7 and r9c7 share column 7, so r9c7 cannot
            be 1 either; since r9c7 only has 1 and 5 as candidates, it must be 5. r9c7 being 5 means r2c7, its strong-link partner on 5, is
            no longer needed to hold 5, so r2c7 is left with its other candidate and must be 9. But r2c7 and r4c7 also share column 7, and a
            column cannot hold the same digit twice — r4c7 was already assumed to be 9. The chain contradicts its own starting assumption,
            so r4c7 cannot be 9 after all. The solver removes it and leaves 1 and 4 behind.
        </p>
        <h2>How to spot an AIC</h2>
        <HowTo name="How to spot an AIC in Sudoku">
            <HowToStep name="List strong and weak links freely">
                For any digit and any cell, note bivalue cell links and unit strong links the same way as for simpler chains, without
                restricting to one digit.
            </HowToStep>
            <HowToStep name="Alternate strong and weak links across digits">
                Build a path where the link type alternates, allowing the active digit to change from one link to the next as the chain
                moves through a cell.
            </HowToStep>
            <HowToStep name="Check for a shared peer or a loop">
                See whether the chain’s two ends share a peer for the elimination to land on, or whether the chain loops back to contradict
                its own start.
            </HowToStep>
            <HowToStep name="Apply the matching elimination rule">
                Erase the shared candidate from a common peer, or eliminate the starting candidate outright if the chain contradicts itself.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Breaking the strong-weak alternation. Two strong links or two weak links in a row do not carry the same guarantee as a
                proper alternation.
            </li>
            <li>
                Forgetting that a cell link is only strong when the cell is bivalue. A three-candidate cell only gives a weak link between
                any two of its candidates.
            </li>
            <li>
                Missing the self-contradiction ending. A chain that loops back to the start does not need a separate target cell; it
                eliminates its own first candidate.
            </li>
            <li>
                Assuming an AIC always tracks one digit. Switching digits mid-chain, through bivalue cell links, is exactly what separates
                an AIC from an X-Chain.
            </li>
        </ul>
        <h2>AIC FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Is an X-Chain a special case of an AIC?</FaqQuestion>
                <FaqAnswer>
                    Yes. An X-Chain is an AIC restricted to unit links on a single digit, with no cell links switching the active digit
                    along the way.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is simple coloring a special case of an AIC too?</FaqQuestion>
                <FaqAnswer>
                    Yes. Coloring is an AIC restricted to strong links only, which is why an AIC can find eliminations a coloring network on
                    its own would miss.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why does the worked example eliminate a candidate from a cell inside the chain?</FaqQuestion>
                <FaqAnswer>
                    Because the chain loops back to contradict its own starting assumption rather than reaching an outside peer. That
                    self-contradiction is enough to rule the starting candidate out directly.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is an AIC the hardest technique on this list?</FaqQuestion>
                <FaqAnswer>
                    It is the most general. Because it subsumes the fish, wing, and simpler chain patterns, an AIC search can find
                    eliminations that no single one of the earlier named techniques can reach on its own, which is why it sits last here.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation previous={simpleColoringPageMetadata} />
    </main>
);

export default AICPage;
