import Link from 'next/link';

import { OpenInApp } from '../../../play/components/open-in-app/open-in-app';
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { SITE_NAME } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { accessibleSudokuPageMetadata } from '../accessible-sudoku/metadata';
import { homePageMetadata } from '../metadata';
import { sudokuForSeniorsPageMetadata } from '../sudoku-for-seniors/metadata';
import { newbieSudokuPageMetadata } from '../sudoku/newbie/metadata';
import { whySuuudokuuuPageMetadata } from '../why-suuudokuuu/metadata';

import { relaxingSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(relaxingSudokuPageMetadata);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const RelaxingSudokuPage = () => (
    <main>
        <ArticleSchema metadata={relaxingSudokuPageMetadata} />
        <PageHeader metadata={relaxingSudokuPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Relaxing sudoku</BreadcrumbListItem>
        </PageHeader>
        <p>
            Sudoku is at its best when nothing is chasing you. {SITE_NAME} has a set of options that take the pressure out: a mistake limit
            you can remove, a quiet score, an optional timer, calm themes, and an app that plays the same with no connection and no ads.
        </p>
        <TechniqueSummary>
            <ul>
                <li>Choose Relaxed on the Home screen for no practical mistake limit; your history shows it as infinity.</li>
                <li>Calm play hides the score and ends each game with a calm summary instead.</li>
                <li>The timer has its own switch, so you can play without watching the clock.</li>
                <li>Pick a soft theme, or switch to dark mode, and set animations to off.</li>
                <li>Everything runs offline, with no ads and no account.</li>
            </ul>
        </TechniqueSummary>
        <h2>No mistake limit</h2>
        <p>
            Before a game starts you choose how many mistakes it allows: Hardcore, Standard or Relaxed. Standard allows three. Relaxed lifts
            the cap far enough that a game is never cut short by wrong guesses, and a replay of the game shows the limit as infinity. It is
            the right setting for a slow evening, for learning a new technique by trying it, or for a first puzzle on{' '}
            <Link href={newbieSudokuPageMetadata.path}>Newbie</Link>.
        </p>
        <h2>Quiet scoring and no clock</h2>
        <p>
            In Settings, Calm play hides the score and finishes with a calm summary, and the Timer switch turns the on-screen clock off.
            Neither changes the puzzle; they only change how much of the game is framed as a performance.
        </p>
        <h2>Themes and motion</h2>
        <p>
            Settings offers Classic, Gold, Newspaper, High contrast and Colorblind safe themes, a dark mode switch, and a live-preview theme
            editor where you can set your own colors. Newspaper is a soft gray board with a paper-like feel. The Animations setting can
            follow your device, stay always on, or be turned off so changes appear instantly. Vibration can be turned off as well.
        </p>
        <h2>Offline, ad-free, account-free</h2>
        <p>
            Puzzles are generated and checked on your device, so a flight or a dead zone changes nothing, and there is nothing to log in to.
            See <Link href={whySuuudokuuuPageMetadata.path}>why {SITE_NAME}</Link> for what that means in practice.
        </p>
        <h2>More ways to make it comfortable</h2>
        <p>
            Larger digits, wider cell spacing and high-contrast colors are covered on the{' '}
            <Link href={accessibleSudokuPageMetadata.path}>accessible sudoku</Link> page, and the{' '}
            <Link href={sudokuForSeniorsPageMetadata.path}>sudoku for seniors</Link> page collects the settings people with less-sharp
            eyesight tend to want.
        </p>
        <OpenInApp />
        <FaqPage>
            <FaqHeading>Relaxing sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>How do I turn off the mistake limit?</FaqQuestion>
                <FaqAnswer>
                    Choose Relaxed as the mistake setting on the Home screen before you start a puzzle. The limit is set per game.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I play without a timer or a score?</FaqQuestion>
                <FaqAnswer>
                    Yes. Turn the Timer switch off and turn Calm play on in Settings. Calm play hides the score and finishes with a calm
                    summary.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does it work offline?</FaqQuestion>
                <FaqAnswer>Yes. Puzzles are generated on your device and your progress is stored there too.</FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default RelaxingSudokuPage;
