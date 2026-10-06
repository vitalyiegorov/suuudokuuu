import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import Link from 'next/link';

import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { HowToStep } from '../../../seo/components/how-to-step/how-to-step';
import { HowTo } from '../../../seo/components/how-to/how-to';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueNavigation } from '../../../techniques/components/technique-navigation/technique-navigation';
import { TechniquePageHeader } from '../../../techniques/components/technique-page-header/technique-page-header';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { TechniqueWorkedExample } from '../../../techniques/components/technique-worked-example/technique-worked-example';
import { nishioForcingChainPageMetadata } from '../nishio-forcing-chain/metadata';
import { regionForcingChainPageMetadata } from '../region-forcing-chain/metadata';

import { cellForcingChainPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(cellForcingChainPageMetadata);

const EXAMPLE_BOARD = '2..5..619.9..12.3...1..9..44..9..7...5..4..8...7..1..6...1..3...2..7..9...8.93..5';

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const CellForcingChainPage = () => (
    <main>
        <TechniquePageHeader metadata={cellForcingChainPageMetadata} />
        <p>
            A cell forcing chain is a case split on one cell: try each of its candidates in turn, follow the singles each choice forces, and
            keep any placement or elimination that every branch reaches, because one of those candidates has to be the cell’s real value.
        </p>
        <TechniqueSummary>
            <p>
                Choose a cell with two or three candidates. For each candidate, assume it and follow the naked and hidden singles that
                result. Anything that happens in every branch — a digit placed, or a candidate removed — is true in the real solution.
            </p>
        </TechniqueSummary>
        <h2>When a cell forcing chain applies</h2>
        <p>
            A <Link href={nishioForcingChainPageMetadata.path}>Nishio forcing chain</Link> needs its assumption to fail, and many
            assumptions never do. A cell forcing chain asks for something different. A cell has to hold one of its candidates, so if every
            candidate leads to the same consequence, that consequence is guaranteed, and it does not matter which candidate is the true one.
        </p>
        <p>
            The method is the same branch-following used by every forcing chain. Assume the first candidate and apply naked and hidden
            singles until nothing more follows. Do the same, starting from a clean board, for each of the other candidates. Then compare the
            branches. If one cell received the same digit in every branch, place it. If one candidate disappeared from a cell in every
            branch — because that cell was filled with something else, or because a peer took the digit — erase it.
        </p>
        <p>
            Bivalue cells are the natural starting point, because two branches are much easier to keep track of than four. Suuudokuuu’s
            solver only reports a cell forcing chain when every branch stays consistent and the branches touch at least four cells.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.CellForcingChain}>
            r1c3 is either 3 or 4. If it is 3, r1c5 becomes 8; if it is 4, r2c4 becomes 4. Either way r2c4 cannot be 8, so the solver erases
            8 from r2c4.
        </TechniqueWorkedExample>
        <p>
            r1c3 holds only 3 and 4, so split on it. In the first branch r1c3 is 3. r1c5, which held 3 and 8, loses its 3 and becomes 8. The
            branch also forces r8c1 to 3, because with column 3 taken the bottom-left box has no other place for it. That placement plays no
            part in the conclusion, but the solver records every cell a branch fills, so r8c1 is highlighted too.
        </p>
        <p>
            In the second branch r1c3 is 4. Row 2 can only take a 4 in r2c3 or r2c4, and r2c3 shares the top-left box with r1c3, so r2c4
            must be 4. Now compare the two branches at r2c4. In the first it sits in the same box as the 8 in r1c5, so it cannot be 8. In
            the second it is filled with 4, so it is not 8 either. Both branches agree, and r2c4 loses the 8 for good, leaving 4, 6 and 7.
        </p>
        <h2>How to use a cell forcing chain</h2>
        <HowTo name="How to use a cell forcing chain in Sudoku">
            <HowToStep name="Pick a cell with few candidates">
                Start with a bivalue cell, or a three-candidate cell if no pair gives a result. Fewer branches mean less to track.
            </HowToStep>
            <HowToStep name="Follow each branch separately">
                For every candidate, assume it on a clean board and record each naked and hidden single it forces.
            </HowToStep>
            <HowToStep name="Compare the branches">
                Look for a cell that gets the same digit in every branch, or a candidate that disappears from a cell in every branch.
            </HowToStep>
            <HowToStep name="Apply only the shared result">
                Place the common digit or erase the common candidate. Everything else from the branches is thrown away.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Skipping a candidate. A conclusion only holds if every candidate of the cell was followed; leaving one out turns the
                argument into a guess.
            </li>
            <li>
                Letting branches leak into each other. Each branch starts from the same board, so a placement made in the first branch must
                not be carried into the second.
            </li>
            <li>Keeping results that appear in only one branch. Only what every branch agrees on is proven.</li>
            <li>
                Starting with a four- or five-candidate cell. The work grows with every branch, and short chains are found far more often in
                bivalue cells.
            </li>
        </ul>
        <FaqPage>
            <FaqHeading>Cell forcing chain FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Can a cell forcing chain place a digit?</FaqQuestion>
                <FaqAnswer>
                    Yes. If every branch puts the same digit in the same cell, that digit is placed. The worked example here shows the other
                    outcome, an elimination.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What happens if one branch reaches a contradiction?</FaqQuestion>
                <FaqAnswer>
                    Then that candidate is simply false, which is a Nishio forcing chain on its own. Suuudokuuu’s solver leaves that case to
                    the Nishio and only reports cell forcing chains where every branch stays consistent.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How is a cell forcing chain different from a region forcing chain?</FaqQuestion>
                <FaqAnswer>
                    A cell forcing chain splits on the candidates of one cell. A{' '}
                    <Link href={regionForcingChainPageMetadata.path}>region forcing chain</Link> splits on the cells where one digit can go
                    inside a row, column or box.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do I need to write the branches down?</FaqQuestion>
                <FaqAnswer>
                    On paper it helps a great deal. Many solvers mark each branch with a different colour, or work through one branch at a
                    time on a copy of the grid.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={regionForcingChainPageMetadata} previous={nishioForcingChainPageMetadata} />
    </main>
);

export default CellForcingChainPage;
