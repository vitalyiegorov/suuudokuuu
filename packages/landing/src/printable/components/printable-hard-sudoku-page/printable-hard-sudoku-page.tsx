import { Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableHardSudokuPageMetadata } from '../../../app/(en)/printable/hard/metadata';
import { printableMediumSudokuPageMetadata } from '../../../app/(en)/printable/medium/metadata';
import { printableSudokuPageMetadata } from '../../../app/(en)/printable/metadata';
import { printableNightmareSudokuPageMetadata } from '../../../app/(en)/printable/nightmare/metadata';
import { hardSudokuPageMetadata } from '../../../app/(en)/sudoku/hard/metadata';
import { xWingPageMetadata } from '../../../app/(en)/techniques/x-wing/metadata';
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
import { TechniqueLink } from '../../../techniques/components/technique-link/technique-link';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { PRINTABLE_BOOKLET_PUZZLES_PER_PAGE } from '../../constants/printable-layout.constant';
import { PRINTABLE_BOOKLET_PAGE_COUNT } from '../../constants/printable-page-count.constant';
import { PRINTABLE_BOOKLET_PUZZLES, PRINTABLE_BOOKLET_SIZE } from '../../constants/printable-sample.constant';
import { PrintableDownloadCard } from '../printable-download-card/printable-download-card';
import { PrintableDownloadFact } from '../printable-download-fact/printable-download-fact';

import type { LocaleType } from '../../../seo/types/locale.type';

interface Props {
    locale: LocaleType;
}

const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Hard];
const hardReport = getTierTechniqueReport(DifficultyEnum.Hard);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
export const PrintableHardSudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const { t } = useLingui();
    const clueCount = getDifficultyClueCount(DifficultyEnum.Hard);
    const { sampleSize } = hardReport;
    const seRatingRange = formatSeRatingRange(hardReport);

    return (
        <main>
            <ArticleSchema metadata={printableHardSudokuPageMetadata} />
            <PageHeader metadata={printableHardSudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(printableSudokuPageMetadata)}>
                    <Trans>Printable sudoku</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Hard</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <p>
                <Trans>
                    Hard drops to {clueCount} clues, and this is the first printable booklet on the site where subsets alone will not carry
                    you to the end. Every puzzle in it was tested against a solver that already knows every intersection and every subset,
                    and kept only because that solver stalled. What finishes them is a fish or a wing: the{' '}
                    <Link href={buildLocalizedPagePath(xWingPageMetadata)}>X-Wing</Link> and its larger and finned relatives, or one of the
                    bivalue wing patterns.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>
                            {clueCount} clues out of 81 cells, guaranteed to need at least one fish or wing pattern beyond every subset.
                        </Trans>
                    </li>
                    <li>
                        <Trans>
                            {PRINTABLE_BOOKLET_SIZE} puzzles, printed {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with a full solution
                            key.
                        </Trans>
                    </li>
                    <li>
                        <Trans>
                            Our sample of {sampleSize} Hard boards measures SE {seRatingRange}.
                        </Trans>
                    </li>
                    <li>
                        <Trans>Nothing in the booklet needs a chain — that starts at the Nightmare tier.</Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <PuzzleBoard givens={PREVIEW_PUZZLE}>
                <Trans>Puzzle 1 from the Hard booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</Trans>
            </PuzzleBoard>
            <PrintableDownloadCard fileName="hard.pdf" title={t`Hard Sudoku`}>
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
                    Our published sample of {sampleSize} Hard boards measures the tier at SE {seRatingRange}, with the{' '}
                    <TechniqueLink technique={hardReport.typicalHardestTechnique} /> as the most common hardest step — numbers the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>sudoku difficulty rating guide</Link> measures
                    directly rather than assumes. The {PRINTABLE_BOOKLET_SIZE} puzzles here print {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a
                    page with room to mark candidates, and the solved grids on the closing pages let you confirm a fish elimination actually
                    held.
                </Trans>
            </p>
            <h2>
                <Trans>Verifying fish and wings on paper</Trans>
            </h2>
            <p>
                <Trans>
                    A fish is easy to miss on a screen where only a handful of cells are visible at once, because the pattern lives in where
                    one digit can go across two, three or four whole lines at the same time. On a full printed grid you can mark that
                    digit’s remaining positions down a column and read the shape off the page. Wings need the opposite view — a few bivalue
                    cells that see each other across the grid — and circling them in pencil makes the overlap obvious. Because both families
                    are easy to apply incorrectly the first few times, checking your work against the solution pages at the back is worth
                    doing every time until the shape becomes automatic.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    Spotting fish and wings reliably? Move up to the{' '}
                    <Link href={buildLocalizedPagePath(printableNightmareSudokuPageMetadata)}>printable Nightmare sudoku booklet</Link> for
                    chains and coloring. Step back to{' '}
                    <Link href={buildLocalizedPagePath(printableMediumSudokuPageMetadata)}>printable Medium sudoku</Link> for intersections
                    and subsets only, or play Hard on a screen at the{' '}
                    <Link href={buildLocalizedPagePath(hardSudokuPageMetadata)}>Hard sudoku lander</Link>.
                </Trans>
            </p>
            <FaqPage>
                <FaqHeading>
                    <Trans>Printable Hard Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is the printable Hard sudoku PDF free?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>Yes, with no account and no watermark, and every puzzle’s solved grid is included at the back.</Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>What techniques does this Hard booklet require?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            At least one fish (<Link href={buildLocalizedPagePath(xWingPageMetadata)}>X-Wing</Link> and its larger and
                            finned relatives) or one bivalue wing pattern, on top of every intersection and subset the easier booklets
                            already need.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How is a fish or wing easier to verify on paper?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            A fish spans whole rows or columns at once, which is easier to trace by marking a digit’s remaining positions
                            down a printed column than by scrolling a screen. Wings need the opposite view — a few bivalue cells seen at a
                            glance.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many puzzles are in the printable Hard sudoku PDF?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            {PRINTABLE_BOOKLET_SIZE} puzzles across {PRINTABLE_BOOKLET_PAGE_COUNT} pages,{' '}
                            {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with the solved grids at the back.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={printableNightmareSudokuPageMetadata} previous={printableMediumSudokuPageMetadata} />
        </main>
    );
};
