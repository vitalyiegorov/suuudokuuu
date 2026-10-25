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
import { simpleColoringPageMetadata } from '../simple-coloring/metadata';
import { skyscraperPageMetadata } from '../skyscraper/metadata';
import { twoStringKitePageMetadata } from '../two-string-kite/metadata';
import { xChainPageMetadata } from '../x-chain/metadata';

import { turbotFishPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(turbotFishPageMetadata);

const EXAMPLE_BOARD = '.2...9.1..6.8.4..9.7..23.....536..4..1...5...6....7.3.236..14..1.....9.3.5...61..';

const TurbotFishPage = () => (
    <main>
        <TechniquePageHeader metadata={turbotFishPageMetadata} />
        <p>
            A Turbot Fish is a four-cell chain on one digit: a strong link, a weak link, and a second strong link, where each strong link
            can come from a row, a column or a box. One end of the chain always holds the digit, so any cell that sees both ends cannot.
        </p>
        <TechniqueSummary>
            <p>
                Find two units where a digit has exactly two candidates, with one candidate of each seeing the other. The two remaining
                candidates are the chain’s ends; one of them holds the digit, so erase it from every cell that sees both.
            </p>
        </TechniqueSummary>
        <h2>How Suuudokuuu finds a Turbot Fish</h2>
        <p>
            The Turbot Fish is the shortest <Link href={xChainPageMetadata.path}>X-Chain</Link> there is, and Suuudokuuu finds it with the
            X-Chain detector rather than a detector of its own. That detector searches shortest chains first, so four-cell chains like this
            one are what it reaches for before anything longer, and the hint and the solver report them as X-Chains. The{' '}
            <Link href={skyscraperPageMetadata.path}>Skyscraper</Link> and the{' '}
            <Link href={twoStringKitePageMetadata.path}>2-String Kite</Link> are the two best-known Turbot Fish shapes; the example below is
            neither, because one of its strong links lives in a box.
        </p>
        <p>
            The logic does not care which kind of unit each link uses. A strong link only says that if one cell is not the digit, the other
            is. The weak link says the two middle cells cannot both be the digit. Chain them and one end is always forced: if the first end
            is empty of the digit, the strong link puts it in the second cell, the weak link clears the third, and the second strong link
            puts it in the fourth.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.XChain}>
            A position from a Hard puzzle in the rated sample. On 9, row 3 holds only r3c1 and r3c3, box 7 holds only r9c1 and r9c3, and
            r3c3 and r9c3 share column 3. One of the ends r3c1 and r9c1 is 9, so r4c1 and r5c1 cannot be.
        </TechniqueWorkedExample>
        <p>
            The first strong link is row 3, where 9 fits only r3c1 and r3c3. The weak link runs down column 3 from r3c3 to r9c3. The second
            strong link is box 7, where 9 fits only r9c3 and r9c1 — r9c3 and r9c1 also share row 9, but it is the box that confines the
            digit to those two cells. The chain’s ends, r3c1 and r9c1, both sit in column 1, so every other cell of column 1 that still
            carries 9 loses it: r4c1 and r5c1.
        </p>
        <h2>How to spot a Turbot Fish</h2>
        <HowTo name="How to spot a Turbot Fish in Sudoku">
            <HowToStep name="List the strong links for one digit">
                For one digit, mark every row, column and box where it has exactly two candidates.
            </HowToStep>
            <HowToStep name="Join two strong links with a weak link">
                Find two of those links where a cell of one sees a cell of the other through a shared row, column or box.
            </HowToStep>
            <HowToStep name="Erase the digit from cells seeing both ends">
                The two cells left over are the chain’s ends. Remove the digit from every cell, outside the chain, that sees both.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>Ignoring box links. A box with only two candidates for the digit is as good a strong link as a row or a column.</li>
            <li>Joining two strong links that share a cell. Then there is no weak link in the middle, only one longer strong chain.</li>
            <li>Forgetting the cells in the ends’ own unit. When both ends share a line, the whole rest of that line is cleared.</li>
        </ul>
        <p>
            Long runs of strong links alone are handled by <Link href={simpleColoringPageMetadata.path}>Simple Coloring</Link>, and longer
            alternating chains by the X-Chain itself. Every pattern the engine implements is on the{' '}
            <Link href={techniquesPageMetadata.path}>technique index</Link>.
        </p>
        <FaqPage>
            <FaqHeading>Turbot Fish FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is a Turbot Fish a fish?</FaqQuestion>
                <FaqAnswer>
                    Not in the X-Wing sense. It is a four-cell single-digit chain; the name is historical. Suuudokuuu’s engine finds it as
                    an X-Chain.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How is a Turbot Fish related to the Skyscraper and the 2-String Kite?</FaqQuestion>
                <FaqAnswer>
                    Both are Turbot Fish. The Skyscraper uses two parallel lines, the 2-String Kite a row and a column joined in a box, and
                    the general Turbot Fish allows any unit for each link.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default TurbotFishPage;
