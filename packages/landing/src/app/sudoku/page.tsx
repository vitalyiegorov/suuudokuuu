import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { getDifficultyClueCount } from '../../difficulty/utils/get-difficulty-clue-count.util';
import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
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
    </main>
);

export default SudokuDifficultiesPage;
