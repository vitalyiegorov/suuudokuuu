import Link from 'next/link';

import { isDefined } from '@rnw-community/shared';

import { DailyPuzzle } from '../../../../daily/components/daily-puzzle/daily-puzzle';
import { DAILY_ARCHIVE_DATES, DAILY_MONTH_KEY_LENGTH } from '../../../../daily/constants/daily-archive.constant';
import { ArticleSchema } from '../../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { PageChain } from '../../../../seo/components/page-chain/page-chain';
import { PageHeader } from '../../../../seo/components/page-header/page-header';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { homePageMetadata } from '../../metadata';
import { buildDailyArchivePageMetadata } from '../archive/[month]/metadata';
import { dailySudokuPageMetadata } from '../metadata';

import { buildDailyPuzzlePageMetadata } from './metadata';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ date: string }>;
}

export const dynamicParams = false;

export const generateStaticParams = () => DAILY_ARCHIVE_DATES.map(date => ({ date }));

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(buildDailyPuzzlePageMetadata((await params).date));

const DailyPuzzlePage = async ({ params }: Props) => {
    const { date } = await params;
    const pageMetadata = buildDailyPuzzlePageMetadata(date);
    const monthMetadata = buildDailyArchivePageMetadata(date.slice(0, DAILY_MONTH_KEY_LENGTH));
    const dateIndex = DAILY_ARCHIVE_DATES.indexOf(date);
    const newerDate = DAILY_ARCHIVE_DATES.slice(0, dateIndex).at(-1);
    const olderDate = DAILY_ARCHIVE_DATES.at(dateIndex + 1);

    return (
        <main>
            <ArticleSchema metadata={pageMetadata} />
            <PageHeader metadata={pageMetadata}>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem path={dailySudokuPageMetadata.path}>Daily sudoku</BreadcrumbListItem>
                <BreadcrumbListItem path={monthMetadata.path}>{monthMetadata.title}</BreadcrumbListItem>
                <BreadcrumbListItem>{pageMetadata.title}</BreadcrumbListItem>
            </PageHeader>
            <DailyPuzzle date={date} />
            <h2>More daily puzzles</h2>
            <p>
                Every day since the archive began has its own page. Browse the <Link href={monthMetadata.path}>{monthMetadata.title}</Link>,
                or go back to <Link href={dailySudokuPageMetadata.path}>today’s daily sudoku</Link>.
            </p>
            <PageChain
                ariaLabel="Daily sudoku by date"
                nextLabel="Next day"
                previousLabel="Previous day"
                {...(isDefined(olderDate) && { previous: buildDailyPuzzlePageMetadata(olderDate) })}
                {...(isDefined(newerDate) && { next: buildDailyPuzzlePageMetadata(newerDate) })}
            />
        </main>
    );
};

export default DailyPuzzlePage;
