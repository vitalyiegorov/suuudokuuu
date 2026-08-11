import Link from 'next/link';

import { ArticleSchema } from '../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../seo/components/breadcrumbs/breadcrumbs';
import { Faq } from '../../seo/components/faq/faq';
import { FaqAnswer } from '../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../seo/components/faq-question/faq-question';
import { SITE_PLAY_URL } from '../../seo/constants/site.constant';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { sudokuCluesVsDifficultyPageMetadata } from '../guides/sudoku-clues-vs-difficulty/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../hardest-sudoku-puzzles/metadata';
import { homePageMetadata } from '../metadata';
import { hellSudokuPageMetadata } from '../sudoku/hell/metadata';
import { aicPageMetadata } from '../techniques/aic/metadata';
import { techniquesPageMetadata } from '../techniques/metadata';
import { xChainPageMetadata } from '../techniques/x-chain/metadata';

import { seventeenClueSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(seventeenClueSudokuPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const SeventeenClueSudokuPage = () => (
    <main>
        <ArticleSchema
            dateModified={seventeenClueSudokuPageMetadata.updatedAt}
            datePublished={seventeenClueSudokuPageMetadata.publishedAt}
            description={seventeenClueSudokuPageMetadata.metaDescription}
            headline={seventeenClueSudokuPageMetadata.title}
            path={seventeenClueSudokuPageMetadata.path}
        />
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>17-clue sudoku</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>17-Clue Sudoku: The Proven Minimum</h1>
        <p>
            A 17-clue sudoku is a puzzle that starts with only 17 filled cells out of 81 and still has exactly one valid solution — the
            smallest number of givens mathematically proven possible for a standard 9×9 grid. No 16-clue puzzle with a unique solution has
            ever been found, and in 2012 an exhaustive computer search proved none can exist. Seventeen is not a rule of thumb; it is a
            settled result.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play Sudoku now
        </a>
        <h2>The proof that 16 clues is not enough</h2>
        <p>
            In 2012, Gary McGuire, Bastian Tugemann and Gilles Civario published a result proving that a 16-clue sudoku with a unique
            solution does not exist. Rather than checking every possible 16-clue grid by hand, their method used a “hitting set” search:
            they showed that every 16-clue candidate must fail to eliminate at least one of a large catalog of known unavoidable sets —
            small groups of cells that any valid puzzle must intersect enough to keep the solution unique — and confirmed exhaustively that
            no 16-clue arrangement threads all of them at once. The search consumed roughly 7 million core-hours of computation before the
            result was confirmed and published. Seventeen has held as the floor ever since.
        </p>
        <h2>What “minimal” actually means</h2>
        <p>
            A minimal puzzle is one where removing any single given breaks uniqueness — every clue on the board is load-bearing. That is a
            different property from minimum. Seventeen is the minimum clue count across every minimal puzzle that has ever been found or
            proven possible, but plenty of minimal puzzles carry 20, 25 or more givens; they just happen not to have any clue that is safe
            to delete. A 17-clue grid is always minimal, but a minimal grid is not always a 17-clue grid.
        </p>
        <h2>17 clues does not mean hardest</h2>
        <p>
            Clue count and logical difficulty are separate facts about a puzzle, and conflating them is one of the most common sudoku myths.
            A 17-clue grid can still solve with nothing more than singles and pointing pairs if its clues happen to unlock the board
            quickly; plenty do. What actually drives difficulty is how far a solver has to reason once the obvious placements run out — a
            question of technique depth, not starting digit count. Our{' '}
            <Link href={sudokuCluesVsDifficultyPageMetadata.path}>clues versus difficulty guide</Link> measures the gap directly across six
            clue counts, and the <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles in the world</Link> page profiles
            grids that are far harder than a typical 17-clue puzzle despite carrying more givens, including one with 23.
        </p>
        <h2>Real 17-clue puzzles, verified twice</h2>
        <p>
            Suuudokuuu’s <Link href={hellSudokuPageMetadata.path}>Hell tier</Link> does not generate 17-clue puzzles on demand — they are
            too rare and too expensive to search for at runtime. Instead it draws from a bundled corpus built from the tdoku project’s
            published 17-clue catalog, one of the largest known collections of minimum-clue sudokus. Every puzzle in that catalog is
            re-verified before it ships: a bitmask solver confirms each grid has exactly one solution, a Dancing Links exact-cover solver
            cross-checks a sample of those results independently, and any puzzle solvable with nothing but naked and hidden singles is
            excluded outright, since a corpus meant for the hardest tier should not include puzzles that fold on contact. What is left needs
            the same chain and coloring techniques described on the <Link href={techniquesPageMetadata.path}>technique index</Link> —{' '}
            <Link href={xChainPageMetadata.path}>X-Chain</Link> and <Link href={aicPageMetadata.path}>AIC</Link> among them — because a
            17-clue board rarely leaves an easier way through.
        </p>
        <h2>17-Clue Sudoku FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Can a sudoku have 16 clues?</FaqQuestion>
                <FaqAnswer>
                    No. Gary McGuire, Bastian Tugemann and Gilles Civario proved in 2012, via an exhaustive computer search of unavoidable
                    sets, that no 16-clue sudoku grid has a unique solution. Seventeen is the confirmed minimum.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Are 17-clue sudokus the hardest?</FaqQuestion>
                <FaqAnswer>
                    No. Clue count measures how much information a puzzle starts with, not how hard it is to reason through. Many 17-clue
                    puzzles solve with basic techniques, while some puzzles with far more givens, like{' '}
                    <Link href={hardestSudokuPuzzlesPageMetadata.path}>AI Escargot</Link>, are dramatically harder — see the{' '}
                    <Link href={sudokuCluesVsDifficultyPageMetadata.path}>clues versus difficulty data</Link>.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What does “minimal” mean for a sudoku puzzle?</FaqQuestion>
                <FaqAnswer>
                    A minimal puzzle is one where every given is necessary — removing any single clue would create a second valid solution.
                    Seventeen is the smallest clue count found among minimal puzzles, but not every minimal puzzle has only 17 clues; many
                    need more.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does Suuudokuuu’s Hell tier use real 17-clue puzzles?</FaqQuestion>
                <FaqAnswer>
                    Yes. Hell draws from a bundled corpus sourced from the tdoku project’s 17-clue catalog, with every puzzle verified for a
                    unique solution by a bitmask solver and cross-checked by an independent Dancing Links solver before it ships.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default SeventeenClueSudokuPage;
