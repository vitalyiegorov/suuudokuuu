import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { HowTo } from '../../../seo/components/how-to/how-to';
import { HowToStep } from '../../../seo/components/how-to-step/how-to-step';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueNavigation } from '../../../techniques/components/technique-navigation/technique-navigation';
import { TechniquePageHeader } from '../../../techniques/components/technique-page-header/technique-page-header';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { TechniqueWorkedExample } from '../../../techniques/components/technique-worked-example/technique-worked-example';
import { wWingPageMetadata } from '../w-wing/metadata';
import { xyChainPageMetadata } from '../xy-chain/metadata';

import { xChainPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(xChainPageMetadata);

const EXAMPLE_BOARD = '953168742862734.51417..28367.6..3.252.164..973.527..68.38.2.674.7438.2.96294.7..3';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const XChainPage = () => (
    <main>
        <TechniquePageHeader metadata={xChainPageMetadata} />
        <p>
            An X-Chain follows one digit through a sequence of alternating strong and weak links, cell to cell, until both ends of the chain
            reach a cell that can see them both, which lets that candidate be erased there.
        </p>
        <TechniqueSummary>
            <p>
                Follow one digit’s strong links — units where it has only two candidate cells — connected end to end by weak links, until
                the chain’s two endpoints share a peer. That peer cannot hold the digit either endpoint would place.
            </p>
        </TechniqueSummary>
        <h2>When an X-Chain applies</h2>
        <p>
            Every earlier technique on this list reasons about one or two units at a time. An X-Chain reasons about a single digit across an
            arbitrary number of units, strung together into a path. A strong link connects two cells when a unit — a row, column or box —
            has the digit in only those two cells: if one is not the digit, the other must be. A weak link connects two cells that merely
            share a unit and both carry the digit as a candidate, without either being forced.
        </p>
        <p>
            A chain alternates strong, weak, strong, weak, and so on, starting and ending on a strong link. That alternation guarantees that
            the chain’s two endpoints cannot both be free of the digit at once: following the links forward from one end forces a value onto
            the other. The practical result is that at least one of the two endpoints holds the digit, even though it is not known which
            one. Any cell — other than the chain’s own cells — that sees both endpoints cannot hold the digit, because whichever endpoint
            turns out true, that cell is a peer of it.
        </p>
        <p>
            Chains are also where a puzzle’s difficulty tends to climb sharply. On the widely used Sudoku-Explainer rating scale, chain
            techniques like this one are typically what push a puzzle’s rating past 7.0 — the point where singles, subsets, fish and wings
            alone are no longer enough.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.XChain}>
            The digit 5 chains from r7c4 through r3c4, r3c5, r9c5 and r8c6 to r8c1. Because r7c1 sees both r7c4 and r8c1, the solver
            eliminates 5 there.
        </TechniqueWorkedExample>
        <p>
            The chain on 5 runs r7c4 → r3c4 → r3c5 → r9c5 → r8c6 → r8c1, alternating strong and weak links along the way: r7c4 and r3c4
            share column 4, r3c4 and r3c5 share row 3, r3c5 and r9c5 share column 5, r9c5 and r8c6 share a box, and r8c6 and r8c1 share row
            8. Because the chain starts and ends on a strong link, r7c4 and r8c1 cannot both be free of 5 — at least one of them holds it.
        </p>
        <p>
            r7c1 sits in row 7 with r7c4 and in column 1 with r8c1, so it sees both ends of the chain. It was carrying 1 and 5 before the
            deduction. Since 5 must land at one end of the chain or the other, r7c1 cannot hold 5 itself, and the solver removes it, leaving
            1 behind.
        </p>
        <h2>How to spot an X-Chain</h2>
        <HowTo name="How to spot an X-Chain in Sudoku">
            <HowToStep name="Pick a digit and map its strong links">
                For one digit, find every unit where it has exactly two candidate cells. Each such unit is a strong link between those two
                cells.
            </HowToStep>
            <HowToStep name="Connect strong links with weak links">
                Join strong links end to end through weak links — cells that merely share a unit and both carry the digit — building a path
                that alternates strong, weak, strong, weak.
            </HowToStep>
            <HowToStep name="Confirm both ends are strong">
                A valid elimination chain must begin and end on a strong link, so at least one endpoint is guaranteed to hold the digit.
            </HowToStep>
            <HowToStep name="Erase the digit from shared peers of both ends">
                Remove the digit from any cell, outside the chain itself, that sees both endpoints.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Ending a chain on a weak link. Without a strong link at both ends, the alternation does not guarantee either endpoint holds
                the digit.
            </li>
            <li>
                Treating any two cells that share a unit as a weak link regardless of candidate count. A weak link still requires both cells
                to carry the digit as a candidate.
            </li>
            <li>
                Eliminating the digit from a cell inside the chain. The chain’s own cells are exactly where the digit is still being
                debated; eliminations only apply outside it.
            </li>
            <li>
                Giving up after checking only short chains. Longer chains are harder to trace by hand but follow the exact same strong-weak
                alternation rule.
            </li>
        </ul>
        <FaqPage>
            <FaqHeading>X-Chain FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>What is the difference between a strong link and a weak link?</FaqQuestion>
                <FaqAnswer>
                    A strong link means a unit has the digit in only two cells, so ruling out one forces the other. A weak link only means
                    two cells share a unit and both carry the digit as a candidate, without either being forced.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can an X-Chain use more than one kind of unit?</FaqQuestion>
                <FaqAnswer>
                    Yes. Each link in the chain can come from a row, a column or a box, as long as the link genuinely confines the digit the
                    way a strong or weak link requires.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How is an X-Chain different from a Simple Coloring chain?</FaqQuestion>
                <FaqAnswer>
                    Simple Coloring only uses strong links, colored in two alternating groups. An X-Chain can also use weak links between
                    strong ones, which lets it reach patterns that pure coloring cannot.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why do chains matter for puzzle difficulty?</FaqQuestion>
                <FaqAnswer>
                    Chains can be arbitrarily long, so they cover deductions that no fixed-size pattern like a fish or a wing can reach.
                    That open-ended reach is why they mark the boundary of the hardest solvable puzzles.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={xyChainPageMetadata} previous={wWingPageMetadata} />
    </main>
);

export default XChainPage;
