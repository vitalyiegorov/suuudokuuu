import { Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableEasySudokuPageMetadata } from '../../../app/(en)/printable/easy/metadata';
import { printableHardSudokuPageMetadata } from '../../../app/(en)/printable/hard/metadata';
import { printableMediumSudokuPageMetadata } from '../../../app/(en)/printable/medium/metadata';
import { printableSudokuPageMetadata } from '../../../app/(en)/printable/metadata';
import { mediumSudokuPageMetadata } from '../../../app/(en)/sudoku/medium/metadata';
import { boxLineReductionPageMetadata } from '../../../app/(en)/techniques/box-line-reduction/metadata';
import { pointingPairPageMetadata } from '../../../app/(en)/techniques/pointing-pair/metadata';
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
import { PRINTABLE_BOOKLET_PUZZLES, PRINTABLE_BOOKLET_SIZE } from '../../constants/printable-sample.constant';
import { PrintableDownloadCard } from '../printable-download-card/printable-download-card';
import { PrintableDownloadFact } from '../printable-download-fact/printable-download-fact';

import type { LocaleType } from '../../../seo/types/locale.type';

interface Props {
    locale: LocaleType;
}

const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Medium];
const mediumReport = getTierTechniqueReport(DifficultyEnum.Medium);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
export const PrintableMediumSudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const { t } = useLingui();
    const clueCount = getDifficultyClueCount(DifficultyEnum.Medium);
    const { sampleSize } = mediumReport;
    const seRatingRange = formatSeRatingRange(mediumReport);

    return (
        <main>
            <ArticleSchema metadata={printableMediumSudokuPageMetadata} />
            <PageHeader metadata={printableMediumSudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(printableSudokuPageMetadata)}>
                    <Trans>Printable sudoku</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Medium</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <p>
                <Trans>
                    At {clueCount} clues out of 81 cells, this booklet is the first one worth solving with a pencil. Singles carry a Medium
                    grid part of the way, but every puzzle in it provably stalls on them — that is the test each board had to fail to be
                    printed here — until you spot a <Link href={buildLocalizedPagePath(pointingPairPageMetadata)}>pointing pair</Link> or a{' '}
                    <Link href={buildLocalizedPagePath(boxLineReductionPageMetadata)}>box-line reduction</Link>, an intersection between a
                    box and a line that only eliminates candidates, never places a digit outright. Nothing in the booklet needs a fish, a
                    wing or a chain.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>
                            {clueCount} clues out of 81 cells, guaranteed to stall on singles and yield to an intersection or a subset.
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
                            Our sample of {sampleSize} Medium boards measures SE {seRatingRange}.
                        </Trans>
                    </li>
                    <li>
                        <Trans>Nothing in the booklet needs a fish, a wing or a chain.</Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <PuzzleBoard givens={PREVIEW_PUZZLE}>
                <Trans>Puzzle 1 from the Medium booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</Trans>
            </PuzzleBoard>
            <PrintableDownloadCard fileName="medium.pdf" title={t`Medium Sudoku`}>
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
                    Print space here matters more than at the easier tiers, because intersections and pairs work by marking candidates in
                    the margins. The {PRINTABLE_BOOKLET_SIZE} puzzles print {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page at full cell
                    size, leaving enough room around each digit to pencil in the small numbers an intersection or a pair reasons over.
                    Solved grids close out the file so you can check your candidate marks against a confirmed answer. Our published sample
                    of {sampleSize} Medium boards measures SE {seRatingRange} — numbers the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>sudoku difficulty rating guide</Link> measures
                    directly rather than assumes.
                </Trans>
            </p>
            <h2>
                <Trans>Tips for pencil-mark solving</Trans>
            </h2>
            <p>
                <Trans>
                    An intersection or a pair only becomes visible once you can see every remaining candidate in a row, column or box at a
                    glance, which is why paper genuinely helps here more than a screen does: write small digits in the corner of each blank
                    cell, then scan a line for a digit trapped inside one box, or two cells sharing exactly two candidates between them.
                    Neither pattern places a digit by itself — each one only removes candidates — so expect to mark a few eliminations
                    before a fresh naked single actually appears. Working in pencil rather than pen means a wrong mark costs nothing to
                    erase.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    When intersections start feeling automatic, move up to the{' '}
                    <Link href={buildLocalizedPagePath(printableHardSudokuPageMetadata)}>printable Hard sudoku booklet</Link> for fish and
                    wing patterns. Drop back to{' '}
                    <Link href={buildLocalizedPagePath(printableEasySudokuPageMetadata)}>printable Easy sudoku</Link> for a singles-only
                    warm-up, or play Medium on a screen at the{' '}
                    <Link href={buildLocalizedPagePath(mediumSudokuPageMetadata)}>Medium sudoku lander</Link>.
                </Trans>
            </p>
            <FaqPage>
                <FaqHeading>
                    <Trans>Printable Medium Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is the printable Medium sudoku PDF free?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>Yes, with no account and no watermark, and every puzzle’s solved grid is included at the back.</Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>What techniques does this Medium booklet require?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            At least one <Link href={buildLocalizedPagePath(pointingPairPageMetadata)}>pointing pair</Link>,{' '}
                            <Link href={buildLocalizedPagePath(boxLineReductionPageMetadata)}>box-line reduction</Link>, or a naked or
                            hidden pair, on top of the singles the easier booklets already use. Nothing needs a fish, a wing or a chain.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Why does this booklet leave more room around each digit?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Intersections and pairs are found by marking every remaining candidate in a unit, so the layout leaves space in
                            each cell specifically for those pencil marks.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many puzzles are in the printable Medium sudoku PDF?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            {PRINTABLE_BOOKLET_SIZE} puzzles across {PRINTABLE_BOOKLET_PAGE_COUNT} pages,{' '}
                            {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with the solved grids at the back.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={printableHardSudokuPageMetadata} previous={printableEasySudokuPageMetadata} />
        </main>
    );
};
