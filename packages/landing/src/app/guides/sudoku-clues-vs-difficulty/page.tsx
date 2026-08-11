import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

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
import { TechniqueLink } from '../../../techniques/components/technique-link/technique-link';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { seventeenClueSudokuPageMetadata } from '../../17-clue-sudoku/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../../hardest-sudoku-puzzles/metadata';
import { homePageMetadata } from '../../metadata';
import { easySudokuPageMetadata } from '../../sudoku/easy/metadata';
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
    const easyReport = getTierTechniqueReport(DifficultyEnum.Easy);
    const mediumReport = getTierTechniqueReport(DifficultyEnum.Medium);
    const hardReport = getTierTechniqueReport(DifficultyEnum.Hard);
    const nightmareReport = getTierTechniqueReport(DifficultyEnum.Nightmare);
    const hellReport = getTierTechniqueReport(DifficultyEnum.Hell);
    const newbieToMediumClueDrop = newbieReport.clueCount - mediumReport.clueCount;

    return (
        <main>
            <ArticleSchema
                dateModified={sudokuCluesVsDifficultyPageMetadata.updatedAt}
                datePublished={sudokuCluesVsDifficultyPageMetadata.publishedAt}
                description={sudokuCluesVsDifficultyPageMetadata.metaDescription}
                headline={sudokuCluesVsDifficultyPageMetadata.title}
                path={sudokuCluesVsDifficultyPageMetadata.path}
            />
            <Breadcrumbs>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem>Clues versus difficulty</BreadcrumbListItem>
            </Breadcrumbs>
            <h1>Does Fewer Sudoku Clues Mean a Harder Puzzle?</h1>
            <p>
                A sudoku clue, also called a given, is a digit printed on the grid before you start, and the clue count is simply how many
                of the 81 cells are filled in at the outset. Fewer clues does not reliably mean a harder puzzle. Clue count fixes how much
                information you begin with; difficulty is fixed by the hardest reasoning step the grid forces on you before it will move,
                and those two properties come apart almost immediately once you measure them.
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        Short answer: no. Across {RATING_SAMPLE_TOTAL} puzzles we solved logically, clue count predicts difficulty badly
                        everywhere except at the very bottom of the range.
                    </li>
                    <li>
                        {easyReport.clueCount}-clue Easy puzzles and {mediumReport.clueCount}-clue Medium puzzles required exactly the same
                        techniques — ten fewer givens changed nothing.
                    </li>
                    <li>
                        {hardReport.singlesOnlyPuzzleCount} of {hardReport.sampleSize} puzzles at {hardReport.clueCount} clues finished on
                        singles alone.
                    </li>
                    <li>
                        Clue count does bite at the extreme: {hellReport.singlesOnlyPuzzleCount} of {hellReport.sampleSize} puzzles at{' '}
                        {hellReport.clueCount} clues finished on singles.
                    </li>
                    <li>
                        Identical clue counts produce wildly different puzzles: our {nightmareReport.clueCount}-clue sample ranged from
                        plain hidden singles up to <TechniqueLink technique={nightmareReport.hardestTechniqueReached} />.
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
                Suuudokuuu generates each tier by stripping a solved grid down to a fixed number of blanks and verifying the result still
                has exactly one solution. Nothing in that process targets a difficulty. To find out what the tiers actually produce, we
                solve {RATING_SAMPLE_SIZE} fixed puzzles per tier at build time with our full technique registry and record the hardest step
                each one demanded.
            </p>
            <TierLadderTable>
                Logical-solve results for {RATING_SAMPLE_TOTAL} puzzles, {RATING_SAMPLE_SIZE} per tier, ordered by clue count. “Singles
                only” counts puzzles finished with full houses, naked singles and hidden singles alone.
            </TierLadderTable>
            <p>
                Read the first three rows together. <Link href={newbieSudokuPageMetadata.path}>Newbie</Link>,{' '}
                <Link href={easySudokuPageMetadata.path}>Easy</Link> and <Link href={mediumSudokuPageMetadata.path}>Medium</Link> span{' '}
                {newbieReport.clueCount} clues down to {mediumReport.clueCount}, and every puzzle in all three samples finished on singles.
                Stripping {newbieToMediumClueDrop} givens across that range never pushed a single puzzle past the simplest rung of the
                ladder. Hard removes ten more and {hardReport.singlesOnlyPuzzleCount} of {hardReport.sampleSize} puzzles still finish the
                same way; only a handful ever needed a subset or a fish.
            </p>
            <h2>Same clue count, very different puzzles</h2>
            <p>
                The <Link href={nightmareSudokuPageMetadata.path}>Nightmare</Link> row is the clearest result on this page. Every puzzle in
                that sample starts with exactly {nightmareReport.clueCount} clues, yet {nightmareReport.singlesOnlyPuzzleCount} of{' '}
                {nightmareReport.sampleSize} finish on singles alone while others need everything the registry has, up to{' '}
                <TechniqueLink technique={nightmareReport.hardestTechniqueReached} />, and {nightmareReport.beyondLadderPuzzleCount} run
                past our detectors entirely. If clue count determined difficulty, a fixed clue count would produce a fixed difficulty. It
                does not come close. Whatever a difficulty label means, it cannot mean the number printed on the grid.
            </p>
            <h2>Where clue count does matter</h2>
            <p>
                It is not noise, it is a weak lower bound. Fewer givens shrink the pool of puzzles a generator can find, and at the minimum
                that pool is thin enough that easy grids nearly vanish: at {hellReport.clueCount} clues, {hellReport.singlesOnlyPuzzleCount}{' '}
                of {hellReport.sampleSize} sampled <Link href={hellSudokuPageMetadata.path}>Hell puzzles</Link> finished on singles, against{' '}
                {hardReport.singlesOnlyPuzzleCount} of {hardReport.sampleSize} at {hardReport.clueCount} clues. So a 17-clue puzzle is
                usually harder than a 40-clue puzzle. The failure is in the middle of the range, where nearly all published puzzles live,
                and in the assumption that the relationship is tight enough to rank two specific puzzles.
            </p>
            <h2>How to judge difficulty instead</h2>
            <p>
                Ask which techniques a puzzle requires. That is what the Sudoku Explainer scale formalises, and our{' '}
                <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> explains how the technique ladder
                turns into a number. Practically, the useful question is not “how many blanks” but “does this grid ever stop yielding to
                singles” — and if it does, which pattern breaks the deadlock. The{' '}
                <Link href={techniquesPageMetadata.path}>technique index</Link> has a worked example for each one, and the{' '}
                <Link href={sudokuDifficultiesPageMetadata.path}>difficulty levels hub</Link> maps our tiers onto them.
            </p>
            <h2>Clues versus difficulty FAQ</h2>
            <FaqPage>
                <Faq>
                    <FaqQuestion>Does a sudoku with fewer clues mean it is harder?</FaqQuestion>
                    <FaqAnswer>
                        Not reliably. In our sample, {hardReport.singlesOnlyPuzzleCount} of {hardReport.sampleSize} puzzles with{' '}
                        {hardReport.clueCount} clues needed nothing beyond singles — the same techniques as puzzles with{' '}
                        {easyReport.clueCount} clues. Clue count only becomes a useful signal near the seventeen-clue minimum.
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
                        Yes, dramatically. Every puzzle in our {nightmareReport.clueCount}-clue sample starts with the same number of
                        givens, yet {nightmareReport.singlesOnlyPuzzleCount} of {nightmareReport.sampleSize} finish on singles while others
                        need chains and coloring.
                    </FaqAnswer>
                </Faq>
            </FaqPage>
        </main>
    );
};

export default SudokuCluesVsDifficultyPage;
