import { DifficultyEnum } from '@suuudokuuu/generator';
import { SE_RATING_CEILING } from '@suuudokuuu/rating';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import Link from 'next/link';

import { SeRatingRange } from '../../../rating/components/se-rating-range/se-rating-range';
import { TechniqueFrequencyTable } from '../../../rating/components/technique-frequency-table/technique-frequency-table';
import { TierLadderTable } from '../../../rating/components/tier-ladder-table/tier-ladder-table';
import { RATING_SAMPLE_SIZE, RATING_SAMPLE_TOTAL } from '../../../rating/constants/rating-sample.constant';
import { getTechniqueUsage, getTierTechniqueReport } from '../../../rating/utils/get-tier-technique-reports.util';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { PageHeader } from '../../../seo/components/page-header/page-header';
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
    const newbieReport = getTierTechniqueReport(DifficultyEnum.Newbie);
    const mediumReport = getTierTechniqueReport(DifficultyEnum.Medium);
    const hardReport = getTierTechniqueReport(DifficultyEnum.Hard);
    const nightmareReport = getTierTechniqueReport(DifficultyEnum.Nightmare);
    const hellReport = getTierTechniqueReport(DifficultyEnum.Hell);
    const newbieToNightmareClueDrop = newbieReport.clueCount - nightmareReport.clueCount;

    return (
        <main>
            <PageHeader metadata={sudokuDifficultyRatingPageMetadata}>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem>Sudoku difficulty rating</BreadcrumbListItem>
            </PageHeader>
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
                        Suuudokuuu rates every puzzle it creates. Our open-source rating package scores a board the moment it is generated,
                        and reports {SE_RATING_CEILING} with a ceiling flag rather than guessing when a board runs past what it can price.
                    </li>
                    <li>
                        Each of our five generated tiers guarantees a required-technique band: the board must resist the tier below and must
                        fall to its own ladder, or it is discarded and regenerated.
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
                above those, forcing chains and nets, which start at 7.0 and carry every puzzle in the 8.0-and-up range. Our rating package
                implements that table directly, and it is honest about where it stops: a board whose cheapest solve path needs something the
                detectors cannot price comes back as {SE_RATING_CEILING} with a ceiling flag set, never as an invented number.
            </p>
            <h2>What a tier guarantees</h2>
            <p>
                A tier here is not a blank-cell target. It is a pair of technique ladders. A candidate board is solved twice: once with the
                ladder of the tier below it, which must fail, and once with its own ladder, which must succeed. Miss either test and the
                board is thrown away and a new one is generated. That is what the “guaranteed band” column below states, and it is why two
                adjacent tiers can sit one clue apart and still be different puzzles. The table solves {RATING_SAMPLE_SIZE} fixed puzzles
                from each of our six tiers with the full technique registry and records what each one actually demanded.
            </p>
            <TierLadderTable>
                Logical-solve results for {RATING_SAMPLE_TOTAL} puzzles, {RATING_SAMPLE_SIZE} per tier. “Guaranteed band” is the tier
                contract the generator enforces. “SE range” is the measured spread of per-puzzle ratings in the sample. “Singles only”
                counts puzzles finished with full houses, naked singles and hidden singles alone. “Past our detectors” counts puzzles where
                our technique registry ran out of justified steps before the grid was full.
            </TierLadderTable>
            <p>
                Read the clue column and the band column against each other. Medium starts with {mediumReport.clueCount} clues and Hard with{' '}
                {hardReport.clueCount} — a difference of one given — yet no Medium board in the sample needs a fish or a wing and every Hard
                board does. Nightmare removes one more clue and moves an entire band, from wings to chains. Meanwhile Newbie hands you{' '}
                {newbieReport.clueCount} clues and Nightmare {nightmareReport.clueCount}, {newbieToNightmareClueDrop} fewer, across a span
                that runs from SE <SeRatingRange report={newbieReport} /> to SE <SeRatingRange report={nightmareReport} />. Clue count is
                not what separates these tiers; the technique contract is. The full argument lives in our{' '}
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
                Newbie and Easy are the two singles tiers, and they are genuinely different puzzles even though they share an SE range: a
                Newbie board falls to full houses and naked singles, an Easy board provably does not and needs a{' '}
                <Link href={hiddenSinglePageMetadata.path}>hidden single</Link>. They overlap on the scale only because SE prices a hidden
                single at 1.5, below a naked single at 2.3. Medium is the intersections-and-subsets tier at SE{' '}
                <SeRatingRange report={mediumReport} />, Hard the fish-and-wings tier at SE <SeRatingRange report={hardReport} />, and
                Nightmare the chain tier at SE <SeRatingRange report={nightmareReport} />. Hell, drawn from a verified{' '}
                <Link href={seventeenClueSudokuPageMetadata.path}>17-clue corpus</Link> rather than generated to a band, measures SE{' '}
                <SeRatingRange report={hellReport} /> — a narrower band that starts higher than Nightmare and ends only slightly above it,
                with {getTechniqueUsage(hellReport, SolutionTechniqueEnum.NishioForcingChain)} of {hellReport.sampleSize} boards reaching a
                forcing chain.
            </p>
            <p>
                That is the honest answer to “how hard is expert sudoku, actually”: the ladder rung is the difficulty, and everything else —
                clue count included — is packaging. Browse the <Link href={sudokuDifficultiesPageMetadata.path}>difficulty levels hub</Link>{' '}
                or the <Link href={techniquesPageMetadata.path}>technique index</Link> for the patterns themselves.
            </p>
            <h2>Where our rating stops</h2>
            <p>
                Our rater prices the SE ladder up to forcing chains and nets, and no further. A board whose cheapest path needs something
                past that comes back as exactly {SE_RATING_CEILING} with a ceiling flag rather than a fabricated 10 or 11 — so a rating of{' '}
                {SE_RATING_CEILING} on this site should be read as “{SE_RATING_CEILING} or above”, never as a precise score. That matters at
                the top of the scale: the record puzzles on our{' '}
                <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> page are quoted at values independent
                raters publish, because our own engine would report them at the ceiling. Nothing we generate comes close: no board in the
                sample below reached the ceiling, and the “past our detectors” column is {hellReport.beyondLadderPuzzleCount} of{' '}
                {hellReport.sampleSize} in every tier, so nothing on this page rests on a puzzle the registry could not finish. You can
                watch the same registry work step by step in the <Link href={solverPageMetadata.path}>sudoku solver</Link>.
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
                        Yes. Every board is rated by our open-source rating package as it is created. The package prices the published SE
                        technique table and caps out at {SE_RATING_CEILING}: anything harder is reported as {SE_RATING_CEILING} with a
                        ceiling flag rather than an invented figure.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Is a sudoku with fewer clues always harder?</FaqQuestion>
                    <FaqAnswer>
                        No. In our sample, {mediumReport.clueCount}-clue Medium boards measure SE <SeRatingRange report={mediumReport} />{' '}
                        and {hardReport.clueCount}-clue Hard boards measure SE <SeRatingRange report={hardReport} /> — one clue apart, a
                        whole technique band apart. Our {hellReport.clueCount}-clue Hell boards measure SE{' '}
                        <SeRatingRange report={hellReport} />, overlapping {nightmareReport.clueCount}-clue Nightmare at SE{' '}
                        <SeRatingRange report={nightmareReport} />.
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
