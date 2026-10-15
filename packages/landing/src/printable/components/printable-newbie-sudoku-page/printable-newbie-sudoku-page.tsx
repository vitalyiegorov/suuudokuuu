import { Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableEasySudokuPageMetadata } from '../../../app/(en)/printable/easy/metadata';
import { printableSudokuPageMetadata } from '../../../app/(en)/printable/metadata';
import { printableNewbieSudokuPageMetadata } from '../../../app/(en)/printable/newbie/metadata';
import { newbieSudokuPageMetadata } from '../../../app/(en)/sudoku/newbie/metadata';
import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
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

const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Newbie];
const newbieReport = getTierTechniqueReport(DifficultyEnum.Newbie);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
export const PrintableNewbieSudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const { t } = useLingui();
    const clueCount = getDifficultyClueCount(DifficultyEnum.Newbie);
    const { sampleSize } = newbieReport;
    const seRatingRange = formatSeRatingRange(newbieReport);

    return (
        <main>
            <ArticleSchema metadata={printableNewbieSudokuPageMetadata} />
            <PageHeader metadata={printableNewbieSudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(printableSudokuPageMetadata)}>
                    <Trans>Printable sudoku</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Newbie</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <p>
                <Trans>
                    The printable Newbie Sudoku booklet is a free PDF of {clueCount}-clue puzzles where every blank is reachable with a full
                    house or a naked single — a property each puzzle was checked for before it went into the PDF. It is the booklet to hand
                    a first-time solver, a classroom just learning the rules, or anyone who wants a puzzle that never demands a second
                    guess.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>{clueCount} clues out of 81 cells, solvable with full houses and naked singles alone.</Trans>
                    </li>
                    <li>
                        <Trans>
                            {PRINTABLE_BOOKLET_SIZE} puzzles, printed {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with a full solution
                            key.
                        </Trans>
                    </li>
                    <li>
                        <Trans>
                            Our sample of {sampleSize} Newbie boards measures SE {seRatingRange}.
                        </Trans>
                    </li>
                    <li>
                        <Trans>No pencil marks, no elimination logic and no guessing required for any puzzle in the booklet.</Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <PuzzleBoard givens={PREVIEW_PUZZLE}>
                <Trans>Puzzle 1 from the Newbie booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</Trans>
            </PuzzleBoard>
            <PrintableDownloadCard fileName="newbie.pdf" title={t`Newbie Sudoku`}>
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
                    The PDF opens with a cover page stating the puzzle and page counts, moves into {PRINTABLE_BOOKLET_SIZE} puzzles printed{' '}
                    {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, and closes with every solved grid on the final pages so answers never
                    sit next to an unsolved puzzle. Every grid is drawn with vector lines and the standard PDF Helvetica font, so it stays
                    sharp at any print size and never depends on a scanned image. Our published sample of {sampleSize} Newbie boards
                    measures SE {seRatingRange} — numbers the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>sudoku difficulty rating guide</Link> measures
                    directly rather than assumes.
                </Trans>
            </p>
            <h2>
                <Trans>Good for a first sudoku habit</Trans>
            </h2>
            <p>
                <Trans>
                    This is the booklet to print for a short daily habit rather than a long sitting: fold it into a notebook, work one grid
                    at a time, and there is never a candidate to write down or a pair to track across the row. It also suits a classroom
                    introducing the rules for the first time, since a full class can finish a puzzle in the same short window without anyone
                    stalling on an intersection they have not been taught yet. The {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE}-per-page layout
                    still leaves each grid large enough to write in comfortably, even for a child’s handwriting, and the answer key at the
                    back means a teacher never has to solve the sheet themselves to check it.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    Once full houses and naked singles feel automatic, step up to the{' '}
                    <Link href={buildLocalizedPagePath(printableEasySudokuPageMetadata)}>printable Easy sudoku booklet</Link>, which adds
                    exactly one technique on top: the hidden single. To play Newbie puzzles on a screen instead, visit the{' '}
                    <Link href={buildLocalizedPagePath(newbieSudokuPageMetadata)}>Newbie sudoku lander</Link>. For the full technique ladder
                    and the measured data behind these claims, see the{' '}
                    <Link href={buildLocalizedPagePath(techniquesPageMetadata)}>technique index</Link> and the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>sudoku difficulty rating guide</Link>.
                </Trans>
            </p>
            <FaqPage>
                <FaqHeading>
                    <Trans>Printable Newbie Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is this printable Newbie sudoku booklet free?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Yes. The PDF downloads free, with no account and no watermark, and includes a full solution key for every
                            puzzle.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many puzzles are in the printable Newbie sudoku PDF?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            {PRINTABLE_BOOKLET_SIZE} puzzles across {PRINTABLE_BOOKLET_PAGE_COUNT} pages, printed{' '}
                            {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page with the solved grids at the back.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is Newbie the right level for a child or a first-time solver?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Yes. Every puzzle in the booklet is solvable with a full house or a naked single alone, so no candidate marking
                            or elimination logic is ever required.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Can I print this Newbie booklet in large print?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            The standard PDF already uses a generous {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE}-puzzles-per-page layout. For
                            bigger cells specifically, see the{' '}
                            <Link href={buildLocalizedPagePath(printableEasySudokuPageMetadata)}>printable Easy sudoku booklet</Link>, which
                            is also the source tier for our large-print PDF.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={printableEasySudokuPageMetadata} />
        </main>
    );
};
