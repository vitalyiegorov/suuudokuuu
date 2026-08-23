import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { getDifficultyClueCount } from '../../difficulty/utils/get-difficulty-clue-count.util';
import { PrintableDownloadCard } from '../../printable/components/printable-download-card/printable-download-card';
import {
    PRINTABLE_BLANK_GRID_SHEET_PAGE_COUNT,
    PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
    PRINTABLE_BOOKLET_SOLUTIONS_PER_PAGE,
    PRINTABLE_COVER_PAGE_COUNT,
    PRINTABLE_LARGE_PRINT_PUZZLES_PER_PAGE,
    PRINTABLE_LARGE_PRINT_SOLUTIONS_PER_PAGE
} from '../../printable/constants/printable-layout.constant';
import { PRINTABLE_BOOKLET_SIZE, PRINTABLE_LARGE_PRINT_SIZE } from '../../printable/constants/printable-sample.constant';
import { getPrintableBookletPageCount } from '../../printable/utils/get-printable-booklet-page-count.util';
import { ArticleSchema } from '../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../seo/components/breadcrumbs/breadcrumbs';
import { Faq } from '../../seo/components/faq/faq';
import { FaqAnswer } from '../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../seo/components/faq-question/faq-question';
import { SITE_PLAY_URL } from '../../seo/constants/site.constant';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { sudokuDifficultyRatingPageMetadata } from '../guides/sudoku-difficulty-rating/metadata';
import { homePageMetadata } from '../metadata';
import { easySudokuPageMetadata } from '../sudoku/easy/metadata';
import { hardSudokuPageMetadata } from '../sudoku/hard/metadata';
import { hellSudokuPageMetadata } from '../sudoku/hell/metadata';
import { mediumSudokuPageMetadata } from '../sudoku/medium/metadata';
import { newbieSudokuPageMetadata } from '../sudoku/newbie/metadata';
import { nightmareSudokuPageMetadata } from '../sudoku/nightmare/metadata';

import { printableEasySudokuPageMetadata } from './easy/metadata';
import { printableHardSudokuPageMetadata } from './hard/metadata';
import { printableHellSudokuPageMetadata } from './hell/metadata';
import { printableMediumSudokuPageMetadata } from './medium/metadata';
import { printableSudokuPageMetadata } from './metadata';
import { printableNewbieSudokuPageMetadata } from './newbie/metadata';
import { printableNightmareSudokuPageMetadata } from './nightmare/metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableSudokuPageMetadata);

const TIER_BOOKLET_PAGE_COUNT = getPrintableBookletPageCount(
    PRINTABLE_BOOKLET_SIZE,
    PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
    PRINTABLE_BOOKLET_SOLUTIONS_PER_PAGE
);
const LARGE_PRINT_PAGE_COUNT = getPrintableBookletPageCount(
    PRINTABLE_LARGE_PRINT_SIZE,
    PRINTABLE_LARGE_PRINT_PUZZLES_PER_PAGE,
    PRINTABLE_LARGE_PRINT_SOLUTIONS_PER_PAGE
);
const BLANK_GRID_PAGE_COUNT = PRINTABLE_COVER_PAGE_COUNT + PRINTABLE_BLANK_GRID_SHEET_PAGE_COUNT;

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const PrintableSudokuPage = () => (
    <main>
        <ArticleSchema
            dateModified={printableSudokuPageMetadata.updatedAt}
            datePublished={printableSudokuPageMetadata.publishedAt}
            description={printableSudokuPageMetadata.metaDescription}
            headline={printableSudokuPageMetadata.title}
            path={printableSudokuPageMetadata.path}
        />
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Printable sudoku</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Free Printable Sudoku Puzzles (PDF)</h1>
        <p>
            Every booklet below is a free printable sudoku PDF generated straight from Suuudokuuu’s own puzzle generator and technique
            detectors — the same code that runs the app. Pick a difficulty for a {PRINTABLE_BOOKLET_SIZE}-puzzle booklet with solutions on
            the last pages, or grab the large-print set or a blank sudoku grid below. No sign-up, no ads, no watermark.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Prefer a screen? Play Suuudokuuu now
        </a>
        <h2>Printable sudoku booklets by difficulty</h2>
        <p>
            Each tier links to a full page with a live puzzle preview and the honest difficulty facts from our{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link>. The PDF itself only ever needs a
            printer.
        </p>
        <article className="printable-tier">
            <h3>
                <Link href={printableNewbieSudokuPageMetadata.path}>Newbie</Link>
            </h3>
            <p>
                {getDifficultyClueCount(DifficultyEnum.Newbie)} clues, solved with full houses and naked singles alone. See the{' '}
                <Link href={newbieSudokuPageMetadata.path}>Newbie sudoku lander</Link> to play it digitally.
            </p>
            <PrintableDownloadCard
                fileName="newbie.pdf"
                pageCount={TIER_BOOKLET_PAGE_COUNT}
                puzzleCount={PRINTABLE_BOOKLET_SIZE}
                title="Newbie Sudoku"
            />
        </article>
        <article className="printable-tier">
            <h3>
                <Link href={printableEasySudokuPageMetadata.path}>Easy</Link>
            </h3>
            <p>
                {getDifficultyClueCount(DifficultyEnum.Easy)} clues, and every puzzle needs at least one hidden single, never more. See the{' '}
                <Link href={easySudokuPageMetadata.path}>Easy sudoku lander</Link> to play it digitally.
            </p>
            <PrintableDownloadCard
                fileName="easy.pdf"
                pageCount={TIER_BOOKLET_PAGE_COUNT}
                puzzleCount={PRINTABLE_BOOKLET_SIZE}
                title="Easy Sudoku"
            />
        </article>
        <article className="printable-tier">
            <h3>
                <Link href={printableMediumSudokuPageMetadata.path}>Medium</Link>
            </h3>
            <p>
                {getDifficultyClueCount(DifficultyEnum.Medium)} clues, guaranteed to stall on singles and to yield to intersections and
                subsets. See the <Link href={mediumSudokuPageMetadata.path}>Medium sudoku lander</Link> to play it digitally.
            </p>
            <PrintableDownloadCard
                fileName="medium.pdf"
                pageCount={TIER_BOOKLET_PAGE_COUNT}
                puzzleCount={PRINTABLE_BOOKLET_SIZE}
                title="Medium Sudoku"
            />
        </article>
        <article className="printable-tier">
            <h3>
                <Link href={printableHardSudokuPageMetadata.path}>Hard</Link>
            </h3>
            <p>
                {getDifficultyClueCount(DifficultyEnum.Hard)} clues, guaranteed to stall on subsets and to yield to fish and wing patterns.
                See the <Link href={hardSudokuPageMetadata.path}>Hard sudoku lander</Link> to play it digitally.
            </p>
            <PrintableDownloadCard
                fileName="hard.pdf"
                pageCount={TIER_BOOKLET_PAGE_COUNT}
                puzzleCount={PRINTABLE_BOOKLET_SIZE}
                title="Hard Sudoku"
            />
        </article>
        <article className="printable-tier">
            <h3>
                <Link href={printableNightmareSudokuPageMetadata.path}>Nightmare</Link>
            </h3>
            <p>
                {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues, guaranteed to stall on wings and to yield to chains and coloring.
                See the <Link href={nightmareSudokuPageMetadata.path}>Nightmare sudoku lander</Link> to play it digitally.
            </p>
            <PrintableDownloadCard
                fileName="nightmare.pdf"
                pageCount={TIER_BOOKLET_PAGE_COUNT}
                puzzleCount={PRINTABLE_BOOKLET_SIZE}
                title="Nightmare Sudoku"
            />
        </article>
        <article className="printable-tier">
            <h3>
                <Link href={printableHellSudokuPageMetadata.path}>Hell</Link>
            </h3>
            <p>
                {getDifficultyClueCount(DifficultyEnum.Hell)} clues, drawn from our bundled, verified 17-clue corpus. See the{' '}
                <Link href={hellSudokuPageMetadata.path}>Hell sudoku lander</Link> to play it digitally.
            </p>
            <PrintableDownloadCard
                fileName="hell.pdf"
                pageCount={TIER_BOOKLET_PAGE_COUNT}
                puzzleCount={PRINTABLE_BOOKLET_SIZE}
                title="Hell Sudoku"
            />
        </article>
        <h2>Large print sudoku, printable</h2>
        <p>
            The large-print set uses the same Easy-tier logic as the booklet above, but at two puzzles per page instead of four, so every
            cell and digit prints noticeably bigger. It suits low-vision solvers, classroom handouts read from a distance, and anyone who
            finds the standard grid cramped on paper.
        </p>
        <PrintableDownloadCard
            fileName="large-print.pdf"
            pageCount={LARGE_PRINT_PAGE_COUNT}
            puzzleCount={PRINTABLE_LARGE_PRINT_SIZE}
            title="Large Print Sudoku"
        />
        <h2>Blank sudoku grid</h2>
        <p>
            No puzzle, just the grid: one full-page 9×9 grid for copying out a puzzle from a book or newspaper, plus a second page of four
            smaller grids for quick practice sheets. Useful for teachers building their own worksheets or for anyone transcribing a puzzle
            they found somewhere without a printer-friendly version.
        </p>
        <PrintableDownloadCard fileName="blank-grid.pdf" hasSolutions={false} pageCount={BLANK_GRID_PAGE_COUNT} title="Blank Sudoku Grid" />
        <h2>How to print these puzzles</h2>
        <p>
            Every PDF is set to US Letter and drawn with vector lines and text, so it prints crisply at any size. Open the file, print at
            100% scale (not “fit to page”, which can distort the grid on some printers), and print single-sided if you want to keep the
            solutions on separate sheets from the puzzles.
        </p>
        <h2>Printable sudoku FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>How do I print these puzzles?</FaqQuestion>
                <FaqAnswer>
                    Download the PDF and open it in any PDF reader, then print at 100% scale on US Letter paper. Every grid is drawn with
                    vector lines and standard PDF fonts, so there is nothing to rasterize and no quality loss at any print size.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Are the solutions included?</FaqQuestion>
                <FaqAnswer>
                    Yes. Every difficulty booklet and the large-print set carry the full solved grids on the last pages, generated by the
                    same solver that verifies every puzzle has exactly one solution before it ships.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I use them in a classroom?</FaqQuestion>
                <FaqAnswer>
                    Yes. Suuudokuuu’s code, including the generator behind these puzzles, is open source under the MIT license, and this
                    site places no restriction on printing or redistributing the PDFs — including handing them out in a classroom, a
                    tutoring session or a worksheet packet.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default PrintableSudokuPage;
