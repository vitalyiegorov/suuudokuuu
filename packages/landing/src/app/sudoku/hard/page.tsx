import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import { getDifficultyClueCount } from '../../../difficulty/utils/get-difficulty-clue-count.util';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../../seo/components/breadcrumbs/breadcrumbs';
import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { howToPlayPageMetadata } from '../../how-to-play/metadata';
import { homePageMetadata } from '../../metadata';
import { hiddenQuadPageMetadata } from '../../techniques/hidden-quad/metadata';
import { hiddenTriplePageMetadata } from '../../techniques/hidden-triple/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { nakedQuadPageMetadata } from '../../techniques/naked-quad/metadata';
import { nakedTriplePageMetadata } from '../../techniques/naked-triple/metadata';
import { xWingPageMetadata } from '../../techniques/x-wing/metadata';
import { mediumSudokuPageMetadata } from '../medium/metadata';
import { sudokuDifficultiesPageMetadata } from '../metadata';
import { nightmareSudokuPageMetadata } from '../nightmare/metadata';

import { hardSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(hardSudokuPageMetadata);

const HardSudokuPage = () => (
    <main>
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={sudokuDifficultiesPageMetadata.path}>Sudoku difficulties</BreadcrumbListItem>
            <BreadcrumbListItem>Hard</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Hard Sudoku Puzzles</h1>
        <p>
            Hard is where Suuudokuuu’s subset patterns stop stopping at two. A Hard board carries{' '}
            {getDifficultyClueCount(DifficultyEnum.Hard)} clues out of 81 cells, fewer than half the grid, and simple pairs are no longer
            enough to keep a solve moving. You need <Link href={nakedTriplePageMetadata.path}>naked triples</Link> and{' '}
            <Link href={nakedQuadPageMetadata.path}>naked quads</Link>, plus their hidden counterparts,{' '}
            <Link href={hiddenTriplePageMetadata.path}>hidden triples</Link> and{' '}
            <Link href={hiddenQuadPageMetadata.path}>hidden quads</Link>. Hard also introduces the first fish pattern, the{' '}
            <Link href={xWingPageMetadata.path}>X-Wing</Link>, where reasoning stops living inside one unit and starts spanning two.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play Hard Sudoku now
        </a>
        <h2>What makes a puzzle Hard</h2>
        <p>
            Subsets scale by counting, not by guessing at a pattern’s shape. A naked triple is three cells in a unit whose candidates,
            combined, use only three digits, even if no single cell shows all three. A hidden triple is the mirror: three digits that,
            between them, fit in only three cells of a unit, however many other candidates those cells still carry. Quads extend the same
            logic to four cells or four digits, and are correspondingly rarer to spot. The X-Wing steps outside a single unit for the first
            time: a digit confined to the same two columns across two rows can be erased from the rest of those columns, because whichever
            row ends up holding it, the columns are already fixed. At {getDifficultyClueCount(DifficultyEnum.Hard)} clues, a Hard puzzle
            typically needs two or three of these patterns chained together to finish.
        </p>
        <h2>How hard is it, honestly</h2>
        <p>
            There is no published SE (Sudoku Explainer) rating band for Hard yet — that companion guide is still being written — but on any
            qualitative reading, this is where casual solvers start reaching for a hint. Subsets require holding several cells in mind at
            once, and the X-Wing asks you to compare two rows or columns rather than one unit. Expect a careful, honest solve to take ten
            minutes or more.
        </p>
        <h2>Where to go next</h2>
        <p>
            Ready to chain fish and wings together? Move up to <Link href={nightmareSudokuPageMetadata.path}>Nightmare Sudoku</Link>, or
            step back to <Link href={mediumSudokuPageMetadata.path}>Medium Sudoku</Link> for an intersection-only puzzle. See the{' '}
            <Link href={techniquesPageMetadata.path}>technique index</Link>, the{' '}
            <Link href={howToPlayPageMetadata.path}>how to play guide</Link>, every tier on the{' '}
            <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub, or head{' '}
            <Link href={homePageMetadata.path}>home</Link>.
        </p>
        <h2>Hard Sudoku FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>What techniques do I need for Hard sudoku?</FaqQuestion>
                <FaqAnswer>
                    Everything from Medium, plus naked and hidden triples, naked and hidden quads, and the X-Wing fish pattern.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How many clues does a Hard sudoku have?</FaqQuestion>
                <FaqAnswer>{getDifficultyClueCount(DifficultyEnum.Hard)} clues out of 81 cells, fewer than half the grid.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What is the difference between a naked triple and a naked quad?</FaqQuestion>
                <FaqAnswer>
                    Only the count: a naked triple restricts three digits to three cells of a unit, while a naked quad restricts four digits
                    to four cells. Quads are rarer because the exact combination is harder to line up.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is the X-Wing hard to spot?</FaqQuestion>
                <FaqAnswer>
                    It takes practice, since you are comparing candidate positions across two rows or columns instead of reading one unit.
                    It is the easiest fish pattern, and the one every harder fish pattern builds on.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <DifficultyNavigation next={nightmareSudokuPageMetadata} previous={mediumSudokuPageMetadata} />
    </main>
);

export default HardSudokuPage;
