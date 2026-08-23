import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { getDifficultyClueCount } from '../../difficulty/utils/get-difficulty-clue-count.util';
import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Faq } from '../../seo/components/faq/faq';
import { FaqAnswer } from '../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../seo/components/faq-question/faq-question';
import { PageHeader } from '../../seo/components/page-header/page-header';
import { SITE_PLAY_URL } from '../../seo/constants/site.constant';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { sudokuCluesVsDifficultyPageMetadata } from '../guides/sudoku-clues-vs-difficulty/metadata';
import { sudokuDifficultyRatingPageMetadata } from '../guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../how-to-play/metadata';
import { homePageMetadata } from '../metadata';
import { techniquesPageMetadata } from '../techniques/metadata';

import { easySudokuPageMetadata } from './easy/metadata';
import { hardSudokuPageMetadata } from './hard/metadata';
import { hellSudokuPageMetadata } from './hell/metadata';
import { mediumSudokuPageMetadata } from './medium/metadata';
import { sudokuDifficultiesPageMetadata } from './metadata';
import { newbieSudokuPageMetadata } from './newbie/metadata';
import { nightmareSudokuPageMetadata } from './nightmare/metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(sudokuDifficultiesPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const SudokuDifficultiesPage = () => (
    <main>
        <PageHeader metadata={sudokuDifficultiesPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Sudoku difficulties</BreadcrumbListItem>
        </PageHeader>
        <p>
            Suuudokuuu grades every puzzle on a six-tier ladder, from Newbie through Hell, and each tier is defined by two concrete facts
            rather than a marketing label: how many clues the grid starts with, and which named solving techniques the tier is guaranteed to
            require. Every new board is also rated on the SE (Sudoku Explainer) scale the moment it is created, by the same open-source
            rating package the <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> uses to publish
            the measured band and SE range of every tier below.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play now
        </a>
        <ul className="link-list">
            <li>
                <Link href={newbieSudokuPageMetadata.path}>Newbie</Link> — {getDifficultyClueCount(DifficultyEnum.Newbie)} clues, solved
                with full houses and naked singles alone.
            </li>
            <li>
                <Link href={easySudokuPageMetadata.path}>Easy</Link> — {getDifficultyClueCount(DifficultyEnum.Easy)} clues, guaranteed to
                need at least one hidden single and never more than that.
            </li>
            <li>
                <Link href={mediumSudokuPageMetadata.path}>Medium</Link> — {getDifficultyClueCount(DifficultyEnum.Medium)} clues, guaranteed
                to stall on singles and to yield to intersections and subsets.
            </li>
            <li>
                <Link href={hardSudokuPageMetadata.path}>Hard</Link> — {getDifficultyClueCount(DifficultyEnum.Hard)} clues, guaranteed to
                stall on subsets and to yield to fish and wing patterns.
            </li>
            <li>
                <Link href={nightmareSudokuPageMetadata.path}>Nightmare</Link> — {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues,
                guaranteed to stall on wings and to yield to chains and coloring.
            </li>
            <li>
                <Link href={hellSudokuPageMetadata.path}>Hell</Link> — {getDifficultyClueCount(DifficultyEnum.Hell)} clues, drawn from a
                bundled, verified minimum-clue corpus rather than generated to a band.
            </li>
        </ul>
        <h2>How the ladder is built</h2>
        <p>
            Clue count is not the difficulty. It is only the input: fewer starting digits mean fewer immediate placements, which forces the
            solver — human or machine — to reach for a wider set of named techniques before the grid moves again. Suuudokuuu strips digits
            from a solved grid down to a per-tier target, verifies the result still has exactly one solution, and then does the part that
            actually defines the tier: it solves the candidate twice, once with the technique ladder of the tier below and once with its
            own, and keeps the board only if the first solve fails and the second succeeds. Boards that miss are discarded and a fresh one
            is generated. That is why each tier above is stated as a guarantee rather than a hope. The{' '}
            <Link href={techniquesPageMetadata.path}>full technique index</Link> lists every pattern that ladder contains, in the order a
            solver tries them. Within a band two boards can still differ a lot —{' '}
            <Link href={sudokuCluesVsDifficultyPageMetadata.path}>clues versus difficulty</Link> measures exactly how much.
        </p>
        <p>
            New to the grid itself? Start with the <Link href={howToPlayPageMetadata.path}>how to play guide</Link> for the three rules and
            your first placements before picking a tier above.
        </p>
        <h2>Sudoku difficulty levels FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>How many sudoku difficulty levels does Suuudokuuu have?</FaqQuestion>
                <FaqAnswer>
                    Six: Newbie, Easy, Medium, Hard, Nightmare and Hell, each defined by a clue count and a guaranteed technique band rather
                    than a marketing label.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does a lower clue count always mean a harder puzzle?</FaqQuestion>
                <FaqAnswer>
                    No. Clue count is only the input that forces a solver toward a wider technique set; the technique band the generator
                    verifies is what actually defines each tier. The{' '}
                    <Link href={sudokuCluesVsDifficultyPageMetadata.path}>clues versus difficulty guide</Link> measures the gap directly.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How does Suuudokuuu guarantee a tier’s technique requirement?</FaqQuestion>
                <FaqAnswer>
                    Every candidate board is solved twice: once with the tier below’s technique ladder, which must fail, and once with its
                    own ladder, which must succeed. Boards that miss either test are discarded and regenerated.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Which sudoku difficulty should I start with?</FaqQuestion>
                <FaqAnswer>
                    New solvers should start at Newbie and move up one tier at a time; each step adds exactly one new technique over the
                    tier before it, all the way up to Hard. See the <Link href={howToPlayPageMetadata.path}>how to play guide</Link> first
                    if the three core rules are still unfamiliar.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default SudokuDifficultiesPage;
