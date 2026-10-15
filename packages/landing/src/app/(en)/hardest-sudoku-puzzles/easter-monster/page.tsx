import Link from 'next/link';

import { FamousPuzzleBoard } from '../../../../hardest/components/famous-puzzle-board/famous-puzzle-board';
import { FamousPuzzlePageHeader } from '../../../../hardest/components/famous-puzzle-page-header/famous-puzzle-page-header';
import { FamousPuzzleWalkthrough } from '../../../../hardest/components/famous-puzzle-walkthrough/famous-puzzle-walkthrough';
import { EASTER_MONSTER } from '../../../../hardest/constants/famous-puzzle.constant';
import { FaqAnswer } from '../../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../../seo/components/faq/faq';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { solverPageMetadata } from '../../solver/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../metadata';

import { easterMonsterPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(easterMonsterPageMetadata);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const EasterMonsterPage = () => (
    <main>
        <FamousPuzzlePageHeader metadata={easterMonsterPageMetadata} />
        <p>
            Easter Monster is a 21-clue sudoku from the solving community’s lists of the hardest known puzzles, famous less for a number
            than for a result: Bob Hanson and Dave Marans published a complete logical solution for it in 2008. Play the grid below, print
            it, or compare their human solution with the engine’s walkthrough further down.
        </p>
        <FamousPuzzleBoard puzzle={EASTER_MONSTER}>Easter Monster as published by Hanson and Marans (2008), 21 givens.</FamousPuzzleBoard>
        <h2>Where Easter Monster comes from</h2>
        <p>
            Its givens form an almost symmetrical pattern, and that symmetry is what made a human-sized proof possible at all. SudokuOne
            calls it perhaps the most difficult sudoku ever solved without a computer solver. We found no published SE figure we can
            attribute to a source, so this page quotes none, and Easter Monster is not in the Suuudokuuu Infinity corpus, which only takes
            puzzles with a published rating.
        </p>
        <p>
            Sources: <a href="https://www.stolaf.edu/people/hansonr/sudoku/easter_monster.htm">Hanson and Marans, “Easter Monster”</a> and{' '}
            <a href="https://www.sudokuone.com/sweb/extra/easter/a_em.htm">SudokuOne, “A General Sudoku Logic”</a>. The other record grids
            are on the <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> page.
        </p>
        <h2>The Easter Monster solution, step by step</h2>
        <FamousPuzzleWalkthrough puzzle={EASTER_MONSTER} />
        <p>
            The engine’s route is not Hanson and Marans’ route. Theirs is one long, hand-built argument that exploits the symmetry; the
            engine has no notion of symmetry and grinds forward one cheapest step at a time. Replay any of its steps in the{' '}
            <Link href={solverPageMetadata.path}>step-by-step solver</Link> to see it on a live board.
        </p>
        <FaqPage>
            <FaqHeading>Easter Monster sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Has Easter Monster been solved without a computer?</FaqQuestion>
                <FaqAnswer>
                    Yes. Bob Hanson and Dave Marans published a complete logical solution in 2008, and it is the best-known human solution
                    of any record puzzle.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What is the SE rating of Easter Monster?</FaqQuestion>
                <FaqAnswer>
                    We found no published figure we can attribute to a source, so we quote none. Suuudokuuu’s own rater reports it at its
                    ceiling, which means harder than every technique the engine implements.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default EasterMonsterPage;
