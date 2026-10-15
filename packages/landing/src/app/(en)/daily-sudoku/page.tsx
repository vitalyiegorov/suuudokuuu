import Link from 'next/link';

import { DailyArchiveList } from '../../../daily/components/daily-archive-list/daily-archive-list';
import { DailyArchiveMonth } from '../../../daily/components/daily-archive-month/daily-archive-month';
import { DailyPuzzle } from '../../../daily/components/daily-puzzle/daily-puzzle';
import { DAILY_ARCHIVE_DATES, DAILY_BUILD_DATE } from '../../../daily/constants/daily-archive.constant';
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { sudokuDifficultyRatingPageMetadata } from '../guides/sudoku-difficulty-rating/metadata';
import { homePageMetadata } from '../metadata';
import { printableSudokuPageMetadata } from '../printable/metadata';
import { solverPageMetadata } from '../solver/metadata';
import { sudokuDifficultiesPageMetadata } from '../sudoku/metadata';

import { DAILY_ARCHIVE_PAGES_METADATA } from './archive/[month]/metadata';
import { dailySudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(dailySudokuPageMetadata);

const RECENT_DAY_COUNT = 30;

const RECENT_DATES = DAILY_ARCHIVE_DATES.slice(1, RECENT_DAY_COUNT + 1);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const DailySudokuPage = () => (
    <main>
        <ArticleSchema metadata={dailySudokuPageMetadata} />
        <PageHeader metadata={dailySudokuPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Daily sudoku</BreadcrumbListItem>
        </PageHeader>
        <p>
            The daily sudoku is one free puzzle a day, the same for every player on earth, that changes at midnight UTC. It is exactly the
            grid the Suuudokuuu app opens as its daily challenge, so you can play it here in the browser or carry it into the app, and then
            check every move against a full step-by-step solution.
        </p>
        <DailyPuzzle date={DAILY_BUILD_DATE} />
        <h2>Recent daily puzzles</h2>
        <p>Missed a day? Every past puzzle keeps its own page, with the same board, rating and solution it had on the day.</p>
        <DailyArchiveList dates={RECENT_DATES} />
        <h2>Daily sudoku archive by month</h2>
        <ul className="link-list">
            {DAILY_ARCHIVE_PAGES_METADATA.map(monthMetadata => (
                <DailyArchiveMonth key={monthMetadata.path} metadata={monthMetadata} />
            ))}
        </ul>
        <h2>How the daily puzzle is chosen</h2>
        <p>
            Nothing is stored and no server picks the puzzle. The UTC date is hashed into a seed, and the same open-source puzzle forge the
            app uses turns that seed into a board, checking it against its difficulty tier before accepting it. Any device that knows the
            date can therefore rebuild the same grid on its own, which is why this page, the archive and the app always agree.
        </p>
        <p>
            The tier rotates by day: Newbie, Easy, Medium, Hard, then back to Newbie, so a week of dailies covers the whole range from a
            first puzzle to one that needs a fish or a wing. Each board is rated on the SE scale explained in the{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link>, and the{' '}
            <Link href={sudokuDifficultiesPageMetadata.path}>difficulty levels page</Link> describes what each tier asks of you.
        </p>
        <p>
            Want more than one a day? <Link href={printableSudokuPageMetadata.path}>Printable sudoku booklets</Link> cover every tier, and
            the <Link href={solverPageMetadata.path}>step-by-step solver</Link> explains any grid you bring from a newspaper or a book.
        </p>
        <FaqPage>
            <FaqHeading>Daily sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>When does the daily sudoku change?</FaqQuestion>
                <FaqAnswer>
                    At midnight UTC. The day boundary is the same everywhere, so two players in different time zones always get the same
                    puzzle at the same moment.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is this the same puzzle as the daily challenge in the app?</FaqQuestion>
                <FaqAnswer>
                    Yes. The page and the app derive the board from the same date with the same code, so the grid is identical. Use the
                    open-in-app button to play it with streaks and results.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I play yesterday’s daily sudoku?</FaqQuestion>
                <FaqAnswer>
                    Yes. Every past day has its own page in the archive, with the board, its rating and its solution, and a button that
                    opens that exact puzzle in the app.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is the daily sudoku free?</FaqQuestion>
                <FaqAnswer>Yes. It is free, ad-free and needs no account, here and in the app.</FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default DailySudokuPage;
