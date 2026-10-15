import Link from 'next/link';

import { PrintableDownloadCard } from '../../../printable/components/printable-download-card/printable-download-card';
import { PrintableDownloadFact } from '../../../printable/components/printable-download-fact/printable-download-fact';
import { PRINTABLE_BLANK_GRID_PAGE_COUNT } from '../../../printable/constants/printable-page-count.constant';
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { largePrintSudokuPageMetadata } from '../large-print-sudoku/metadata';
import { homePageMetadata } from '../metadata';
import { printableSudokuPageMetadata } from '../printable/metadata';
import { solverPageMetadata } from '../solver/metadata';
import { sudokuTipsPageMetadata } from '../sudoku-tips/metadata';

import { blankSudokuGridPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(blankSudokuGridPageMetadata);

const BlankSudokuGridPage = () => (
    <main>
        <ArticleSchema metadata={blankSudokuGridPageMetadata} />
        <PageHeader metadata={blankSudokuGridPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Blank sudoku grid</BreadcrumbListItem>
        </PageHeader>
        <p>
            A blank sudoku grid is a 9×9 square split into nine 3×3 boxes with no digits in it. This free PDF gives you a full-page grid for
            copying out a puzzle and a second page of four smaller grids for quick practice. It needs nothing but a printer.
        </p>
        <PrintableDownloadCard fileName="blank-grid.pdf" title="Blank Sudoku Grid">
            <PrintableDownloadFact>{PRINTABLE_BLANK_GRID_PAGE_COUNT} pages</PrintableDownloadFact>
            <PrintableDownloadFact>One full-page grid and four practice grids</PrintableDownloadFact>
        </PrintableDownloadCard>
        <h2>What is in the PDF</h2>
        <p>
            The first page is a cover. The next page holds one large grid that fills the sheet, which suits copying a puzzle out of a book,
            a newspaper or a screenshot and solving it with a pencil. The last page holds four smaller grids, so a single sheet covers a
            handful of quick puzzles or lets you try the same position several ways.
        </p>
        <h2>What a blank grid is good for</h2>
        <ul>
            <li>Transcribing a puzzle you found somewhere without a printer-friendly version.</li>
            <li>Teachers building their own worksheets, or students drawing a puzzle for a friend to solve.</li>
            <li>
                Practising pencil marks: write every candidate on paper, then compare with the step-by-step{' '}
                <Link href={solverPageMetadata.path}>sudoku solver</Link> to see which technique fires.
            </li>
            <li>
                Working through the habits on the <Link href={sudokuTipsPageMetadata.path}>sudoku tips</Link> page on paper before trying
                them on a screen.
            </li>
        </ul>
        <h2>Printing tips</h2>
        <p>
            Print at 100% scale rather than “fit to page”, and single-sided if you plan to write on both. The lines are vector graphics, so
            the grid stays sharp at any size. If you would rather have puzzles already filled in, the{' '}
            <Link href={printableSudokuPageMetadata.path}>printable sudoku hub</Link> has a booklet for every difficulty, and the{' '}
            <Link href={largePrintSudokuPageMetadata.path}>large-print booklet</Link> uses bigger grids for easier reading.
        </p>
        <FaqPage>
            <FaqHeading>Blank sudoku grid FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is the blank sudoku grid free to print?</FaqQuestion>
                <FaqAnswer>
                    Yes. The PDF is free, needs no sign-up, and you can print, copy and hand it out as often as you like, including in a
                    classroom.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What paper size is it?</FaqQuestion>
                <FaqAnswer>
                    US Letter. Print at 100% scale to keep the grid square; “fit to page” can distort it on some printers.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How many grids are included?</FaqQuestion>
                <FaqAnswer>One full-page grid and a page of four smaller practice grids, after a one-page cover.</FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default BlankSudokuGridPage;
