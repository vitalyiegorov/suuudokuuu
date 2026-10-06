import { DifficultyEnum } from '@suuudokuuu/generator';
import { INFINITY_CORPUS_MINIMUM_RATING, infinityCorpusSize } from '@suuudokuuu/hell-corpus';
import { SE_RATING_CEILING } from '@suuudokuuu/rating';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import Link from 'next/link';

import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import {
    INFINITY_HIGHEST_RATING,
    INFINITY_LOWEST_RATING,
    INFINITY_MAXIMUM_GIVEN_COUNT,
    INFINITY_MINIMUM_GIVEN_COUNT
} from '../../../difficulty/constants/infinity-corpus.constant';
import { PuzzleBoard } from '../../../puzzle/components/puzzle-board/puzzle-board';
import { SeRatingRange } from '../../../rating/components/se-rating-range/se-rating-range';
import { getTierTechniqueReport } from '../../../rating/utils/get-tier-technique-reports.util';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueLink } from '../../../techniques/components/technique-link/technique-link';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { sudokuDifficultyRatingPageMetadata } from '../../guides/sudoku-difficulty-rating/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../../hardest-sudoku-puzzles/metadata';
import { homePageMetadata } from '../../metadata';
import { printableInfinitySudokuPageMetadata } from '../../printable/infinity/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { hellSudokuPageMetadata } from '../hell/metadata';
import { sudokuDifficultiesPageMetadata } from '../metadata';

import { infinitySudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(infinitySudokuPageMetadata);

const EVEREST_GIVENS = '800000000003600000070090200050007000000045700000100030001000068008500010090000400';

const lowestRatingLabel = INFINITY_LOWEST_RATING.toFixed(1);
const highestRatingLabel = INFINITY_HIGHEST_RATING.toFixed(1);
const minimumRatingLabel = INFINITY_CORPUS_MINIMUM_RATING.toFixed(1);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const InfinitySudokuPage = () => {
    const hellReport = getTierTechniqueReport(DifficultyEnum.Hell);

    return (
        <main>
            <PageHeader metadata={infinitySudokuPageMetadata}>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem path={sudokuDifficultiesPageMetadata.path}>Sudoku difficulties</BreadcrumbListItem>
                <BreadcrumbListItem>Infinity</BreadcrumbListItem>
            </PageHeader>
            <p>
                Infinity is Suuudokuuu’s tier beyond Hell: a curated set of the hardest sudoku puzzles ever published, the record grids the
                solving community still argues about, ready to play for free. Every Infinity board is a known puzzle with a published Sudoku
                Explainer (SE) rating of at least {minimumRatingLabel} — Arto Inkala’s Everest, Platinum Blonde, AI Escargot, Golden Nugget
                and {infinityCorpusSize - 4} more — checked for a single solution before it ships. These are the puzzles our{' '}
                <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> guide describes; Infinity is where you play
                them.
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        {infinityCorpusSize} record puzzles with {INFINITY_MINIMUM_GIVEN_COUNT} to {INFINITY_MAXIMUM_GIVEN_COUNT} clues,
                        published at SE {lowestRatingLabel} to {highestRatingLabel}.
                    </li>
                    <li>Includes Everest (SE 11.9), Platinum Blonde (SE 10.9) and AI Escargot (SE 10.6).</li>
                    <li>Every board is checked for exactly one solution by two independent solving algorithms.</li>
                    <li>Each game reshuffles the grid, so a familiar record puzzle never looks the same twice.</li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={SITE_PLAY_URL}>
                Play Infinity Sudoku now
            </a>
            <h2>What makes a puzzle Infinity</h2>
            <p>
                The other tiers are defined by the techniques they require. Infinity is defined by reputation, measured: a puzzle qualifies
                only if independent raters have published an SE rating of {minimumRatingLabel} or higher for it. Most of the{' '}
                {infinityCorpusSize} come from a 2011 snapshot of the hardest-puzzle database the sudoku-solving community maintains; the
                rest are the named classics, taken from the forum threads and publications where they first appeared. Before the set is
                packed into the app, a Dancing Links exact-cover solver and a bitmask solver both confirm that every grid has exactly one
                solution.
            </p>
            <p>
                When you start an Infinity game, the app picks one of those puzzles and disguises it. It relabels the digits, shuffles rows
                within their bands, columns within their stacks and the bands and stacks themselves, and sometimes mirrors the grid across
                its diagonal. None of that changes the logic or the rating, so the Everest you play is still Everest, it just does not look
                like the picture below.
            </p>
            <PuzzleBoard givens={EVEREST_GIVENS}>Arto Inkala’s Everest (2010), 21 givens, published at SE 11.9.</PuzzleBoard>
            <h2>How hard is it, honestly</h2>
            <p>
                Harder than anything else in the app, by a wide margin. Our sample of {hellReport.sampleSize}{' '}
                <Link href={hellSudokuPageMetadata.path}>Hell</Link> boards measures SE <SeRatingRange report={hellReport} />; Infinity
                starts at {lowestRatingLabel}. The Infinity ratings are not our own measurements. Suuudokuuu’s rater prices the SE ladder
                only as far as forcing chains and nets and reports {SE_RATING_CEILING} with a ceiling flag above that, so for these puzzles
                we quote the figures independent raters publish, as the{' '}
                <Link href={sudokuDifficultyRatingPageMetadata.path}>difficulty rating guide</Link> explains.
            </p>
            <p>
                Our technique engine agrees that these boards sit past its reach. It knows every pattern on the{' '}
                <Link href={techniquesPageMetadata.path}>technique index</Link>, up to the{' '}
                <TechniqueLink technique={SolutionTechniqueEnum.NishioForcingChain} /> and the{' '}
                <TechniqueLink technique={SolutionTechniqueEnum.RegionForcingChain} />, and it still cannot finish a single Infinity puzzle
                on its own. That does not mean they need guessing; it means they need longer forcing nets than the engine implements. Hints
                are off by default on Nightmare, Hell and Infinity, and a setting turns them back on if you want the engine’s help for as
                far as it goes.
            </p>
            <h2>Where to go next</h2>
            <p>
                Want the record puzzles on paper? Download the{' '}
                <Link href={printableInfinitySudokuPageMetadata.path}>printable Infinity sudoku PDF</Link>. Not ready for them yet? Step
                back to <Link href={hellSudokuPageMetadata.path}>Hell Sudoku</Link>, where every board needs a forcing chain but stays
                within reach of our technique ladder. Read the stories behind Everest and AI Escargot on the{' '}
                <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> page, compare every tier on the{' '}
                <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub, or head{' '}
                <Link href={homePageMetadata.path}>home</Link>.
            </p>
            <FaqPage>
                <FaqHeading>Infinity Sudoku FAQ</FaqHeading>
                <Faq>
                    <FaqQuestion>What is Infinity sudoku?</FaqQuestion>
                    <FaqAnswer>
                        Suuudokuuu’s hardest tier: {infinityCorpusSize} of the hardest sudoku puzzles ever published, each with a published
                        SE rating of {minimumRatingLabel} or more, playable for free with no ads.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Can I play AI Escargot and Everest here?</FaqQuestion>
                    <FaqAnswer>
                        Yes. Both are in the Infinity set, along with Platinum Blonde and Golden Nugget. Each game reshuffles digits, rows
                        and columns, so the grid looks different every time while the puzzle stays the same.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Is Infinity harder than Hell?</FaqQuestion>
                    <FaqAnswer>
                        Yes. Our sample measures Hell at SE <SeRatingRange report={hellReport} />, and every Infinity puzzle carries a
                        published rating between {lowestRatingLabel} and {highestRatingLabel}. Hell boards still yield to our technique
                        ladder; Infinity boards do not.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Do Infinity puzzles have a unique solution?</FaqQuestion>
                    <FaqAnswer>
                        Yes. Every grid is checked by a Dancing Links exact-cover solver and a bitmask solver before it ships, and each has
                        exactly one solution.
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation previous={hellSudokuPageMetadata} />
        </main>
    );
};

export default InfinitySudokuPage;
