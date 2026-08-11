import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { getDifficultyClueCount } from '../../difficulty/utils/get-difficulty-clue-count.util';
import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../seo/components/breadcrumbs/breadcrumbs';
import { SITE_PLAY_URL } from '../../seo/constants/site.constant';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
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
            rather than a marketing label: how many clues the grid starts with, and which named solving techniques are needed to finish it
            without guessing. An official SE (Sudoku Explainer) rating band for each tier is not published yet, so treat the technique list
            below as the honest, qualitative read on difficulty until that guide ships.
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
                <Link href={easySudokuPageMetadata.path}>Easy</Link> — {getDifficultyClueCount(DifficultyEnum.Easy)} clues, adds hidden
                singles to the same single-cell logic.
            </li>
            <li>
                <Link href={mediumSudokuPageMetadata.path}>Medium</Link> — {getDifficultyClueCount(DifficultyEnum.Medium)} clues, introduces
                box-line intersections and the first naked and hidden pairs.
            </li>
            <li>
                <Link href={hardSudokuPageMetadata.path}>Hard</Link> — {getDifficultyClueCount(DifficultyEnum.Hard)} clues, requires
                triples, quads and your first fish pattern.
            </li>
            <li>
                <Link href={nightmareSudokuPageMetadata.path}>Nightmare</Link> — {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues,
                needs fish patterns and wings stacked on every earlier technique.
            </li>
            <li>
                <Link href={hellSudokuPageMetadata.path}>Hell</Link> — {getDifficultyClueCount(DifficultyEnum.Hell)} clues, drawn from a
                bundled, verified corpus and solved with chains, coloring and AIC.
            </li>
        </ul>
        <h2>How the ladder is built</h2>
        <p>
            Clue count is not the difficulty. It is only the input: fewer starting digits mean fewer immediate placements, which forces the
            solver — human or machine — to reach for a wider set of named techniques before the grid moves again. Suuudokuuu’s generator
            strips digits from a solved grid down to a fixed target for each tier, then verifies the result still has exactly one solution
            before it ever reaches a player. The <Link href={techniquesPageMetadata.path}>full technique index</Link> lists every pattern
            the generator and the in-app hint system recognise, in the order a solver tries them.
        </p>
        <p>
            New to the grid itself? Start with the <Link href={howToPlayPageMetadata.path}>how to play guide</Link> for the three rules and
            your first placements before picking a tier above.
        </p>
    </main>
);

export default SudokuDifficultiesPage;
