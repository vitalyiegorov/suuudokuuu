import { Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { largePrintSudokuPageMetadata } from '../../../app/(en)/large-print-sudoku/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableEasySudokuPageMetadata } from '../../../app/(en)/printable/easy/metadata';
import { printableHardSudokuPageMetadata } from '../../../app/(en)/printable/hard/metadata';
import { printableHellSudokuPageMetadata } from '../../../app/(en)/printable/hell/metadata';
import { printableInfinitySudokuPageMetadata } from '../../../app/(en)/printable/infinity/metadata';
import { printableMediumSudokuPageMetadata } from '../../../app/(en)/printable/medium/metadata';
import { printableSudokuPageMetadata } from '../../../app/(en)/printable/metadata';
import { printableNewbieSudokuPageMetadata } from '../../../app/(en)/printable/newbie/metadata';
import { printableNightmareSudokuPageMetadata } from '../../../app/(en)/printable/nightmare/metadata';
import { sudokuForSeniorsPageMetadata } from '../../../app/(en)/sudoku-for-seniors/metadata';
import { easySudokuPageMetadata } from '../../../app/(en)/sudoku/easy/metadata';
import { hardSudokuPageMetadata } from '../../../app/(en)/sudoku/hard/metadata';
import { hellSudokuPageMetadata } from '../../../app/(en)/sudoku/hell/metadata';
import { infinitySudokuPageMetadata } from '../../../app/(en)/sudoku/infinity/metadata';
import { mediumSudokuPageMetadata } from '../../../app/(en)/sudoku/medium/metadata';
import { newbieSudokuPageMetadata } from '../../../app/(en)/sudoku/newbie/metadata';
import { nightmareSudokuPageMetadata } from '../../../app/(en)/sudoku/nightmare/metadata';
import { getDifficultyClueCount } from '../../../difficulty/utils/get-difficulty-clue-count.util';
import { activateLocale } from '../../../i18n/utils/activate-locale.util';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { ItemListSchema } from '../../../seo/components/item-list-schema/item-list-schema';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildLocalizedPagePath } from '../../../seo/utils/build-localized-page-path.util';
import { PRINTABLE_BOOKLET_PUZZLES_PER_PAGE, PRINTABLE_LARGE_PRINT_PUZZLES_PER_PAGE } from '../../constants/printable-layout.constant';
import { PRINTABLE_BLANK_GRID_PAGE_COUNT, PRINTABLE_LARGE_PRINT_PAGE_COUNT } from '../../constants/printable-page-count.constant';
import { PRINTABLE_BOOKLET_SIZE, PRINTABLE_LARGE_PRINT_SIZE } from '../../constants/printable-sample.constant';
import { PrintableDownloadCard } from '../printable-download-card/printable-download-card';
import { PrintableDownloadFact } from '../printable-download-fact/printable-download-fact';
import { PrintableTierCard } from '../printable-tier-card/printable-tier-card';

import type { LocaleType } from '../../../seo/types/locale.type';

interface Props {
    locale: LocaleType;
}

const PRINTABLE_TIER_ITEMS = [
    printableNewbieSudokuPageMetadata,
    printableEasySudokuPageMetadata,
    printableMediumSudokuPageMetadata,
    printableHardSudokuPageMetadata,
    printableNightmareSudokuPageMetadata,
    printableHellSudokuPageMetadata,
    printableInfinitySudokuPageMetadata
];

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
export const PrintableSudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const { t } = useLingui();
    const newbieClueCount = getDifficultyClueCount(DifficultyEnum.Newbie);
    const easyClueCount = getDifficultyClueCount(DifficultyEnum.Easy);
    const mediumClueCount = getDifficultyClueCount(DifficultyEnum.Medium);
    const hardClueCount = getDifficultyClueCount(DifficultyEnum.Hard);
    const nightmareClueCount = getDifficultyClueCount(DifficultyEnum.Nightmare);

    return (
        <main>
            <PageHeader metadata={printableSudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Printable sudoku</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <ItemListSchema items={PRINTABLE_TIER_ITEMS} metadata={printableSudokuPageMetadata} />
            <p>
                <Trans>
                    Every booklet below is a free printable sudoku PDF built from the same puzzle sources the app plays — its generator and
                    technique detectors, and for Hell and Infinity its bundled, verified corpora. Pick a difficulty for a{' '}
                    {PRINTABLE_BOOKLET_SIZE}
                    -puzzle booklet with solutions on the last pages, or grab the large-print set or a blank sudoku grid below. No sign-up,
                    no ads, no watermark.
                </Trans>
            </p>
            <a className="hero__cta" href={SITE_PLAY_URL}>
                <Trans>Prefer a screen? Play Suuudokuuu now</Trans>
            </a>
            <h2>
                <Trans>Printable sudoku booklets by difficulty</Trans>
            </h2>
            <p>
                <Trans>
                    Each tier links to a full page with a live puzzle preview and the honest difficulty facts from our{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>sudoku difficulty rating guide</Link>. The PDF
                    itself only ever needs a printer.
                </Trans>
            </p>
            <PrintableTierCard
                fileName="newbie.pdf"
                href={buildLocalizedPagePath(printableNewbieSudokuPageMetadata)}
                label={t`Newbie`}
                title={t`Newbie Sudoku`}
            >
                <Trans>
                    {newbieClueCount} clues, solved with full houses and naked singles alone. See the{' '}
                    <Link href={buildLocalizedPagePath(newbieSudokuPageMetadata)}>Newbie sudoku lander</Link> to play it digitally.
                </Trans>
            </PrintableTierCard>
            <PrintableTierCard
                fileName="easy.pdf"
                href={buildLocalizedPagePath(printableEasySudokuPageMetadata)}
                label={t`Easy`}
                title={t`Easy Sudoku`}
            >
                <Trans>
                    {easyClueCount} clues, and every puzzle needs at least one hidden single, never more. See the{' '}
                    <Link href={buildLocalizedPagePath(easySudokuPageMetadata)}>Easy sudoku lander</Link> to play it digitally.
                </Trans>
            </PrintableTierCard>
            <PrintableTierCard
                fileName="medium.pdf"
                href={buildLocalizedPagePath(printableMediumSudokuPageMetadata)}
                label={t`Medium`}
                title={t`Medium Sudoku`}
            >
                <Trans>
                    {mediumClueCount} clues, guaranteed to stall on singles and to yield to intersections and subsets. See the{' '}
                    <Link href={buildLocalizedPagePath(mediumSudokuPageMetadata)}>Medium sudoku lander</Link> to play it digitally.
                </Trans>
            </PrintableTierCard>
            <PrintableTierCard
                fileName="hard.pdf"
                href={buildLocalizedPagePath(printableHardSudokuPageMetadata)}
                label={t`Hard`}
                title={t`Hard Sudoku`}
            >
                <Trans>
                    {hardClueCount} clues, guaranteed to stall on subsets and to yield to fish and wing patterns. See the{' '}
                    <Link href={buildLocalizedPagePath(hardSudokuPageMetadata)}>Hard sudoku lander</Link> to play it digitally.
                </Trans>
            </PrintableTierCard>
            <PrintableTierCard
                fileName="nightmare.pdf"
                href={buildLocalizedPagePath(printableNightmareSudokuPageMetadata)}
                label={t`Nightmare`}
                title={t`Nightmare Sudoku`}
            >
                <Trans>
                    {nightmareClueCount} clues, guaranteed to stall on wings and to yield to chains and coloring. See the{' '}
                    <Link href={buildLocalizedPagePath(nightmareSudokuPageMetadata)}>Nightmare sudoku lander</Link> to play it digitally.
                </Trans>
            </PrintableTierCard>
            <PrintableTierCard
                fileName="hell.pdf"
                href={buildLocalizedPagePath(printableHellSudokuPageMetadata)}
                label={t`Hell`}
                title={t`Hell Sudoku`}
            >
                <Trans>
                    Every puzzle needs a forcing chain, drawn from our bundled, verified Hell corpus. See the{' '}
                    <Link href={buildLocalizedPagePath(hellSudokuPageMetadata)}>Hell sudoku lander</Link> to play it digitally.
                </Trans>
            </PrintableTierCard>
            <PrintableTierCard
                fileName="infinity.pdf"
                href={buildLocalizedPagePath(printableInfinitySudokuPageMetadata)}
                label={t`Infinity`}
                title={t`Infinity Sudoku`}
            >
                <Trans>
                    Record puzzles such as Everest and AI Escargot, printed as originally published. See the{' '}
                    <Link href={buildLocalizedPagePath(infinitySudokuPageMetadata)}>Infinity sudoku lander</Link> to play them digitally.
                </Trans>
            </PrintableTierCard>
            <h2>
                <Trans>Large print sudoku, printable</Trans>
            </h2>
            <p>
                <Trans>
                    The large-print set uses the same Easy-tier logic as the booklet above, but at {PRINTABLE_LARGE_PRINT_PUZZLES_PER_PAGE}{' '}
                    puzzles per page instead of {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE}, so every cell and digit prints noticeably bigger. It
                    suits low-vision solvers, classroom handouts read from a distance, and anyone who finds the standard grid cramped on
                    paper. See the <Link href={buildLocalizedPagePath(largePrintSudokuPageMetadata)}>large print sudoku page</Link> for
                    printing tips and the on-screen alternative, or the{' '}
                    <Link href={buildLocalizedPagePath(sudokuForSeniorsPageMetadata)}>sudoku for seniors</Link> guide for the full
                    comfort-focused rundown.
                </Trans>
            </p>
            <PrintableDownloadCard fileName="large-print.pdf" title={t`Large Print Sudoku`}>
                <PrintableDownloadFact>
                    <Trans>{PRINTABLE_LARGE_PRINT_SIZE} puzzles</Trans>
                </PrintableDownloadFact>
                <PrintableDownloadFact>
                    <Trans>{PRINTABLE_LARGE_PRINT_PAGE_COUNT} pages</Trans>
                </PrintableDownloadFact>
                <PrintableDownloadFact>
                    <Trans>Solutions included on the last pages</Trans>
                </PrintableDownloadFact>
            </PrintableDownloadCard>
            <h2>
                <Trans>Blank sudoku grid</Trans>
            </h2>
            <p>
                <Trans>
                    No puzzle, just the grid: one full-page 9×9 grid for copying out a puzzle from a book or newspaper, plus a second page
                    of four smaller grids for quick practice sheets. Useful for teachers building their own worksheets or for anyone
                    transcribing a puzzle they found somewhere without a printer-friendly version.
                </Trans>
            </p>
            <PrintableDownloadCard fileName="blank-grid.pdf" title={t`Blank Sudoku Grid`}>
                <PrintableDownloadFact>
                    <Trans>{PRINTABLE_BLANK_GRID_PAGE_COUNT} pages</Trans>
                </PrintableDownloadFact>
            </PrintableDownloadCard>
            <h2>
                <Trans>How to print these puzzles</Trans>
            </h2>
            <p>
                <Trans>
                    Every PDF is set to US Letter and drawn with vector lines and text, so it prints crisply at any size. Open the file,
                    print at 100% scale (not “fit to page”, which can distort the grid on some printers), and print single-sided if you want
                    to keep the solutions on separate sheets from the puzzles.
                </Trans>
            </p>
            <FaqPage>
                <FaqHeading>
                    <Trans>Printable sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>How do I print these puzzles?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Download the PDF and open it in any PDF reader, then print at 100% scale on US Letter paper. Every grid is drawn
                            with vector lines and standard PDF fonts, so there is nothing to rasterize and no quality loss at any print
                            size.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Are the solutions included?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Yes. Every difficulty booklet and the large-print set carry the full solved grids on the last pages, generated
                            by the same solver that verifies every puzzle has exactly one solution before it ships.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Can I use them in a classroom?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Yes. Suuudokuuu’s code, including the generator behind these puzzles, is open source under the MIT license, and
                            this site places no restriction on printing or redistributing the PDFs — including handing them out in a
                            classroom, a tutoring session or a worksheet packet.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
        </main>
    );
};
