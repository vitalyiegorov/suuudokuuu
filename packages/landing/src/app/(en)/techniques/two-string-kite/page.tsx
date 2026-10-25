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
import { skyscraperPageMetadata } from '../skyscraper/metadata';
import { turbotFishPageMetadata } from '../turbot-fish/metadata';
import { xChainPageMetadata } from '../x-chain/metadata';

import { twoStringKitePageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(twoStringKitePageMetadata);

const EXAMPLE_BOARD = '5..73.2....2584.3.37.92..8549385.......3.2549.254.....23.6.5..8.5.14....8412.....';

const TwoStringKitePage = () => (
    <main>
        <TechniquePageHeader metadata={twoStringKitePageMetadata} />
        <p>
            A 2-String Kite is a single-digit pattern made of one strong link in a row and one strong link in a column, with an end of each
            sitting in the same box: one of the two free ends must hold the digit, so the cell where the free ends’ column and row cross
            cannot.
        </p>
        <TechniqueSummary>
            <p>
                Find a digit with exactly two candidates in a row and exactly two in a column, where one candidate of each lies in the same
                box. The other two candidates are the kite’s free ends. Erase the digit from the cell that sees both free ends.
            </p>
        </TechniqueSummary>
        <h2>How Suuudokuuu finds a 2-String Kite</h2>
        <p>
            There is no dedicated 2-String Kite detector in Suuudokuuu’s engine. The kite is a four-cell{' '}
            <Link href={xChainPageMetadata.path}>X-Chain</Link> — strong link along the row, weak link inside the box, strong link along the
            column — and the X-Chain detector, which searches shortest chains first, finds it and reports it under that name. The hint and
            the step-by-step solver will say X-Chain; this page gives the shape its usual name so you can spot it faster.
        </p>
        <p>
            The two strings are the strong links: in the row the digit has only two cells, and in the column only two. The two ends that
            share a box cannot both hold the digit, which is the weak link that ties the strings together. Follow it from either free end:
            if one free end is not the digit, its partner is, which rules out the box partner, which forces the other free end. Either way a
            free end holds the digit.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.XChain}>
            A position from a Hard puzzle in the rated sample. On 9, row 1 holds only r1c3 and r1c8 and column 1 holds only r2c1 and r8c1,
            and r1c3 and r2c1 share box 1. One of the free ends r1c8 and r8c1 is 9, so r8c8 cannot be.
        </TechniqueWorkedExample>
        <p>
            The row string runs from r1c8 to r1c3, the column string from r2c1 to r8c1, and r1c3 and r2c1 are the two ends that meet in box
            1. They cannot both be 9, so at least one of the free ends, r1c8 or r8c1, is 9. r8c8 shares column 8 with r1c8 and row 8 with
            r8c1, so it sees both free ends; it was carrying 2, 6, 7 and 9, and the 9 goes.
        </p>
        <h2>How to spot a 2-String Kite</h2>
        <HowTo name="How to spot a 2-String Kite in Sudoku">
            <HowToStep name="Find a row and a column with two candidates">
                For one digit, look for a row where it has exactly two candidates and a column where it has exactly two.
            </HowToStep>
            <HowToStep name="Check that they meet in a box">
                One candidate from the row and one from the column must sit in the same box, without being the same cell.
            </HowToStep>
            <HowToStep name="Find the crossing cell">
                Take the free end of the row string and the free end of the column string. The cell in the free row end’s column and the
                free column end’s row sees both.
            </HowToStep>
            <HowToStep name="Erase the digit there">
                Remove the digit from that crossing cell. If the box ends are in the same row or column, it is not a kite.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>Accepting a row or column with three candidates. Each string has to be a strong link with exactly two.</li>
            <li>Joining the strings outside a box. The weak link that ties them together is the shared box.</li>
            <li>Looking for eliminations anywhere but the crossing cell. A kite usually removes the digit from exactly one cell.</li>
        </ul>
        <p>
            The <Link href={skyscraperPageMetadata.path}>Skyscraper</Link> uses two parallel lines instead of a row and a column, and the{' '}
            <Link href={turbotFishPageMetadata.path}>Turbot Fish</Link> is the general four-cell chain behind both. Every pattern the engine
            implements is on the <Link href={techniquesPageMetadata.path}>technique index</Link>.
        </p>
        <FaqPage>
            <FaqHeading>2-String Kite FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is a 2-String Kite an X-Chain?</FaqQuestion>
                <FaqAnswer>
                    Yes. It is a four-cell X-Chain whose strong links are a row and a column and whose weak link is a shared box, which is
                    why Suuudokuuu’s engine reports it as an X-Chain.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What will the Suuudokuuu hint call a 2-String Kite?</FaqQuestion>
                <FaqAnswer>
                    X-Chain. The hint names the detector that found the deduction, and the kite is found by the X-Chain detector, so the
                    hint highlights the same four cells under the chain’s name.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default TwoStringKitePage;
