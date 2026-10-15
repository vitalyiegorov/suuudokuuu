import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import Link from 'next/link';

import { FaqAnswer } from '../../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../../seo/components/faq/faq';
import { HowToStep } from '../../../../seo/components/how-to-step/how-to-step';
import { HowTo } from '../../../../seo/components/how-to/how-to';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { TechniquePageHeader } from '../../../../techniques/components/technique-page-header/technique-page-header';
import { TechniqueSummary } from '../../../../techniques/components/technique-summary/technique-summary';
import { TechniqueWorkedExample } from '../../../../techniques/components/technique-worked-example/technique-worked-example';
import { techniquesPageMetadata } from '../metadata';
import { nakedPairPageMetadata } from '../naked-pair/metadata';
import { xyChainPageMetadata } from '../xy-chain/metadata';
import { xyWingPageMetadata } from '../xy-wing/metadata';

import { remotePairPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(remotePairPageMetadata);

const EXAMPLE_BOARD = '79541..3.418...7.9623798.54.719....33.4.759.19.21...7...6.49317139..72...473.1.95';

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const RemotePairPage = () => (
    <main>
        <TechniquePageHeader metadata={remotePairPageMetadata} />
        <p>
            A Remote Pair is a chain of an even number of cells, each holding the same two candidates and each seeing the next: the digits
            alternate along the chain, so its two ends always take opposite digits, and any cell that sees both ends can hold neither.
        </p>
        <TechniqueSummary>
            <p>
                Find bivalue cells that all carry the same pair, linked cell to cell through shared rows, columns or boxes. If the chain has
                an even number of cells, its ends hold one digit each, so both digits can be erased from every cell that sees both ends.
            </p>
        </TechniqueSummary>
        <h2>How Suuudokuuu finds a Remote Pair</h2>
        <p>
            Suuudokuuu’s engine has no Remote Pair detector. A Remote Pair is an <Link href={xyChainPageMetadata.path}>XY-Chain</Link> in
            which every cell happens to hold the same two digits, and the XY-Chain detector finds it and reports it under that name. One
            difference is worth knowing: an XY-Chain proves one digit at a time, so the engine reports the elimination of one of the pair’s
            digits per chain. The Remote Pair argument removes both, and the second set of eliminations is the same chain read in the
            opposite direction.
        </p>
        <p>
            The logic is a row of <Link href={nakedPairPageMetadata.path}>naked pairs</Link> stretched across the board. Each cell is one
            digit or the other; two neighbours in the chain see each other, so they cannot be the same digit. Along the chain the digits
            therefore alternate, and with an even number of cells the first and last cells end up with different digits — together they use
            both. A cell that sees both ends sees both digits.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.XYChain}>
            A position from a Hard puzzle in the rated sample. r1c7, r9c7, r8c9 and r6c9 all hold exactly 6 and 8, each seeing the next. The
            ends r1c7 and r6c9 take opposite digits, and the engine erases 6 from r1c9, r4c7 and r6c7, the cells that see both.
        </TechniqueWorkedExample>
        <p>
            The chain runs from r1c7 down column 7 to r9c7, across box 9 to r8c9, and up column 9 to r6c9: four cells, every one of them
            holding 6 and 8 and nothing else. Whichever digit r1c7 takes, r9c7 takes the other, r8c9 the first again and r6c9 the other, so
            the two ends hold one 6 and one 8 between them.
        </p>
        <p>
            r1c9 shares row 1 with r1c7 and column 9 with r6c9; r4c7 and r6c7 share column 7 with r1c7 and box 6 with r6c9. All three see
            both ends, so none of them can be 6 — which is what the engine reports — and by the same argument none of them can be 8 either.
            r1c9 was carrying 2, 6 and 8, so the full Remote Pair leaves it a single.
        </p>
        <h2>How to spot a Remote Pair</h2>
        <HowTo name="How to spot a Remote Pair in Sudoku">
            <HowToStep name="Collect cells with the same pair">
                Look for bivalue cells that carry exactly the same two candidates, such as several cells holding only 6 and 8.
            </HowToStep>
            <HowToStep name="Link them into a chain">
                Connect cells that see each other through a row, column or box into a single path.
            </HowToStep>
            <HowToStep name="Count the cells">
                With an even number of cells the ends hold opposite digits. With an odd number they hold the same digit, and the pattern
                does not apply.
            </HowToStep>
            <HowToStep name="Erase both digits where both ends are seen">
                Remove both digits of the pair from every cell outside the chain that sees both ends.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>Using an odd-length chain. Three or five cells leave the ends with the same digit, so nothing can be erased.</li>
            <li>Including a cell with a third candidate. Every link needs a cell that is exactly one of the two digits.</li>
            <li>Stopping at one digit. The pattern removes both digits of the pair from the cells that see both ends.</li>
        </ul>
        <p>
            With three cells and three different digits the same idea becomes an <Link href={xyWingPageMetadata.path}>XY-Wing</Link>. Every
            pattern the engine implements is on the <Link href={techniquesPageMetadata.path}>technique index</Link>.
        </p>
        <FaqPage>
            <FaqHeading>Remote Pair FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is a Remote Pair an XY-Chain?</FaqQuestion>
                <FaqAnswer>
                    Yes. It is the XY-Chain whose cells all share one pair of digits, and Suuudokuuu’s engine reports it as an XY-Chain.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why does the engine only remove one digit?</FaqQuestion>
                <FaqAnswer>
                    An XY-Chain proves one digit per chain. The second digit’s eliminations follow from the same cells read the other way,
                    and the engine finds them on a later step if they are still needed.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default RemotePairPage;
