import Link from 'next/link';

import { FamousPuzzleBoard } from '../../../../hardest/components/famous-puzzle-board/famous-puzzle-board';
import { FamousPuzzlePageHeader } from '../../../../hardest/components/famous-puzzle-page-header/famous-puzzle-page-header';
import { FamousPuzzleWalkthrough } from '../../../../hardest/components/famous-puzzle-walkthrough/famous-puzzle-walkthrough';
import { SILVER_PLATE } from '../../../../hardest/constants/famous-puzzle.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { infinitySudokuPageMetadata } from '../../sudoku/infinity/metadata';
import { kolkPageMetadata } from '../kolk/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../metadata';

import { silverPlatePageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(silverPlatePageMetadata);

const SilverPlatePage = () => (
    <main>
        <FamousPuzzlePageHeader metadata={silverPlatePageMetadata} />
        <p>
            Silver Plate is a 21-clue sudoku from the Sudoku Players’ Forum list of the hardest known puzzles, rated SE 11.5 there — a notch
            below the 11.9 grids at the very top and still far beyond anything a newspaper prints. Play it below, print it, or follow the
            engine’s solution further down.
        </p>
        <FamousPuzzleBoard puzzle={SILVER_PLATE}>Silver Plate, 21 givens, as listed on the Sudoku Players’ Forum.</FamousPuzzleBoard>
        <h2>Where Silver Plate comes from</h2>
        <p>
            Like <Link href={kolkPageMetadata.path}>Kolk</Link>, Silver Plate is one of the named grids in the forum’s long-running “hardest
            sudokus” thread, the list where solvers collect and rate the hardest grids they find. The figure here is the forum’s published
            rating, carried by the Suuudokuuu <Link href={infinitySudokuPageMetadata.path}>Infinity</Link> corpus, not a Suuudokuuu
            measurement.
        </p>
        <p>
            Source:{' '}
            <a href="http://forum.enjoysudoku.com/the-hardest-sudokus-new-thread-t6539.html">
                Sudoku Players’ Forum, “The hardest sudokus (new thread)”
            </a>
            . Every other record grid is on the <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> page.
        </p>
        <h2>The Silver Plate solution, step by step</h2>
        <FamousPuzzleWalkthrough puzzle={SILVER_PLATE} />
    </main>
);

export default SilverPlatePage;
