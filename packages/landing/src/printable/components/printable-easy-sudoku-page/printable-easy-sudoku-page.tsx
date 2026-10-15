import { Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableEasySudokuPageMetadata } from '../../../app/(en)/printable/easy/metadata';
import { printableMediumSudokuPageMetadata } from '../../../app/(en)/printable/medium/metadata';
import { printableSudokuPageMetadata } from '../../../app/(en)/printable/metadata';
import { printableNewbieSudokuPageMetadata } from '../../../app/(en)/printable/newbie/metadata';
import { easySudokuPageMetadata } from '../../../app/(en)/sudoku/easy/metadata';
import { hiddenSinglePageMetadata } from '../../../app/(en)/techniques/hidden-single/metadata';
import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import { getDifficultyClueCount } from '../../../difficulty/utils/get-difficulty-clue-count.util';
import { activateLocale } from '../../../i18n/utils/activate-locale.util';
import { PuzzleBoard } from '../../../puzzle/components/puzzle-board/puzzle-board';
import { formatSeRatingRange } from '../../../rating/utils/format-se-rating-range.util';
import { getTierTechniqueReport } from '../../../rating/utils/get-tier-technique-reports.util';
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { buildLocalizedPagePath } from '../../../seo/utils/build-localized-page-path.util';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { PRINTABLE_BOOKLET_PUZZLES_PER_PAGE } from '../../constants/printable-layout.constant';
import { PRINTABLE_BOOKLET_PAGE_COUNT } from '../../constants/printable-page-count.constant';
import { PRINTABLE_BOOKLET_PUZZLES, PRINTABLE_BOOKLET_SIZE, PRINTABLE_LARGE_PRINT_SIZE } from '../../constants/printable-sample.constant';
import { PrintableDownloadCard } from '../printable-download-card/printable-download-card';
import { PrintableDownloadFact } from '../printable-download-fact/printable-download-fact';

import type { LocaleType } from '../../../seo/types/locale.type';

interface Props {
    locale: LocaleType;
}

const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Easy];
const easyReport = getTierTechniqueReport(DifficultyEnum.Easy);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
export const PrintableEasySudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const { t } = useLingui();
    const clueCount = getDifficultyClueCount(DifficultyEnum.Easy);
    const { sampleSize } = easyReport;
    const seRatingRange = formatSeRatingRange(easyReport);

    return (
        <main>
            <ArticleSchema metadata={printableEasySudokuPageMetadata} />
            <PageHeader metadata={printableEasySudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(printableSudokuPageMetadata)}>
                    <Trans>Printable sudoku</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Easy</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <p>
                <Trans>
                    Easy starts at {clueCount} clues, six below Newbie, and adds exactly one technique: every puzzle in this booklet needs
                    at least one <Link href={buildLocalizedPagePath(hiddenSinglePageMetadata)}>hidden single</Link>, and none of them needs
                    anything harder. That single extra pattern is what makes this the booklet people print for a relaxed coffee-break solve
                    rather than a teaching aid. It is also the source tier for our large-print PDF, sampled at {PRINTABLE_LARGE_PRINT_SIZE}{' '}
                    puzzles for readers who want bigger cells.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>{clueCount} clues out of 81 cells, guaranteed to need a hidden single and nothing harder.</Trans>
                    </li>
                    <li>
                        <Trans>
                            {PRINTABLE_BOOKLET_SIZE} puzzles, printed {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with a full solution
                            key.
                        </Trans>
                    </li>
                    <li>
                        <Trans>
                            Our sample of {sampleSize} Easy boards measures SE {seRatingRange}.
                        </Trans>
                    </li>
                    <li>
                        <Trans>Also the source tier for the large-print PDF, sampled at {PRINTABLE_LARGE_PRINT_SIZE} puzzles.</Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <PuzzleBoard givens={PREVIEW_PUZZLE}>
                <Trans>Puzzle 1 from the Easy booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</Trans>
            </PuzzleBoard>
            <PrintableDownloadCard fileName="easy.pdf" title={t`Easy Sudoku`}>
                <PrintableDownloadFact>
                    <Trans>{PRINTABLE_BOOKLET_SIZE} puzzles</Trans>
                </PrintableDownloadFact>
                <PrintableDownloadFact>
                    <Trans>{PRINTABLE_BOOKLET_PAGE_COUNT} pages</Trans>
                </PrintableDownloadFact>
                <PrintableDownloadFact>
                    <Trans>Solutions included on the last pages</Trans>
                </PrintableDownloadFact>
            </PrintableDownloadCard>
            <h2>
                <Trans>What is inside the booklet</Trans>
            </h2>
            <p>
                <Trans>
                    A cover page states the puzzle and page counts up front, then {PRINTABLE_BOOKLET_SIZE} puzzles print{' '}
                    {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page so a single sheet holds {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} complete
                    grids. The last pages hold every solved grid at the same layout, so checking an answer never means hunting through a
                    different page format. The whole file is vector graphics and a standard PDF font, so it prints cleanly at any size a
                    printer supports. Our published sample of {sampleSize} Easy boards measures SE {seRatingRange} — numbers the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>sudoku difficulty rating guide</Link> measures
                    directly rather than assumes.
                </Trans>
            </p>
            <h2>
                <Trans>Good for a relaxed solve</Trans>
            </h2>
            <p>
                <Trans>
                    Easy is the booklet people reach for when they want to finish a puzzle without stopping to think hard about it — on a
                    train, over a coffee break, or as a wind-down before bed. Every deduction still reads off the board rather than off a
                    candidate grid, so there is rarely a reason to write a candidate in the margin; the hidden single asks you to scan a
                    whole unit rather than one cell, which is a change of habit and not of difficulty. That makes it a natural size for
                    printing several at once and working through a small stack over a week, since no single puzzle demands the concentration
                    a Medium or Hard grid does.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    Ready for intersections and subsets to start mattering? Move on to the{' '}
                    <Link href={buildLocalizedPagePath(printableMediumSudokuPageMetadata)}>printable Medium sudoku booklet</Link>, or step
                    back to <Link href={buildLocalizedPagePath(printableNewbieSudokuPageMetadata)}>printable Newbie sudoku</Link> for an
                    even gentler grid. To play Easy puzzles on a screen instead, visit the{' '}
                    <Link href={buildLocalizedPagePath(easySudokuPageMetadata)}>Easy sudoku lander</Link>.
                </Trans>
            </p>
            <FaqPage>
                <FaqHeading>
                    <Trans>Printable Easy Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is the printable Easy sudoku PDF free?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>Yes, with no account and no watermark, and every puzzle’s solved grid is included at the back.</Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>What technique does an Easy sudoku booklet require?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            At least one <Link href={buildLocalizedPagePath(hiddenSinglePageMetadata)}>hidden single</Link> per puzzle, on
                            top of the full houses and naked singles Newbie already uses, and nothing harder.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Does Suuudokuuu offer a large-print version of this booklet?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Yes. Easy is the source tier for the large-print PDF, sampled at {PRINTABLE_LARGE_PRINT_SIZE} puzzles with
                            bigger cells for readers who want more room to write.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many puzzles are in the printable Easy sudoku PDF?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            {PRINTABLE_BOOKLET_SIZE} puzzles across {PRINTABLE_BOOKLET_PAGE_COUNT} pages,{' '}
                            {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with the solved grids at the back.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={printableMediumSudokuPageMetadata} previous={printableNewbieSudokuPageMetadata} />
        </main>
    );
};
