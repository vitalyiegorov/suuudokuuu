import Link from 'next/link';

import { FamousPuzzleBoard } from '../../../../hardest/components/famous-puzzle-board/famous-puzzle-board';
import { FamousPuzzlePageHeader } from '../../../../hardest/components/famous-puzzle-page-header/famous-puzzle-page-header';
import { FamousPuzzleWalkthrough } from '../../../../hardest/components/famous-puzzle-walkthrough/famous-puzzle-walkthrough';
import { GOLDEN_NUGGET } from '../../../../hardest/constants/famous-puzzle.constant';
import { FaqAnswer } from '../../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../../seo/components/faq/faq';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { infinitySudokuPageMetadata } from '../../sudoku/infinity/metadata';
import { cellForcingChainPageMetadata } from '../../techniques/cell-forcing-chain/metadata';
import { everestPageMetadata } from '../everest/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../metadata';

import { goldenNuggetPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(goldenNuggetPageMetadata);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const GoldenNuggetPage = () => (
    <main>
        <FamousPuzzlePageHeader metadata={goldenNuggetPageMetadata} />
        <p>
            Golden Nugget is a 21-clue sudoku posted to the Sudoku Players’ Forum as an open challenge, built to resist logical solving for
            as long as possible. It is commonly rated at SE 11.9, level with <Link href={everestPageMetadata.path}>Everest</Link> at the top
            of the scale. Play the original grid below in your browser or in the app, print it, and follow the engine’s full solution
            further down.
        </p>
        <FamousPuzzleBoard puzzle={GOLDEN_NUGGET}>Golden Nugget, 21 givens, as posted to the Sudoku Players’ Forum.</FamousPuzzleBoard>
        <h2>Where Golden Nugget comes from</h2>
        <p>
            Golden Nugget was not a newspaper puzzle. It came out of the forum where the people who write sudoku rating programs compare
            their hardest finds, and it was posted there as a challenge for solvers to work through. Its reputation comes from that
            community rather than from publicity, which is why it is less famous than AI Escargot and considerably harder.
        </p>
        <p>
            Source:{' '}
            <a href="http://forum.enjoysudoku.com/golden-nugget-challenge-t35955.html">Sudoku Players’ Forum, “Golden Nugget challenge”</a>.
            The SE figure is the published rating the Infinity corpus carries, not a Suuudokuuu measurement, and at this height different
            raters disagree by several tenths. The other record grids are on the{' '}
            <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> page.
        </p>
        <h2>The Golden Nugget solution, step by step</h2>
        <FamousPuzzleWalkthrough puzzle={GOLDEN_NUGGET} />
        <p>
            Where the engine has to fill a cell from the solution, its chains have run out of reach. That is the honest signature of an SE
            11.9 grid: the deductions it needs are longer and more nested than a{' '}
            <Link href={cellForcingChainPageMetadata.path}>cell forcing chain</Link> of the kind the engine implements.
        </p>
        <FaqPage>
            <FaqHeading>Golden Nugget sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>How hard is the Golden Nugget sudoku?</FaqQuestion>
                <FaqAnswer>
                    It is commonly rated SE 11.9, at the very top of the Sudoku Explainer scale and well above AI Escargot at about 10.6.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I play Golden Nugget in the app?</FaqQuestion>
                <FaqAnswer>
                    Yes. Open it with the play-in-app button above, or play the{' '}
                    <Link href={infinitySudokuPageMetadata.path}>Infinity tier</Link>, which serves it among the other record puzzles.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default GoldenNuggetPage;
