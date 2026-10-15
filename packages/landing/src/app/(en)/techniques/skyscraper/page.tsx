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
import { turbotFishPageMetadata } from '../turbot-fish/metadata';
import { twoStringKitePageMetadata } from '../two-string-kite/metadata';
import { xChainPageMetadata } from '../x-chain/metadata';
import { xWingPageMetadata } from '../x-wing/metadata';

import { skyscraperPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(skyscraperPageMetadata);

const EXAMPLE_BOARD = '.2...9.1....8.4..9.7..23.....536..4..1...5...6....7.3.2.6..14..1.....9.3.5...61..';

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const SkyscraperPage = () => (
    <main>
        <TechniquePageHeader metadata={skyscraperPageMetadata} />
        <p>
            A Skyscraper is a single-digit pattern made of two strong links in parallel rows, or in parallel columns, whose bottom ends
            share a line: one of the two top ends, the roofs, must hold the digit, so any cell that sees both roofs cannot.
        </p>
        <TechniqueSummary>
            <p>
                Find a digit with exactly two candidates in each of two rows, where one candidate from each row sits in the same column. The
                other two candidates are the roofs. One roof always holds the digit, so erase it from every cell that sees both.
            </p>
        </TechniqueSummary>
        <h2>How Suuudokuuu finds a Skyscraper</h2>
        <p>
            Suuudokuuu’s engine has no separate Skyscraper detector, and this page will not pretend it does. A Skyscraper is the shortest
            possible <Link href={xChainPageMetadata.path}>X-Chain</Link>: strong link, weak link, strong link, four cells on one digit. The
            X-Chain detector searches shortest chains first, so a Skyscraper, at four cells, is among the first chains it can report, and
            the hint and the step-by-step solver label it X-Chain. The name is worth learning anyway, because the shape is far easier to
            spot by eye than a general chain.
        </p>
        <p>
            The logic is the X-Chain’s. In each of the two rows the digit has exactly two cells, so if one is false the other is true — that
            is a strong link. The two base cells share a column, so they cannot both hold the digit — that is a weak link. Follow it from
            either roof: if the first roof is not the digit, its partner in the row is, which rules out the base cell below it, which forces
            the second roof. Either way, one roof holds the digit.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.XChain}>
            A position from a Hard puzzle in the rated sample. On 9, row 3 and row 4 each have two candidates, and r3c1 and r4c1 share
            column 1. The roofs r3c3 and r4c2 cannot both be empty of 9, so 9 is erased from r5c3 and r6c3.
        </TechniqueWorkedExample>
        <p>
            Row 3 holds 9 only in r3c1 and r3c3, and row 4 only in r4c1 and r4c2. Those are the two floors of the Skyscraper. The base cells
            r3c1 and r4c1 stand in the same column, so at most one of them is 9, which means at least one of the roofs, r3c3 or r4c2, is 9.
            r5c3 and r6c3 sit in column 3 with r3c3 and in box 4 with r4c2, so they see both roofs and lose 9.
        </p>
        <h2>How to spot a Skyscraper</h2>
        <HowTo name="How to spot a Skyscraper in Sudoku">
            <HowToStep name="Pick a digit and find two-candidate lines">
                For one digit, look for rows, or columns, where it has exactly two candidates. Each is a strong link.
            </HowToStep>
            <HowToStep name="Line up the bases">
                Find two such rows where one candidate from each sits in the same column. Those two cells are the base of the Skyscraper.
            </HowToStep>
            <HowToStep name="Mark the roofs">
                The remaining candidate in each row is a roof. The roofs must not share a column, or the pattern is an X-Wing instead.
            </HowToStep>
            <HowToStep name="Erase the digit where both roofs are seen">
                Remove the digit from every cell that sees both roofs, through a row, a column or a box.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>Using a row with three candidates for the digit. The pattern needs strong links, so each line must hold exactly two.</li>
            <li>
                Lining the roofs up as well as the bases. Four candidates in two columns is an{' '}
                <Link href={xWingPageMetadata.path}>X-Wing</Link>, which eliminates along the columns instead.
            </li>
            <li>Erasing the digit from a base cell. The bases are part of the chain; only cells that see both roofs are cleared.</li>
        </ul>
        <p>
            The Skyscraper has two close relatives: the <Link href={twoStringKitePageMetadata.path}>2-String Kite</Link> joins a row link to
            a column link through a box, and the <Link href={turbotFishPageMetadata.path}>Turbot Fish</Link> is the general four-cell chain
            that both are special cases of. Every pattern the engine implements is listed on the{' '}
            <Link href={techniquesPageMetadata.path}>technique index</Link>.
        </p>
        <FaqPage>
            <FaqHeading>Skyscraper FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is a Skyscraper an X-Chain?</FaqQuestion>
                <FaqAnswer>
                    Yes. It is the four-cell X-Chain where both strong links run along parallel rows or columns, which is why Suuudokuuu’s
                    engine reports it as an X-Chain.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What is the difference between a Skyscraper and an X-Wing?</FaqQuestion>
                <FaqAnswer>
                    In an X-Wing both pairs of candidates line up, forming a rectangle. In a Skyscraper only the bases line up and the roofs
                    are offset, so the elimination falls on the cells that see both roofs.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default SkyscraperPage;
