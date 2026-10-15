import Link from 'next/link';

import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { SITE_NAME, SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { glossaryPageMetadata } from '../glossary/metadata';
import { techniqueFrequencyByDifficultyPageMetadata } from '../guides/technique-frequency-by-difficulty/metadata';
import { howToPlayPageMetadata } from '../how-to-play/metadata';
import { homePageMetadata } from '../metadata';
import { solverPageMetadata } from '../solver/metadata';
import { sudokuTipsPageMetadata } from '../sudoku-tips/metadata';
import { easySudokuPageMetadata } from '../sudoku/easy/metadata';
import { newbieSudokuPageMetadata } from '../sudoku/newbie/metadata';
import { techniquesPageMetadata } from '../techniques/metadata';
import { trackYourProgressPageMetadata } from '../track-your-progress/metadata';

import { sudokuHintsDemoPageMetadata } from './hints/metadata';
import { learnSudokuPageMetadata } from './metadata';
import { sudokuReplayPageMetadata } from './replay/metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(learnSudokuPageMetadata);

const LearnSudokuPage = () => (
    <main>
        <PageHeader metadata={learnSudokuPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Learn sudoku</BreadcrumbListItem>
        </PageHeader>
        <p>
            Sudoku is learned by reasoning, not by guessing, and the fastest way to improve is a short loop: attempt a puzzle, get a hint
            that explains the move, then review what you did. This path puts the pieces of that loop in order, and every step is backed by
            the same technique engine that powers {SITE_NAME}.
        </p>
        <h2>Step 1: Learn the rules</h2>
        <p>
            Fill every row, column and 3×3 box with the digits 1 to 9, each exactly once. The{' '}
            <Link href={howToPlayPageMetadata.path}>how to play guide</Link> covers the rules and the first two deductions in plain
            language, and the <Link href={glossaryPageMetadata.path}>glossary</Link> explains the terms you will meet next.
        </p>
        <h2>Step 2: Build the first habits</h2>
        <p>
            Ten habits, from scanning for singles to your first pair patterns, each with a solver-checked mini board, are on the{' '}
            <Link href={sudokuTipsPageMetadata.path}>sudoku tips</Link> page. Practice them on a{' '}
            <Link href={newbieSudokuPageMetadata.path}>Newbie</Link> puzzle, then an <Link href={easySudokuPageMetadata.path}>Easy</Link>{' '}
            one.
        </p>
        <h2>Step 3: Add one technique at a time</h2>
        <p>
            The <Link href={techniquesPageMetadata.path}>technique library</Link> has a page for every pattern the game detects, with a
            worked example you can replay on a live board. To see which techniques each tier asks for before you climb, read the{' '}
            <Link href={techniqueFrequencyByDifficultyPageMetadata.path}>technique frequency by difficulty</Link> data.
        </p>
        <h2>Step 4: Let hints teach you</h2>
        <p>
            When you are stuck, a hint should explain, not just fill a cell. The{' '}
            <Link href={sudokuHintsDemoPageMetadata.path}>interactive hint demo</Link> lets you try the hint stepper on a live board: it
            names the technique first, then shows the pattern, then walks through the move. Got a puzzle from a book? Paste it into the{' '}
            <Link href={solverPageMetadata.path}>step-by-step solver</Link>.
        </p>
        <h2>Step 5: Review your solve</h2>
        <p>
            The app keeps your last 20 finished games per difficulty and replays them move by move, labelling each placement with the
            technique behind it. Read how on the <Link href={sudokuReplayPageMetadata.path}>review your solve</Link> page, and see the rest
            of your stats on <Link href={trackYourProgressPageMetadata.path}>track your progress</Link>.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play {SITE_NAME} now
        </a>
        <FaqPage>
            <FaqHeading>Learn sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>How long does it take to learn sudoku?</FaqQuestion>
                <FaqAnswer>
                    The rules take minutes. Solving Newbie and Easy puzzles with singles alone usually follows within a few sessions, and
                    each further technique is its own small step.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do I need to learn every technique?</FaqQuestion>
                <FaqAnswer>
                    No. Singles carry you through the easiest tiers, and you learn a new technique only when a puzzle stalls. The hint tells
                    you which one applies.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is there a course I have to follow?</FaqQuestion>
                <FaqAnswer>
                    No. This path is a suggested reading order, not a locked course. Every page works on its own and every puzzle in the
                    game is free.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default LearnSudokuPage;
