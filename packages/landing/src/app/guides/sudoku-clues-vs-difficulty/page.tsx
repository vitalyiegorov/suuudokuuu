import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { SeRatingRange } from '../../../rating/components/se-rating-range/se-rating-range';
import { TierLadderTable } from '../../../rating/components/tier-ladder-table/tier-ladder-table';
import { RATING_SAMPLE_SIZE, RATING_SAMPLE_TOTAL } from '../../../rating/constants/rating-sample.constant';
import { getTierTechniqueReport } from '../../../rating/utils/get-tier-technique-reports.util';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { seventeenClueSudokuPageMetadata } from '../../17-clue-sudoku/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../../hardest-sudoku-puzzles/metadata';
import { homePageMetadata } from '../../metadata';
import { hardSudokuPageMetadata } from '../../sudoku/hard/metadata';
import { hellSudokuPageMetadata } from '../../sudoku/hell/metadata';
import { mediumSudokuPageMetadata } from '../../sudoku/medium/metadata';
import { sudokuDifficultiesPageMetadata } from '../../sudoku/metadata';
import { newbieSudokuPageMetadata } from '../../sudoku/newbie/metadata';
import { nightmareSudokuPageMetadata } from '../../sudoku/nightmare/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { sudokuDifficultyRatingPageMetadata } from '../sudoku-difficulty-rating/metadata';

import { sudokuCluesVsDifficultyPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(sudokuCluesVsDifficultyPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const SudokuCluesVsDifficultyPage = () => {
    const newbieReport = getTierTechniqueReport(DifficultyEnum.Newbie);
    const mediumReport = getTierTechniqueReport(DifficultyEnum.Medium);
    const hardReport = getTierTechniqueReport(DifficultyEnum.Hard);
    const nightmareReport = getTierTechniqueReport(DifficultyEnum.Nightmare);
    const hellReport = getTierTechniqueReport(DifficultyEnum.Hell);
    const newbieToMediumClueDrop = newbieReport.clueCount - mediumReport.clueCount;
    const newbieToNightmareClueDrop = newbieReport.clueCount - nightmareReport.clueCount;
    const nightmareToHellClueGap = nightmareReport.clueCount - hellReport.clueCount;

    return (
        <main>
            <PageHeader metadata={sudokuCluesVsDifficultyPageMetadata}>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem>Clues versus difficulty</BreadcrumbListItem>
            </PageHeader>
            <p>
                A sudoku clue, also called a given, is a digit printed on the grid before you start, and the clue count is simply how many
                of the 81 cells are filled in at the outset. Fewer clues does not reliably mean a harder puzzle. Clue count fixes how much
                information you begin with; difficulty is fixed by the hardest reasoning step the grid forces on you before it will move,
                and those two properties come apart almost immediately once you measure them.
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        Short answer: no. Across {RATING_SAMPLE_TOTAL} puzzles we solved logically and rated, clue count barely tracks
                        difficulty at all.
                    </li>
                    <li>
                        Our whole generated ladder fits between {newbieReport.clueCount} and {nightmareReport.clueCount} clues —{' '}
                        {newbieToNightmareClueDrop} givens — while the measured difficulty runs from SE{' '}
                        <SeRatingRange report={newbieReport} /> to SE <SeRatingRange report={nightmareReport} />.
                    </li>
                    <li>
                        {mediumReport.clueCount}-clue Medium and {hardReport.clueCount}-clue Hard are one given apart and a whole technique
                        band apart: SE <SeRatingRange report={mediumReport} /> against SE <SeRatingRange report={hardReport} />.
                    </li>
                    <li>
                        The seventeen-clue minimum is barely ahead of the tier above it: {hellReport.clueCount}-clue Hell measures SE{' '}
                        <SeRatingRange report={hellReport} /> against SE <SeRatingRange report={nightmareReport} /> for{' '}
                        {nightmareReport.clueCount}-clue Nightmare.
                    </li>
                    <li>
                        Clue count is a weak lower bound, not a ranking: {newbieReport.singlesOnlyPuzzleCount} of {newbieReport.sampleSize}{' '}
                        puzzles at {newbieReport.clueCount} clues finish on singles, against {hardReport.singlesOnlyPuzzleCount} of{' '}
                        {hardReport.sampleSize} at {hardReport.clueCount}.
                    </li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={SITE_PLAY_URL}>
                Play Sudoku now
            </a>
            <h2>Where the myth comes from</h2>
            <p>
                The idea has a respectable ancestor. Seventeen is the proven minimum clue count for a sudoku with a unique solution, a
                result established by exhaustive computer search in 2012, and{' '}
                <Link href={seventeenClueSudokuPageMetadata.path}>17-clue puzzles</Link> really are rare and hard to construct. From there
                it is an easy leap to “fewer clues, harder puzzle” — rarity and difficulty feel like the same thing. They are not. Rarity
                describes how hard the grid was to build; difficulty describes how hard it is to solve, and a puzzle can be extremely hard
                to construct and perfectly ordinary to work through.
            </p>
            <p>
                The counter-evidence is loud at the other end too. AI Escargot, for decades the standard answer to “what is the hardest
                sudoku,” carries twenty-three givens — six more than the minimum — and is far harder than a typical 17-clue grid. Every
                puzzle on the <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> page makes the same point.
            </p>
            <h2>What the data says</h2>
            <p>
                Suuudokuuu no longer defines a tier by a blank-cell target. Each generated tier is a required-technique band: a candidate
                board must resist the ladder of the tier below and fall to its own, or it is discarded. The clue count is whatever that
                process happens to need. To find out what the tiers actually produce, we solve {RATING_SAMPLE_SIZE} fixed puzzles per tier
                at build time with our full technique registry, record the hardest step each one demanded, and publish the SE rating each
                board received when it was created.
            </p>
            <TierLadderTable>
                Logical-solve results for {RATING_SAMPLE_TOTAL} puzzles, {RATING_SAMPLE_SIZE} per tier, ordered by tier. “Guaranteed band”
                is the technique contract the generator enforces; “SE range” is the measured spread of per-puzzle ratings. “Singles only”
                counts puzzles finished with full houses, naked singles and hidden singles alone.
            </TierLadderTable>
            <p>
                Look at the clue column on its own first. <Link href={newbieSudokuPageMetadata.path}>Newbie</Link> starts at{' '}
                {newbieReport.clueCount} clues and <Link href={nightmareSudokuPageMetadata.path}>Nightmare</Link>, four tiers later, at{' '}
                {nightmareReport.clueCount}. That is {newbieToNightmareClueDrop} givens across the entire generated ladder — a range narrow
                enough that a reader shown only the clue counts would call these puzzles interchangeable. The SE column says otherwise: SE{' '}
                <SeRatingRange report={newbieReport} /> at the gentle end and SE <SeRatingRange report={nightmareReport} /> at the hard end,
                from a deduction a beginner reads off one cell to a chain that has to be built link by link.
            </p>
            <h2>One clue, one whole band</h2>
            <p>
                The sharpest result on this page is the pair in the middle. <Link href={mediumSudokuPageMetadata.path}>Medium</Link> carries{' '}
                {mediumReport.clueCount} clues and <Link href={hardSudokuPageMetadata.path}>Hard</Link> carries {hardReport.clueCount} — a
                single given between them. Yet no Medium board in the sample ever needs a fish or a wing, and every Hard board does, by
                construction. Measured, that one clue is worth SE <SeRatingRange report={mediumReport} /> against SE{' '}
                <SeRatingRange report={hardReport} />. Compare that with the other end of the ladder, where removing{' '}
                {newbieToMediumClueDrop} givens between Newbie and Medium moves the same distance. There is no exchange rate between clues
                and difficulty: one given is worth a band here and a tenth of one there. The number printed on the grid and the reasoning
                the grid demands are simply different quantities.
            </p>
            <h2>The seventeen-clue minimum is not the ceiling</h2>
            <p>
                <Link href={hellSudokuPageMetadata.path}>Hell</Link> is the one tier drawn from a fixed corpus of {hellReport.clueCount}
                -clue puzzles rather than generated to a band, and it is the clue-count argument at its extreme: it measures SE{' '}
                <SeRatingRange report={hellReport} /> against Nightmare at SE <SeRatingRange report={nightmareReport} /> with{' '}
                {nightmareReport.clueCount} clues. {nightmareToHellClueGap} extra givens buy a tier that reaches almost as high. Fewer clues
                do shift the odds — the pool of very easy grids at seventeen clues is thin — but the corpus behind that tier is filtered by
                rating before it ships, precisely because the clue count alone would not have guaranteed a hard puzzle. Rarity and
                difficulty are different properties, and only one of them is visible in the clue count.
            </p>
            <h2>How to judge difficulty instead</h2>
            <p>
                Ask which techniques a puzzle requires. That is what the Sudoku Explainer scale formalises, and our{' '}
                <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> explains how the technique ladder
                turns into a number — and it is the number every Suuudokuuu board now carries, computed by our open-source rater at the
                moment the board is created. Practically, the useful question is not “how many blanks” but “does this grid ever stop
                yielding to singles” — and if it does, which pattern breaks the deadlock. The{' '}
                <Link href={techniquesPageMetadata.path}>technique index</Link> has a worked example for each one, and the{' '}
                <Link href={sudokuDifficultiesPageMetadata.path}>difficulty levels hub</Link> maps our tiers onto them.
            </p>
            <FaqPage>
                <FaqHeading>Clues versus difficulty FAQ</FaqHeading>
                <Faq>
                    <FaqQuestion>Does a sudoku with fewer clues mean it is harder?</FaqQuestion>
                    <FaqAnswer>
                        Not reliably. In our sample, {mediumReport.clueCount}-clue puzzles measure SE{' '}
                        <SeRatingRange report={mediumReport} /> and {hardReport.clueCount}-clue puzzles measure SE{' '}
                        <SeRatingRange report={hardReport} /> — one given apart, an entire technique band apart. The whole generated ladder
                        spans only {newbieToNightmareClueDrop} givens.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>How many clues does a hard sudoku have?</FaqQuestion>
                    <FaqAnswer>
                        There is no threshold. Published hard puzzles usually carry between 22 and 30 givens, but AI Escargot has 23 and is
                        vastly harder than most 17-clue puzzles. The technique a puzzle requires decides its difficulty, not the count.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>What is the minimum number of clues in a sudoku?</FaqQuestion>
                    <FaqAnswer>
                        Seventeen. A 2012 exhaustive computer search proved no 16-clue grid has a unique solution. See the{' '}
                        <Link href={seventeenClueSudokuPageMetadata.path}>17-clue sudoku guide</Link> for how that proof works.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Can two sudokus with the same number of clues have different difficulty?</FaqQuestion>
                    <FaqAnswer>
                        Yes, dramatically — which is why we stopped grading by clue count. Our {nightmareReport.clueCount}-clue Nightmare
                        tier only holds together because every board is checked against a technique ladder before it ships; boards at that
                        clue count that fall to easier patterns are rejected rather than labelled Nightmare.
                    </FaqAnswer>
                </Faq>
            </FaqPage>
        </main>
    );
};

export default SudokuCluesVsDifficultyPage;
