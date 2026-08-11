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
import { fullHousePageMetadata } from '../../techniques/full-house/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { nakedSinglePageMetadata } from '../../techniques/naked-single/metadata';
import { easySudokuPageMetadata } from '../easy/metadata';
import { sudokuDifficultiesPageMetadata } from '../metadata';

import { newbieSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(newbieSudokuPageMetadata);

const NewbieSudokuPage = () => (
    <main>
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={sudokuDifficultiesPageMetadata.path}>Sudoku difficulties</BreadcrumbListItem>
            <BreadcrumbListItem>Newbie</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Beginner Sudoku Puzzles (Newbie Level)</h1>
        <p>
            Newbie is Suuudokuuu’s beginner tier, the gentlest possible introduction to the grid. A Newbie board starts with{' '}
            {getDifficultyClueCount(DifficultyEnum.Newbie)} of the 81 cells already filled, leaving only ten blanks to work out. Every one
            of those ten can be found with the two simplest deductions in the game: a{' '}
            <Link href={fullHousePageMetadata.path}>full house</Link>, where a unit is down to its last empty cell, and a{' '}
            <Link href={nakedSinglePageMetadata.path}>naked single</Link>, where a cell’s row, column and box between them already account
            for eight of the nine digits. No pencil marks, no elimination logic and no guessing are ever required.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play Newbie Sudoku now
        </a>
        <h2>What makes a puzzle Newbie</h2>
        <p>
            Ten blank cells sits deliberately close to a completed grid, closer to a warm-up drill than a real logic puzzle. Full House and
            Naked Single are also the first two strategies Suuudokuuu’s own solving engine tries on every board at every difficulty, because
            they are the cheapest deductions to verify. What sets Newbie apart is that the generator never needs to reach past them: strip
            more digits and a solver eventually stalls without hidden singles, intersections or subsets, but at ten blanks the grid almost
            solves itself. If you can read a row and name the one digit missing from it, you already have every skill a Newbie puzzle asks
            for.
        </p>
        <h2>How hard is it, honestly</h2>
        <p>
            Suuudokuuu doesn’t publish an official SE (Sudoku Explainer) rating band per tier yet — that companion guide is still being
            written — but qualitatively, Newbie sits below what most SE-based scales even bother to grade. It exists to teach the
            row-column-box overlap that every later technique builds on, not to test it. Treat a fast, mistake-free Newbie solve as
            confirmation you’re ready for Easy, not as a benchmark worth chasing for its own sake.
        </p>
        <h2>Where to go next</h2>
        <p>
            Ready for a puzzle that needs one more idea? Move up to <Link href={easySudokuPageMetadata.path}>Easy Sudoku</Link>, which adds
            the hidden single on top of everything here. Browse the full <Link href={techniquesPageMetadata.path}>technique index</Link> or
            the <Link href={howToPlayPageMetadata.path}>how to play guide</Link>, or head back{' '}
            <Link href={homePageMetadata.path}>home</Link> and see all six tiers on the{' '}
            <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub.
        </p>
        <h2>Newbie Sudoku FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>How hard is Newbie sudoku?</FaqQuestion>
                <FaqAnswer>
                    It is the easiest tier Suuudokuuu offers. Every Newbie puzzle can be finished with full houses and naked singles alone,
                    with no candidate tracking and no risk of a forced guess.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How many clues does a Newbie puzzle have?</FaqQuestion>
                <FaqAnswer>{getDifficultyClueCount(DifficultyEnum.Newbie)} clues out of 81 cells, so only ten cells start blank.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What is the easiest Sudoku difficulty?</FaqQuestion>
                <FaqAnswer>
                    Newbie is the easiest of Suuudokuuu’s six tiers, followed by Easy, Medium, Hard, Nightmare and Hell in increasing order
                    of technique demand.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do I need pencil marks for Newbie puzzles?</FaqQuestion>
                <FaqAnswer>
                    No. Both techniques a Newbie puzzle requires can be read straight off the board, which is exactly why they are the
                    fastest deductions in the game.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <DifficultyNavigation next={easySudokuPageMetadata} />
    </main>
);

export default NewbieSudokuPage;
