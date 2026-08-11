import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { getDifficultyClueCount } from '../../difficulty/utils/get-difficulty-clue-count.util';
import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../seo/components/breadcrumbs/breadcrumbs';
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
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Sudoku difficulties</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Sudoku Difficulty Levels</h1>
        <p>
            Suuudokuuu grades every puzzle on a six-tier ladder, from Newbie through Hell, and each tier is defined by two concrete facts
            rather than a marketing label: how many clues the grid starts with, and which named solving techniques the tier draws on. No SE
            (Sudoku Explainer) number is attached to individual puzzles yet; for what each tier measurably requires, the{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> publishes solve data generated from a
            fixed sample of every tier below.
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
                <Link href={easySudokuPageMetadata.path}>Easy</Link> — {getDifficultyClueCount(DifficultyEnum.Easy)} clues, the same
                single-cell logic with more of it to work through.
            </li>
            <li>
                <Link href={mediumSudokuPageMetadata.path}>Medium</Link> — {getDifficultyClueCount(DifficultyEnum.Medium)} clues, where
                hidden singles and box-line intersections start to earn their keep.
            </li>
            <li>
                <Link href={hardSudokuPageMetadata.path}>Hard</Link> — {getDifficultyClueCount(DifficultyEnum.Hard)} clues, the first tier
                where subsets and fish patterns show up at all.
            </li>
            <li>
                <Link href={nightmareSudokuPageMetadata.path}>Nightmare</Link> — {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues,
                where boards diverge sharply: some still fall to singles, others need fish, wings and chains.
            </li>
            <li>
                <Link href={hellSudokuPageMetadata.path}>Hell</Link> — {getDifficultyClueCount(DifficultyEnum.Hell)} clues, drawn from a
                bundled, verified corpus, and the only tier where singles alone are never enough.
            </li>
        </ul>
        <h2>How the ladder is built</h2>
        <p>
            Clue count is not the difficulty. It is only the input: fewer starting digits mean fewer immediate placements, which forces the
            solver — human or machine — to reach for a wider set of named techniques before the grid moves again. Suuudokuuu’s generator
            strips digits from a solved grid down to a fixed target for each tier, then verifies the result still has exactly one solution
            before it ever reaches a player. The <Link href={techniquesPageMetadata.path}>full technique index</Link> lists every pattern
            the generator and the in-app hint system recognise, in the order a solver tries them. Because clue count is only the input, two
            boards on the same tier can differ a lot in practice —{' '}
            <Link href={sudokuCluesVsDifficultyPageMetadata.path}>clues versus difficulty</Link> measures exactly how much.
        </p>
        <p>
            New to the grid itself? Start with the <Link href={howToPlayPageMetadata.path}>how to play guide</Link> for the three rules and
            your first placements before picking a tier above.
        </p>
    </main>
);

export default SudokuDifficultiesPage;
