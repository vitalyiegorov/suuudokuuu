import Link from 'next/link';

import { FamousPuzzleBoard } from '../../../../hardest/components/famous-puzzle-board/famous-puzzle-board';
import { FamousPuzzlePageHeader } from '../../../../hardest/components/famous-puzzle-page-header/famous-puzzle-page-header';
import { FamousPuzzleWalkthrough } from '../../../../hardest/components/famous-puzzle-walkthrough/famous-puzzle-walkthrough';
import { AI_ESCARGOT } from '../../../../hardest/constants/famous-puzzle.constant';
import { FaqAnswer } from '../../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../../seo/components/faq/faq';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { solverPageMetadata } from '../../solver/metadata';
import { infinitySudokuPageMetadata } from '../../sudoku/infinity/metadata';
import { nishioForcingChainPageMetadata } from '../../techniques/nishio-forcing-chain/metadata';
import { everestPageMetadata } from '../everest/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../metadata';

import { aiEscargotPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(aiEscargotPageMetadata);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const AiEscargotPage = () => (
    <main>
        <FamousPuzzlePageHeader metadata={aiEscargotPageMetadata} />
        <p>
            AI Escargot is a 23-clue sudoku that Finnish mathematician Arto Inkala published in 2006 and presented as the most difficult
            sudoku in the world. It is the puzzle most people find first when they search for the hardest sudoku ever made, and you can play
            it right here: the board below is the original grid, playable in your browser, printable, and solved step by step further down
            the page.
        </p>
        <FamousPuzzleBoard puzzle={AI_ESCARGOT}>AI Escargot by Arto Inkala (2006), 23 givens, as published.</FamousPuzzleBoard>
        <h2>Where AI Escargot comes from</h2>
        <p>
            The name pairs Inkala’s initials, AI, with escargot, the French word for snail. Inkala presented the grid as the hardest sudoku
            he knew of, the press repeated the claim in late 2006, and it became the reference “hardest sudoku” that solvers have studied
            more than almost any other grid.
        </p>
        <p>
            It has since been overtaken. Rating tools in the Sudoku Explainer tradition put AI Escargot around SE 10.6, while later puzzles,
            including Inkala’s own 2010 <Link href={everestPageMetadata.path}>Everest</Link>, sit at the top of the scale near 11.9. It
            remains the classic first attempt for anyone who wants to feel what a record puzzle is like.
        </p>
        <p>
            Source: <a href="https://www.sudokuwiki.org/Escargot">SudokuWiki, “AI Escargot”</a>. The rating is the published figure the
            Infinity corpus carries, not a Suuudokuuu measurement; the full background on every record grid is on the{' '}
            <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> page.
        </p>
        <h2>The AI Escargot solution, step by step</h2>
        <FamousPuzzleWalkthrough puzzle={AI_ESCARGOT} />
        <p>
            The forcing chains are the heart of it. A <Link href={nishioForcingChainPageMetadata.path}>Nishio forcing chain</Link> supposes
            one candidate is true and follows the singles it forces until a cell runs out of candidates, which proves the supposition false.
            To check any single step yourself, paste the grid into the <Link href={solverPageMetadata.path}>step-by-step solver</Link> and
            replay it on a live board.
        </p>
        <FaqPage>
            <FaqHeading>AI Escargot FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Can I play AI Escargot online?</FaqQuestion>
                <FaqAnswer>
                    Yes. Press Play this puzzle here on the board above to solve it in the browser, or open it in the free Suuudokuuu app,
                    which also serves it in the <Link href={infinitySudokuPageMetadata.path}>Infinity tier</Link>.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is AI Escargot the hardest sudoku in the world?</FaqQuestion>
                <FaqAnswer>
                    It was presented as the hardest in 2006. Independent raters now place several later puzzles higher on the SE scale,
                    including Everest, Golden Nugget and Platinum Blonde.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does AI Escargot have a unique solution?</FaqQuestion>
                <FaqAnswer>Yes. Suuudokuuu checks it with two independent solvers, and both find exactly one completed grid.</FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default AiEscargotPage;
