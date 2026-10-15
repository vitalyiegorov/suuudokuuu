import Link from 'next/link';

import { FamousPuzzleBoard } from '../../../../hardest/components/famous-puzzle-board/famous-puzzle-board';
import { FamousPuzzlePageHeader } from '../../../../hardest/components/famous-puzzle-page-header/famous-puzzle-page-header';
import { FamousPuzzleWalkthrough } from '../../../../hardest/components/famous-puzzle-walkthrough/famous-puzzle-walkthrough';
import { KOLK } from '../../../../hardest/constants/famous-puzzle.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { infinitySudokuPageMetadata } from '../../sudoku/infinity/metadata';
import { goldenNuggetPageMetadata } from '../golden-nugget/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../metadata';
import { silverPlatePageMetadata } from '../silver-plate/metadata';

import { kolkPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(kolkPageMetadata);

const KolkPage = () => (
    <main>
        <FamousPuzzlePageHeader metadata={kolkPageMetadata} />
        <p>
            Kolk is a 22-clue sudoku from the Sudoku Players’ Forum list of the hardest known puzzles, where it is rated SE 11.9 — the same
            top-of-scale figure as <Link href={goldenNuggetPageMetadata.path}>Golden Nugget</Link>. It never had the newspaper fame of AI
            Escargot, which makes it a good test of whether a famous name or the grid itself is what makes a puzzle hard. Play it below,
            print it, or follow the engine’s solution.
        </p>
        <FamousPuzzleBoard puzzle={KOLK}>Kolk, 22 givens, as listed on the Sudoku Players’ Forum.</FamousPuzzleBoard>
        <h2>Where Kolk comes from</h2>
        <p>
            The forum’s “hardest sudokus” thread is the long-running list where solvers collect and rate the hardest grids they find, and
            Kolk is one of the named grids on it. Its rating is the forum’s published figure, carried by the Suuudokuuu{' '}
            <Link href={infinitySudokuPageMetadata.path}>Infinity</Link> corpus, not a Suuudokuuu measurement.
        </p>
        <p>
            Source:{' '}
            <a href="http://forum.enjoysudoku.com/the-hardest-sudokus-new-thread-t6539.html">
                Sudoku Players’ Forum, “The hardest sudokus (new thread)”
            </a>
            . Compare it with <Link href={silverPlatePageMetadata.path}>Silver Plate</Link> from the same list, or browse every record grid
            on the <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> page.
        </p>
        <h2>The Kolk solution, step by step</h2>
        <FamousPuzzleWalkthrough puzzle={KOLK} />
    </main>
);

export default KolkPage;
