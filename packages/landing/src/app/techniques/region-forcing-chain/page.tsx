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
import { cellForcingChainPageMetadata } from '../cell-forcing-chain/metadata';
import { hiddenSinglePageMetadata } from '../hidden-single/metadata';

import { regionForcingChainPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(regionForcingChainPageMetadata);

const EXAMPLE_BOARD = '375.9.21.2....13..1........419..572.582..7..1763......8.7..2...9.4....5.6.18...7.';

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const RegionForcingChainPage = () => (
    <main>
        <TechniquePageHeader metadata={regionForcingChainPageMetadata} />
        <p>
            A region forcing chain, also called a unit forcing chain, is a case split on one digit inside one row, column or box: try every
            cell where the digit can still go, follow the singles each choice forces, and keep whatever every branch agrees on.
        </p>
        <TechniqueSummary>
            <p>
                Find a digit with only two or three possible cells in a unit. Assume each cell in turn and follow the naked and hidden
                singles. A placement or elimination that appears in every branch holds in the real solution.
            </p>
        </TechniqueSummary>
        <h2>When a region forcing chain applies</h2>
        <p>
            Every row, column and box must contain each digit exactly once, so a digit that still has two possible cells in a unit is
            guaranteed to land in one of them. That is the same certainty a{' '}
            <Link href={cellForcingChainPageMetadata.path}>cell forcing chain</Link> gets from a cell’s candidates, viewed from the other
            side: instead of asking which digit a cell will hold, it asks which cell a digit will take.
        </p>
        <p>
            The branches work exactly as they do for any forcing chain. Assume the digit in the first possible cell, apply naked and hidden
            singles until nothing more follows, and note every placement. Repeat from a clean board for each other possible cell. Whatever
            every branch shares is proven: a digit placed in the same cell each time, or a candidate removed from the same cell each time.
        </p>
        <p>
            Region splits are often easier to spot than cell splits. A <Link href={hiddenSinglePageMetadata.path}>hidden single</Link> is a
            digit with one possible cell in a unit; a digit with two possible cells is the very next thing to check. Suuudokuuu’s solver
            only reports a region forcing chain when every branch stays consistent and the branches touch at least four cells.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.RegionForcingChain}>
            In row 3, digit 2 can only go in r3c4 or r3c5. Either way, r6c4 and r6c5 end up holding 1 and 2 between them, so the solver
            erases 4 and 9 from r6c4 and 4 and 8 from r6c5.
        </TechniqueWorkedExample>
        <p>
            Row 3 has only two cells that can hold a 2, r3c4 and r3c5, so split on them. In the first branch r3c4 is 2. Column 5 can then
            only take its 2 in r6c5, so r6c5 is 2. The centre box needs a 1, and the only cells that can hold it are r6c4 and r6c5; with
            r6c5 filled, r6c4 must be 1.
        </p>
        <p>
            The second branch is the mirror image. r3c5 is 2, column 4 can then only take its 2 in r6c4, and the centre box’s 1 is pushed
            into r6c5. The two branches disagree about which cell gets which digit, but they agree that r6c4 and r6c5 hold 1 and 2 between
            them. That is enough. r6c4 loses its 4 and 9, r6c5 loses its 4 and 8, and the four highlighted cells are the ones the two
            branches filled.
        </p>
        <h2>How to use a region forcing chain</h2>
        <HowTo name="How to use a region forcing chain in Sudoku">
            <HowToStep name="Find a digit with two or three places in a unit">
                Scan rows, columns and boxes for a digit that is one step away from a hidden single.
            </HowToStep>
            <HowToStep name="Follow each placement separately">
                For each possible cell, assume the digit there on a clean board and record every naked and hidden single it forces.
            </HowToStep>
            <HowToStep name="Compare the branches">
                Look for a placement or a removed candidate that appears in every branch, including combined outcomes like a pair of cells
                that always ends up holding the same two digits.
            </HowToStep>
            <HowToStep name="Apply only the shared result">
                Place the common digit or erase the common candidates, and discard everything else the branches produced.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Forgetting a possible cell. The split is only complete if every cell in the unit that can hold the digit gets its own
                branch.
            </li>
            <li>
                Expecting the branches to agree cell by cell. As the example shows, the shared conclusion can be an elimination even when
                the branches place different digits.
            </li>
            <li>Carrying a placement from one branch into the next. Every branch starts again from the same board.</li>
            <li>
                Splitting on a digit with five or six places. The branches multiply quickly; two or three places keep the work manageable.
            </li>
        </ul>
        <FaqPage>
            <FaqHeading>Region forcing chain FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is a region forcing chain the same as a unit forcing chain?</FaqQuestion>
                <FaqAnswer>Yes. Both names describe a case split on the possible cells of one digit inside a row, column or box.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can a region forcing chain place a digit?</FaqQuestion>
                <FaqAnswer>
                    Yes. If every branch fills the same cell with the same digit, that digit is placed. The worked example shows an
                    elimination instead.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Should I try a cell forcing chain or a region forcing chain first?</FaqQuestion>
                <FaqAnswer>
                    Whichever split has fewer branches. Suuudokuuu’s solver tries cell forcing chains first and region forcing chains last,
                    which is why this page closes the technique list.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is this the hardest technique Suuudokuuu uses?</FaqQuestion>
                <FaqAnswer>
                    It is the last one the solver tries. Some record puzzles need longer forcing nets than any of these chains can reach,
                    and on those boards the solver stops and says so instead of guessing.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation previous={cellForcingChainPageMetadata} />
    </main>
);

export default RegionForcingChainPage;
