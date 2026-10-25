import Link from 'next/link';

import { OpenInApp } from '../../../../play/components/open-in-app/open-in-app';
import { ArticleSchema } from '../../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../../seo/components/faq/faq';
import { PageHeader } from '../../../../seo/components/page-header/page-header';
import { SITE_NAME } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { TechniqueSummary } from '../../../../techniques/components/technique-summary/technique-summary';
import { challengeAFriendPageMetadata } from '../../challenge-a-friend/metadata';
import { homePageMetadata } from '../../metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { trackYourProgressPageMetadata } from '../../track-your-progress/metadata';
import { sudokuHintsDemoPageMetadata } from '../hints/metadata';
import { learnSudokuPageMetadata } from '../metadata';

import { sudokuReplayPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(sudokuReplayPageMetadata);

const SudokuReplayPage = () => (
    <main>
        <ArticleSchema metadata={sudokuReplayPageMetadata} />
        <PageHeader metadata={sudokuReplayPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={learnSudokuPageMetadata.path}>Learn sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Review your solve</BreadcrumbListItem>
        </PageHeader>
        <p>
            {SITE_NAME} keeps your 20 most recent finished games for each difficulty in your history, and any of them with a stored move
            record can be replayed move by move. Reviewing a solve is one of the quickest ways to learn: you see where you were fast, where
            you stalled, and which technique each placement was really using.
        </p>
        <TechniqueSummary>
            <ul>
                <li>Open a finished game from the Stats tab and press Replay.</li>
                <li>Step forward and back through the moves, or drag the replay progress bar.</li>
                <li>Each move shows its technique and a “via hint” badge when a hint produced it.</li>
                <li>Everything is stored on your device.</li>
            </ul>
        </TechniqueSummary>
        <figure className="page-figure">
            <img
                alt="The replay screen showing the level, score, mistakes and time above the board, with a move counter, step time and a progress bar below it"
                height={782}
                loading="lazy"
                src="/screens/replay.webp"
                width={360}
            />
            <figcaption>The replay screen in the {SITE_NAME} app.</figcaption>
        </figure>
        <h2>What the replay shows</h2>
        <p>
            The header repeats the facts of the run: the difficulty with its Sudoku Explainer rating, your score, your mistakes and your
            total time. Under the board a card shows which move you are on, out of how many, and how long that step took. Previous and next
            buttons step one move at a time, and the progress bar scrubs to any point.
        </p>
        <h2>Technique labels on every move</h2>
        <p>
            Each placement is classified by the technique that justified it, such as a naked single or a hidden pair, using the same
            detector as the <Link href={techniquesPageMetadata.path}>technique guides</Link>. A move that a hint produced carries a “via
            hint” badge, which makes it easy to spot where you needed help. See how hints work on the{' '}
            <Link href={sudokuHintsDemoPageMetadata.path}>sudoku hints explained</Link> page.
        </p>
        <h2>Learning from a replay</h2>
        <ul>
            <li>Find the longest steps and ask what you were missing at that point.</li>
            <li>Look for techniques you never used, then read their guide and look for them on your next puzzle.</li>
            <li>Compare a replay of an easy puzzle with a harder one to see where singles stop being enough.</li>
        </ul>
        <h2>Sharing a finished game</h2>
        <p>
            The replay screen has a share button. For an ordinary game it shares the puzzle; for a challenge run it sends a challenge, so a
            friend can race your recorded run. That is covered on <Link href={challengeAFriendPageMetadata.path}>challenge a friend</Link>.
            Your wider statistics are on <Link href={trackYourProgressPageMetadata.path}>track your progress</Link>.
        </p>
        <OpenInApp />
        <FaqPage>
            <FaqHeading>Replay FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Where do I find the replay?</FaqQuestion>
                <FaqAnswer>
                    Open the Stats tab, choose a difficulty, then press Replay on a finished game. A game shows the button when its move
                    record was stored.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does the replay need an internet connection?</FaqQuestion>
                <FaqAnswer>No. Completed games are stored on your device and replay offline.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I see which moves used a hint?</FaqQuestion>
                <FaqAnswer>Yes. Moves produced by a hint carry a “via hint” badge next to the technique name.</FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default SudokuReplayPage;
