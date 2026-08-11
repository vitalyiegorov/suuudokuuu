import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { TechniqueFrequencyTable } from '../../../rating/components/technique-frequency-table/technique-frequency-table';
import { TierLadderTable } from '../../../rating/components/tier-ladder-table/tier-ladder-table';
import { RATING_SAMPLE_SIZE, RATING_SAMPLE_TOTAL } from '../../../rating/constants/rating-sample.constant';
import { getTierTechniqueReport } from '../../../rating/utils/get-tier-technique-reports.util';
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../../seo/components/breadcrumbs/breadcrumbs';
import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { seventeenClueSudokuPageMetadata } from '../../17-clue-sudoku/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../../hardest-sudoku-puzzles/metadata';
import { homePageMetadata } from '../../metadata';
import { solverPageMetadata } from '../../solver/metadata';
import { sudokuDifficultiesPageMetadata } from '../../sudoku/metadata';
import { aicPageMetadata } from '../../techniques/aic/metadata';
import { hiddenSinglePageMetadata } from '../../techniques/hidden-single/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { simpleColoringPageMetadata } from '../../techniques/simple-coloring/metadata';
import { swordfishPageMetadata } from '../../techniques/swordfish/metadata';
import { xChainPageMetadata } from '../../techniques/x-chain/metadata';
import { xWingPageMetadata } from '../../techniques/x-wing/metadata';
import { xyChainPageMetadata } from '../../techniques/xy-chain/metadata';
import { xyWingPageMetadata } from '../../techniques/xy-wing/metadata';
import { sudokuCluesVsDifficultyPageMetadata } from '../sudoku-clues-vs-difficulty/metadata';

import { sudokuDifficultyRatingPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(sudokuDifficultyRatingPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const SudokuDifficultyRatingPage = () => {
    const easyReport = getTierTechniqueReport(DifficultyEnum.Easy);
    const hardReport = getTierTechniqueReport(DifficultyEnum.Hard);
    const nightmareReport = getTierTechniqueReport(DifficultyEnum.Nightmare);
    const hellReport = getTierTechniqueReport(DifficultyEnum.Hell);

    return (
        <main>
            <ArticleSchema
                dateModified={sudokuDifficultyRatingPageMetadata.updatedAt}
                datePublished={sudokuDifficultyRatingPageMetadata.publishedAt}
                description={sudokuDifficultyRatingPageMetadata.metaDescription}
                headline={sudokuDifficultyRatingPageMetadata.title}
                path={sudokuDifficultyRatingPageMetadata.path}
            />
            <Breadcrumbs>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem>Sudoku difficulty rating</BreadcrumbListItem>
            </Breadcrumbs>
            <h1>Sudoku Difficulty Rating (SE) Explained</h1>
            <p>
                An SE rating is a sudoku difficulty score on the Sudoku Explainer scale — roughly 1.0 to 12.0 — that grades a puzzle by the
                hardest human solving technique its cheapest logical solve path requires. It is a claim about reasoning depth, not about how
                many cells start blank, which is why two grids with identical clue counts can sit several points apart on the same scale.
            </p>
            <TechniqueSummary>
                <ul>
                    <li>SE scores the hardest technique a puzzle forces on you, measured over the cheapest path to the solution.</li>
                    <li>
                        Landmark values the solving community quotes: hidden single 1.5, X-Wing 3.2, swordfish 3.8, forcing chains 7.0 and
                        up. AI Escargot lands near 10.6, Platinum Blonde near 10.9, Arto Inkala’s Everest near 11.9.
                    </li>
                    <li>
                        Suuudokuuu does not attach an SE number to individual puzzles today. A per-puzzle rating engine is in development;
                        until it ships this page reports the hardest technique each puzzle required, which is the quantity SE is built on.
                    </li>
                    <li>
                        Every number in the tables below is produced at build time by running our open-source technique detectors over a
                        fixed sample of {RATING_SAMPLE_TOTAL} puzzles, {RATING_SAMPLE_SIZE} per tier.
                    </li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={SITE_PLAY_URL}>
                Play Sudoku now
            </a>
            <h2>What an SE rating measures</h2>
            <p>
                Sudoku Explainer, the Java solver the scale is named after, solves a puzzle the way a disciplined human would: it tries the
                cheapest technique it knows, applies the one step that technique justifies, and starts over. Each technique carries a fixed
                cost, and the puzzle’s rating is the highest cost the solver had to pay anywhere along that path. A grid that never needs
                more than a <Link href={hiddenSinglePageMetadata.path}>hidden single</Link> is rated at the hidden-single cost no matter how
                many of them it takes. That single-worst-step rule is what makes SE a difficulty measure rather than a length measure — and
                it is the number behind almost every “world’s hardest sudoku” claim, including the puzzles on our{' '}
                <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> page.
            </p>
            <h2>The technique-to-rating ladder</h2>
            <p>
                The ladder runs from the techniques every beginner uses to the ones almost nobody applies unaided. Singles occupy the
                bottom, with the hidden single pinned at 1.5. Intersections and subsets — pointing pairs, box-line reductions, naked and
                hidden pairs — sit above the singles and below the fish patterns. Basic fish carry published values: an{' '}
                <Link href={xWingPageMetadata.path}>X-Wing</Link> is 3.2 and a <Link href={swordfishPageMetadata.path}>swordfish</Link> is
                3.8. Above them sit the wings and chains — <Link href={xyWingPageMetadata.path}>XY-Wing</Link>,{' '}
                <Link href={xChainPageMetadata.path}>X-Chain</Link>, <Link href={xyChainPageMetadata.path}>XY-Chain</Link>,{' '}
                <Link href={simpleColoringPageMetadata.path}>simple coloring</Link> and <Link href={aicPageMetadata.path}>AIC</Link> — and
                above those, forcing chains and nets, which start at 7.0 and carry every puzzle in the 8.0-and-up range. Where we have not
                verified a value, this guide names the rung rather than invent a figure.
            </p>
            <h2>Why blank-cell counts are a poor proxy</h2>
            <p>
                Most sudoku apps, Suuudokuuu included, currently label a puzzle by how many cells it leaves blank. That is a generation
                parameter, not a measurement. The table below solves {RATING_SAMPLE_SIZE} fixed puzzles from each of our six tiers with the
                full technique registry and records what each one actually demanded.
            </p>
            <TierLadderTable>
                Logical-solve results for {RATING_SAMPLE_TOTAL} puzzles, {RATING_SAMPLE_SIZE} per tier. “Singles only” counts puzzles
                finished with full houses, naked singles and hidden singles alone. “Past our detectors” counts puzzles where our technique
                registry ran out of justified steps before the grid was full.
            </TierLadderTable>
            <p>
                Easy starts with {easyReport.clueCount} clues and Medium with ten fewer, and every puzzle in both samples demands exactly
                the same technique. Hard drops another ten, and {hardReport.singlesOnlyPuzzleCount} of {hardReport.sampleSize} Hard puzzles
                still finish on singles alone. Clue count only becomes informative at the extreme: at seventeen clues,{' '}
                {hellReport.singlesOnlyPuzzleCount} of {hellReport.sampleSize} puzzles do. The full argument lives in our{' '}
                <Link href={sudokuCluesVsDifficultyPageMetadata.path}>clues versus difficulty guide</Link>.
            </p>
            <h2>Which techniques our tiers really require</h2>
            <p>
                The next table counts how many of the {RATING_SAMPLE_SIZE} sampled puzzles per tier required each technique at least once.
                Because our solver always takes the cheapest available step, a technique appears here only when nothing simpler would move
                the grid.
            </p>
            <TechniqueFrequencyTable>
                Puzzles out of {RATING_SAMPLE_SIZE} per tier that required each technique at least once, generated from the same sample.
                Every row links to the worked example for that technique.
            </TechniqueFrequencyTable>
            <h2>How our six tiers map today</h2>
            <p>
                Newbie, Easy and Medium are single-technique tiers: full houses and naked singles finish every puzzle we sampled, so their
                whole range collapses onto the bottom rung. Hard is the first tier where subsets and fish appear at all, and even there
                rarely. Nightmare is the inflection point — {nightmareReport.singlesOnlyPuzzleCount} of {nightmareReport.sampleSize} still
                fall to singles while the rest fan out across intersections, subsets, fish, wings and chains up to AIC. Hell, drawn from a
                verified <Link href={seventeenClueSudokuPageMetadata.path}>17-clue corpus</Link>, is the only tier where singles alone never
                suffice.
            </p>
            <p>
                That spread is the honest answer to “how hard is expert sudoku, actually”: within one tier it varies enormously, because
                clue count fixes the input and not the reasoning. Browse the{' '}
                <Link href={sudokuDifficultiesPageMetadata.path}>difficulty levels hub</Link> or the{' '}
                <Link href={techniquesPageMetadata.path}>technique index</Link> for the patterns themselves.
            </p>
            <h2>What we do not claim yet</h2>
            <p>
                We do not compute an SE number for your puzzle. Our detector ladder tops out at AIC, so it covers the bottom of the SE scale
                thoroughly and the top of it not at all — the {hellReport.beyondLadderPuzzleCount} Hell and{' '}
                {nightmareReport.beyondLadderPuzzleCount} Nightmare puzzles marked “past our detectors” are not proof that those grids need
                guessing. They need a forcing-chain engine we have not shipped, which is exactly what a real rating requires. Until it
                lands, the hardest-technique column is the most rigorous difficulty statement we will publish. You can watch the same
                registry work step by step in the <Link href={solverPageMetadata.path}>sudoku solver</Link>.
            </p>
            <h2>Sudoku difficulty rating FAQ</h2>
            <FaqPage>
                <Faq>
                    <FaqQuestion>What is an SE rating in sudoku?</FaqQuestion>
                    <FaqAnswer>
                        A difficulty score on the Sudoku Explainer scale, roughly 1.0 to 12.0, that rates a puzzle by the hardest named
                        technique its cheapest logical solve path requires. Hidden singles sit at 1.5, an X-Wing at 3.2, a swordfish at 3.8,
                        and forcing chains from 7.0 upward.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Does Suuudokuuu give every puzzle an SE rating?</FaqQuestion>
                    <FaqAnswer>
                        Not today. A per-puzzle rating engine is in development. What we publish now is the hardest technique each puzzle
                        required, measured by running our open-source detectors over a fixed sample of {RATING_SAMPLE_TOTAL} puzzles at
                        build time.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Is a sudoku with fewer clues always harder?</FaqQuestion>
                    <FaqAnswer>
                        No. In our sample, {hardReport.singlesOnlyPuzzleCount} of {hardReport.sampleSize} puzzles with{' '}
                        {hardReport.clueCount} clues needed nothing beyond singles — the same techniques every {easyReport.clueCount}-clue
                        Easy puzzle needed. Clue count only becomes a reliable signal down at the seventeen-clue minimum.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>How hard is an expert sudoku on the SE scale?</FaqQuestion>
                    <FaqAnswer>
                        Most puzzles sold as expert need fish and wing patterns, which sit in the 3 to 4 range, well below the forcing-chain
                        territory above 7.0 where record puzzles like AI Escargot and Everest live. Expert is a marketing label, not a
                        rating band.
                    </FaqAnswer>
                </Faq>
            </FaqPage>
        </main>
    );
};

export default SudokuDifficultyRatingPage;
