import Link from 'next/link';

import { isDefined } from '@rnw-community/shared';

import { DailyArchiveList } from '../../../../../daily/components/daily-archive-list/daily-archive-list';
import { DAILY_ARCHIVE_DATES, DAILY_ARCHIVE_MONTHS } from '../../../../../daily/constants/daily-archive.constant';
import { formatDailyMonth } from '../../../../../daily/utils/format-daily-month.util';
import { BreadcrumbListItem } from '../../../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { PageChain } from '../../../../../seo/components/page-chain/page-chain';
import { PageHeader } from '../../../../../seo/components/page-header/page-header';
import { buildPageMetadata } from '../../../../../seo/utils/build-page-metadata.util';
import { homePageMetadata } from '../../../metadata';
import { dailySudokuPageMetadata } from '../../metadata';

import { buildDailyArchivePageMetadata } from './metadata';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ month: string }>;
}

export const dynamicParams = false;

export const generateStaticParams = () => DAILY_ARCHIVE_MONTHS.map(month => ({ month }));

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(buildDailyArchivePageMetadata((await params).month));

const DailyArchivePage = async ({ params }: Props) => {
    const { month } = await params;
    const pageMetadata = buildDailyArchivePageMetadata(month);
    const monthIndex = DAILY_ARCHIVE_MONTHS.indexOf(month);
    const newerMonth = DAILY_ARCHIVE_MONTHS.slice(0, monthIndex).at(-1);
    const olderMonth = DAILY_ARCHIVE_MONTHS.at(monthIndex + 1);
    const monthDates = DAILY_ARCHIVE_DATES.filter(date => date.startsWith(month));

    return (
        <main>
            <PageHeader metadata={pageMetadata}>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem path={dailySudokuPageMetadata.path}>Daily sudoku</BreadcrumbListItem>
                <BreadcrumbListItem>{pageMetadata.title}</BreadcrumbListItem>
            </PageHeader>
            <p>
                Every Suuudokuuu daily sudoku from {formatDailyMonth(month)}, newest first. Each day links to its own page with the board,
                its SE rating, the techniques it needs and a step-by-step solution. The tier rotates through Newbie, Easy, Medium and Hard,
                so any four days in a row cover all four. Today’s puzzle is always on the{' '}
                <Link href={dailySudokuPageMetadata.path}>daily sudoku page</Link>.
            </p>
            <DailyArchiveList dates={monthDates} />
            <PageChain
                ariaLabel="Daily sudoku archive by month"
                nextLabel="Next month"
                previousLabel="Previous month"
                {...(isDefined(olderMonth) && { previous: buildDailyArchivePageMetadata(olderMonth) })}
                {...(isDefined(newerMonth) && { next: buildDailyArchivePageMetadata(newerMonth) })}
            />
        </main>
    );
};

export default DailyArchivePage;
