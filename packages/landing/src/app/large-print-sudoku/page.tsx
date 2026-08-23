import Link from 'next/link';

import { PrintableDownloadCard } from '../../printable/components/printable-download-card/printable-download-card';
import {
    PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
    PRINTABLE_LARGE_PRINT_PUZZLES_PER_PAGE,
    PRINTABLE_LARGE_PRINT_SOLUTIONS_PER_PAGE
} from '../../printable/constants/printable-layout.constant';
import { PRINTABLE_LARGE_PRINT_SIZE } from '../../printable/constants/printable-sample.constant';
import { getPrintableBookletPageCount } from '../../printable/utils/get-printable-booklet-page-count.util';
import { ArticleSchema } from '../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../seo/components/breadcrumbs/breadcrumbs';
import { Faq } from '../../seo/components/faq/faq';
import { FaqAnswer } from '../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../seo/components/faq-question/faq-question';
import { SITE_NAME, SITE_PLAY_URL } from '../../seo/constants/site.constant';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { homePageMetadata } from '../metadata';
import { printableSudokuPageMetadata } from '../printable/metadata';
import { sudokuForSeniorsPageMetadata } from '../sudoku-for-seniors/metadata';

import { largePrintSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(largePrintSudokuPageMetadata);

const LARGE_PRINT_PAGE_COUNT = getPrintableBookletPageCount(
    PRINTABLE_LARGE_PRINT_SIZE,
    PRINTABLE_LARGE_PRINT_PUZZLES_PER_PAGE,
    PRINTABLE_LARGE_PRINT_SOLUTIONS_PER_PAGE
);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const LargePrintSudokuPage = () => (
    <main>
        <ArticleSchema
            dateModified={largePrintSudokuPageMetadata.updatedAt}
            datePublished={largePrintSudokuPageMetadata.publishedAt}
            description={largePrintSudokuPageMetadata.metaDescription}
            headline={largePrintSudokuPageMetadata.title}
            path={largePrintSudokuPageMetadata.path}
        />
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Large print sudoku</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Large Print Sudoku (Free Printable PDF)</h1>
        <p>
            Large print sudoku, here, is a free PDF booklet that prints just {PRINTABLE_LARGE_PRINT_PUZZLES_PER_PAGE} puzzles to a US Letter
            page instead of the usual {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE}, so every grid line and every digit comes out noticeably bigger.
            It sits alongside an on-screen alternative — an adjustable text-size control and the app’s Comfort mode — for anyone who would
            rather read a bigger board than print one.
        </p>
        <PrintableDownloadCard
            fileName="large-print.pdf"
            pageCount={LARGE_PRINT_PAGE_COUNT}
            puzzleCount={PRINTABLE_LARGE_PRINT_SIZE}
            title="Large Print Sudoku"
        />
        <h2>Who reaches for large print</h2>
        <p>
            A bigger grid helps whenever the standard print looks cramped: low-vision solvers, anyone reading without their glasses close
            by, a caregiver setting up an activity for someone else, or a teacher printing a worksheet meant to be read from across a table
            rather than held a few inches from the eyes. The puzzles themselves are not simplified — they are the same gentle Easy-tier
            logic as the standard booklet, so the only thing that changes is how much space each digit gets on the page.
        </p>
        <h2>What is inside the booklet</h2>
        <p>
            The PDF opens with a cover page stating the puzzle and page counts, then {PRINTABLE_LARGE_PRINT_SIZE} puzzles print{' '}
            {PRINTABLE_LARGE_PRINT_PUZZLES_PER_PAGE} to a page, drawn from the same Easy-tier logic as our standard booklets so the solving
            level stays gentle while the print size grows. Full solved grids follow on the last pages at the same larger layout, so checking
            an answer never means switching to smaller print. Every line and digit is vector graphics on a standard PDF font, so it stays
            crisp at any size a printer supports — nothing is a scanned or rasterized image that blurs when enlarged.
        </p>
        <h2>Progress with the per-tier booklets</h2>
        <p>
            Once a large-print puzzle feels comfortable, the <Link href={printableSudokuPageMetadata.path}>printable sudoku hub</Link> has a
            full booklet for every difficulty from Newbie through Hell, each printing {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} puzzles per page
            with solutions included. Working through the tiers in order is the same progression the site’s digital difficulty ladder uses,
            just on paper.
        </p>
        <h2>Printing tips</h2>
        <p>
            Print at 100% scale rather than “fit to page”, which can shrink or distort the grid on some printers, and print single-sided if
            you want the solutions on separate sheets from the puzzles. A laser printer or a fresh inkjet cartridge keeps the thin grid
            lines crisp; a low-ink page can blur the box borders that separate one 3×3 block from the next. If a printer’s default margins
            crop part of the page, check the print dialog for an “actual size” or “no scaling” option before shrinking the whole document to
            fit — that keeps the digits at their intended size instead of scaling everything down together.
        </p>
        <h2>The on-screen alternative</h2>
        <p>
            Paper is not the only way to get bigger digits. The <Link href={sudokuForSeniorsPageMetadata.path}>sudoku for seniors</Link>{' '}
            page covers both on-screen options in full: the site’s own header text-size control, which scales every page here including the
            puzzle boards, and the app’s Comfort mode, a one-tap preset that switches to the largest digit size, a high-contrast theme,
            spacious touch targets, no timer and calmer motion, with every piece still adjustable afterward.
        </p>
        <h2>Classroom and care-home reuse</h2>
        <p>
            {SITE_NAME}’s code, including the generator behind every puzzle here, is open source under the MIT license, and this site places
            no restriction on printing or redistributing the PDFs — including handing large-print copies out in a classroom, a care home
            activity session or a worksheet packet.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Prefer a screen? Play {SITE_NAME} now
        </a>
        <h2>Large Print Sudoku FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>How much bigger is the large-print booklet than the regular one?</FaqQuestion>
                <FaqAnswer>
                    It prints {PRINTABLE_LARGE_PRINT_PUZZLES_PER_PAGE} puzzles per US Letter page instead of{' '}
                    {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE}, so each grid and its digits take up roughly twice the space on the page.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Are the solutions included?</FaqQuestion>
                <FaqAnswer>
                    Yes. The large-print PDF carries full solved grids on its last pages, at the same larger layout as the puzzles.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is there a way to get bigger digits without printing anything?</FaqQuestion>
                <FaqAnswer>
                    Yes. This site’s header has an A / A+ / A++ text-size control that enlarges every page, boards included, and the app’s
                    Comfort mode sets the on-screen board to its largest digit size in one tap.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I use these PDFs in a classroom or care home?</FaqQuestion>
                <FaqAnswer>
                    Yes. The code behind {SITE_NAME}, including the puzzle generator, is MIT-licensed and open source, and there is no
                    restriction here on printing or handing out the PDFs to a group.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default LargePrintSudokuPage;
