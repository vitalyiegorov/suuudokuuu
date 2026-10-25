import Link from 'next/link';

import { FamousPuzzleBoard } from '../../../../hardest/components/famous-puzzle-board/famous-puzzle-board';
import { FamousPuzzlePageHeader } from '../../../../hardest/components/famous-puzzle-page-header/famous-puzzle-page-header';
import { FamousPuzzleWalkthrough } from '../../../../hardest/components/famous-puzzle-walkthrough/famous-puzzle-walkthrough';
import { PLATINUM_BLONDE } from '../../../../hardest/constants/famous-puzzle.constant';
import { FaqAnswer } from '../../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../../seo/components/faq/faq';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { infinitySudokuPageMetadata } from '../../sudoku/infinity/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../metadata';

import { platinumBlondePageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(platinumBlondePageMetadata);

const PlatinumBlondePage = () => (
    <main>
        <FamousPuzzlePageHeader metadata={platinumBlondePageMetadata} />
        <p>
            Platinum Blonde is a 21-clue sudoku built specifically to push the Sudoku Explainer scale, and it is commonly rated around SE
            10.9 — above AI Escargot, below Everest and Golden Nugget. Its givens run in a band from the top-right corner to the
            bottom-left, so the opening looks deceptively open. Play it below, print it, or read the engine’s solution.
        </p>
        <FamousPuzzleBoard puzzle={PLATINUM_BLONDE}>Platinum Blonde, 21 givens, as published.</FamousPuzzleBoard>
        <h2>Where Platinum Blonde comes from</h2>
        <p>
            Platinum Blonde comes from the era when solvers raced to find grids that defeated every named technique. Rather than being
            designed around a pattern a human would recognise, it was found by searching for resistance to logic, and the difficulty only
            shows once ordinary subsets and fish run out and the solve has to fall back on chains and nets that span the whole board.
        </p>
        <p>
            Source: <a href="https://groups.google.com/g/sci.math/c/HXZfuNub7Cs">sci.math, “Platinum Blonde”</a>. The SE figure is the
            published rating the Infinity corpus carries, not a Suuudokuuu measurement. The other record grids are on the{' '}
            <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> page.
        </p>
        <h2>The Platinum Blonde solution, step by step</h2>
        <FamousPuzzleWalkthrough puzzle={PLATINUM_BLONDE} />
        <FaqPage>
            <FaqHeading>Platinum Blonde sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>How hard is Platinum Blonde?</FaqQuestion>
                <FaqAnswer>
                    It is commonly rated around SE 10.9, which puts it among the hardest puzzles ever published, between AI Escargot and
                    Everest.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I play Platinum Blonde in the app?</FaqQuestion>
                <FaqAnswer>
                    Yes. Use the play-in-app button above, or play the <Link href={infinitySudokuPageMetadata.path}>Infinity tier</Link>,
                    which serves it with the other record puzzles.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default PlatinumBlondePage;
