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
import { challengeAFriendPageMetadata } from '../challenge-a-friend/metadata';
import { sudokuDifficultyRatingPageMetadata } from '../guides/sudoku-difficulty-rating/metadata';
import { sudokuReplayPageMetadata } from '../learn-sudoku/replay/metadata';
import { homePageMetadata } from '../metadata';
import { techniquesPageMetadata } from '../techniques/metadata';

import { trackYourProgressPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(trackYourProgressPageMetadata);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const TrackYourProgressPage = () => (
    <main>
        <ArticleSchema metadata={trackYourProgressPageMetadata} />
        <PageHeader metadata={trackYourProgressPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Track your progress</BreadcrumbListItem>
        </PageHeader>
        <p>
            The Stats tab in {SITE_NAME} answers a harder question than “how many puzzles did I finish”: how good are you really, and what
            have you learned to do? It is built from the ratings and techniques of every solve, and it stays on your device.
        </p>
        <TechniqueSummary>
            <ul>
                <li>Your arsenal counts every technique you have actually used, and names your best one.</li>
                <li>Every finished puzzle is rated on the SE scale, so you can see your hardest solve and your recent average.</li>
                <li>Played, win rate, play streak, best score, best time and average time sit in one grid.</li>
                <li>The daily challenge keeps its own streak, and every finished game can be replayed.</li>
            </ul>
        </TechniqueSummary>
        <figure className="page-figure">
            <img
                alt="The Statistics screen with Your arsenal, Your progress metrics such as win rate and play streak, and a per-difficulty list"
                height={782}
                loading="lazy"
                src="/screens/stats.webp"
                width={360}
            />
            <figcaption>The Statistics tab in the app.</figcaption>
        </figure>
        <h2>Your arsenal</h2>
        <p>
            The arsenal shows each technique you have used to place a digit, with a count, from full houses and naked singles up to pairs,
            fish and chains. Beside it is your best technique and its SE rating. It is the honest answer to “what can I do now”: watch it
            grow as you learn from the <Link href={techniquesPageMetadata.path}>technique library</Link>.
        </p>
        <h2>The SE spectrum</h2>
        <p>
            Each puzzle you finish has a Sudoku Explainer rating from 1.0 to 12.0. Your stats show your hardest solve, your recent average
            and the difficulty you play most, and plot the puzzles you have finished across the rating bands. The{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> explains what the scale measures.
        </p>
        <h2>Streaks and totals</h2>
        <p>
            The progress grid shows games played, win rate, play streak, best score, best time and average time, plus how many games you
            lost, won without a single mistake, and won on Hardcore. The Daily tab has its own streak counter for how many days in a row you
            have solved the daily puzzle, with your best streak and a week view.
        </p>
        <h2>History for every difficulty</h2>
        <p>
            Tap a difficulty to see its finished games with their scores, times and mistakes. Each card summarises the techniques that
            solved the game, including hints and reveals, and games with a stored record open in the{' '}
            <Link href={sudokuReplayPageMetadata.path}>move-by-move replay</Link>. Challenge runs show up too; see{' '}
            <Link href={challengeAFriendPageMetadata.path}>challenge a friend</Link>.
        </p>
        <OpenInApp />
        <FaqPage>
            <FaqHeading>Track your progress FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Where are my stats stored?</FaqQuestion>
                <FaqAnswer>On your device. There is no account, so there is nothing to sync or sign in to.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What does the SE rating in my stats mean?</FaqQuestion>
                <FaqAnswer>
                    It is the Sudoku Explainer difficulty of the puzzle: how hard it is to reason through, not how few clues it has. Hardest
                    solve and recent average are taken from the puzzles you finished.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is there a streak counter?</FaqQuestion>
                <FaqAnswer>
                    Yes. The Daily tab tracks consecutive days with the daily puzzle solved, and the progress grid also shows a play streak.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default TrackYourProgressPage;
