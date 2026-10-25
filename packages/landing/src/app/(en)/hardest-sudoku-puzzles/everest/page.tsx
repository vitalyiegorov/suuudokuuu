import Link from 'next/link';

import { FamousPuzzleBoard } from '../../../../hardest/components/famous-puzzle-board/famous-puzzle-board';
import { FamousPuzzlePageHeader } from '../../../../hardest/components/famous-puzzle-page-header/famous-puzzle-page-header';
import { FamousPuzzleWalkthrough } from '../../../../hardest/components/famous-puzzle-walkthrough/famous-puzzle-walkthrough';
import { EVEREST } from '../../../../hardest/constants/famous-puzzle.constant';
import { FaqAnswer } from '../../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../../seo/components/faq/faq';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { sudokuDifficultyRatingPageMetadata } from '../../guides/sudoku-difficulty-rating/metadata';
import { infinitySudokuPageMetadata } from '../../sudoku/infinity/metadata';
import { aiEscargotPageMetadata } from '../ai-escargot/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../metadata';

import { everestPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(everestPageMetadata);

const EverestPage = () => (
    <main>
        <FamousPuzzlePageHeader metadata={everestPageMetadata} />
        <p>
            “Everest” is the 21-clue sudoku Arto Inkala published in 2012 as the world’s hardest, the follow-up to his 2006{' '}
            <Link href={aiEscargotPageMetadata.path}>AI Escargot</Link>. The nickname comes from the solving community, and it stuck because
            the puzzle sits at the very top of the difficulty scale. Play the original grid below, print it, or read the engine’s
            step-by-step solution further down.
        </p>
        <FamousPuzzleBoard puzzle={EVEREST}>Arto Inkala’s “Everest” (2012), 21 givens, as published.</FamousPuzzleBoard>
        <h2>Where Everest comes from</h2>
        <p>
            Inkala presented the puzzle as harder than AI Escargot, and it was widely reprinted as the hardest sudoku ever made. Independent
            raters agree it is a big step up: Sudoku Explainer style tools place it around SE 11.9, against roughly 10.6 for AI Escargot,
            which puts it level with Golden Nugget at the top of the scale the{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>difficulty rating guide</Link> explains. At this height different rating
            programs disagree by several tenths, depending on which chain types they model.
        </p>
        <p>
            Source: <a href="https://www.sudokuwiki.org/Arto_Inkala_Sudoku">SudokuWiki, “Arto Inkala Sudoku”</a>. The rating is the
            published figure the Infinity corpus carries, not a Suuudokuuu measurement; see the{' '}
            <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> page for the other record grids.
        </p>
        <h2>The Everest solution, step by step</h2>
        <FamousPuzzleWalkthrough puzzle={EVEREST} />
        <FaqPage>
            <FaqHeading>Everest sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is Everest the hardest sudoku in the world?</FaqQuestion>
                <FaqAnswer>
                    It is one of a handful of puzzles at the top of the SE scale, around 11.9. Raters disagree on the exact order at that
                    height, so no single puzzle holds the title outright.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I play Everest in the Suuudokuuu app?</FaqQuestion>
                <FaqAnswer>
                    Yes. Use the play-in-app button above, or start an <Link href={infinitySudokuPageMetadata.path}>Infinity</Link> game,
                    which serves Everest among the other record puzzles, reshuffled so it looks new each time.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default EverestPage;
