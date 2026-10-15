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
import { sudokuDifficultyRatingPageMetadata } from '../guides/sudoku-difficulty-rating/metadata';
import { sudokuReplayPageMetadata } from '../learn-sudoku/replay/metadata';
import { homePageMetadata } from '../metadata';
import { trackYourProgressPageMetadata } from '../track-your-progress/metadata';

import { challengeAFriendPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(challengeAFriendPageMetadata);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const ChallengeAFriendPage = () => (
    <main>
        <ArticleSchema metadata={challengeAFriendPageMetadata} />
        <PageHeader metadata={challengeAFriendPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Challenge a friend</BreadcrumbListItem>
        </PageHeader>
        <p>
            In {SITE_NAME} you can send a friend the exact puzzle you solved, with your recorded run attached. They play the same grid and
            race your time move for move, with no account and no server in between: the whole challenge travels inside one share link.
        </p>
        <TechniqueSummary>
            <ul>
                <li>Switch on Challenge mode before you start; the run is recorded and cannot be paused.</li>
                <li>When you finish, share the challenge link from the replay or result screen.</li>
                <li>Your friend sees your time to beat, your timeline and the techniques you used, then races it.</li>
                <li>The link carries the puzzle and its Sudoku Explainer rating.</li>
            </ul>
        </TechniqueSummary>
        <figure className="page-figure">
            <img
                alt="The challenge screen: a rival’s time to beat, a timeline of their moves and their arsenal of techniques, with an Accept challenge button"
                height={782}
                loading="lazy"
                src="/screens/challenge-accept.webp"
                width={360}
            />
            <figcaption>Accepting a rival’s challenge in the app.</figcaption>
        </figure>
        <h2>How a challenge works</h2>
        <ol>
            <li>
                <strong>Record a run.</strong> Turn on Challenge mode on the Home screen and solve a puzzle. Challenge runs cannot be
                paused, and they note when you leave the app.
            </li>
            <li>
                <strong>Send the link.</strong> From the replay screen of a finished challenge run, tap the challenge button. The share
                sheet sends a link with the message “I completed this Sudoku in” and your time, followed by “Can you beat me?”.
            </li>
            <li>
                <strong>Race the recording.</strong> The friend opens the link, sees the rival’s time, the timeline of their moves and the
                techniques they used, and accepts. During the race the app shows whether you lead or the rival is ahead.
            </li>
            <li>
                <strong>Compare the result.</strong> The result screen says whether you beat your rival, were slower or tied, and by how
                much, and puts both runs side by side.
            </li>
        </ol>
        <h2>Rating and fairness</h2>
        <p>
            Every shared puzzle carries its rating on the Sudoku Explainer scale, so a friend knows what they are accepting before they
            start. How that number is measured is explained in the{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link>. Because a challenge run is recorded
            rather than self-reported, the time to beat is the rival’s actual solve.
        </p>
        <h2>Sharing a plain puzzle</h2>
        <p>
            If you only want to send a puzzle, with no run to beat, the share button on a normal game sends the puzzle itself. The link
            opens in the app if it is installed, and on the web otherwise.
        </p>
        <h2>After the race</h2>
        <p>
            Finished challenges are kept like any other game, so you can{' '}
            <Link href={sudokuReplayPageMetadata.path}>replay them move by move</Link> and see your results in{' '}
            <Link href={trackYourProgressPageMetadata.path}>your progress</Link>.
        </p>
        <OpenInApp />
        <FaqPage>
            <FaqHeading>Challenge a friend FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Does my friend need an account?</FaqQuestion>
                <FaqAnswer>
                    No. The puzzle and your recorded run are encoded in the link itself, and {SITE_NAME} has no account system.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does my friend need the app?</FaqQuestion>
                <FaqAnswer>
                    The link opens in the app when it is installed. Otherwise it opens the web version, which works in a browser.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I pause a challenge run?</FaqQuestion>
                <FaqAnswer>
                    No. Challenge runs cannot be paused, and the recording notes when you leave the app, which keeps the time to beat
                    honest.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default ChallengeAFriendPage;
