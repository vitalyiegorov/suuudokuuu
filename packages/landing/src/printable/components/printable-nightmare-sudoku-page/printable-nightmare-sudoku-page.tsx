import { Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableHardSudokuPageMetadata } from '../../../app/(en)/printable/hard/metadata';
import { printableHellSudokuPageMetadata } from '../../../app/(en)/printable/hell/metadata';
import { printableSudokuPageMetadata } from '../../../app/(en)/printable/metadata';
import { printableNightmareSudokuPageMetadata } from '../../../app/(en)/printable/nightmare/metadata';
import { nightmareSudokuPageMetadata } from '../../../app/(en)/sudoku/nightmare/metadata';
import { swordfishPageMetadata } from '../../../app/(en)/techniques/swordfish/metadata';
import { xyWingPageMetadata } from '../../../app/(en)/techniques/xy-wing/metadata';
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

const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Nightmare];
const nightmareReport = getTierTechniqueReport(DifficultyEnum.Nightmare);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
export const PrintableNightmareSudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const { t } = useLingui();
    const clueCount = getDifficultyClueCount(DifficultyEnum.Nightmare);
    const { sampleSize } = nightmareReport;
    const seRatingRange = formatSeRatingRange(nightmareReport);

    return (
        <main>
            <ArticleSchema metadata={printableNightmareSudokuPageMetadata} />
            <PageHeader metadata={printableNightmareSudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(printableSudokuPageMetadata)}>
                    <Trans>Printable sudoku</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Nightmare</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <p>
                <Trans>
                    Nightmare holds just {clueCount} clues, and it is the booklet where the printed page genuinely earns its keep. Every
                    puzzle in it was tested against a solver that already knows every fish and wing — including the{' '}
                    <Link href={buildLocalizedPagePath(swordfishPageMetadata)}>swordfish</Link> and the{' '}
                    <Link href={buildLocalizedPagePath(xyWingPageMetadata)}>XY-Wing</Link> — and kept only because that solver stalled. What
                    finishes them is chain reasoning, and a chain is far easier to build on paper, where you can pencil the links in and
                    follow them, than on a cramped screen. Our sample of {sampleSize} boards measures the tier at SE {seRatingRange}.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>
                            {clueCount} clues out of 81 cells, guaranteed to need at least one chain or coloring technique beyond every fish
                            and wing.
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
                            Our sample of {sampleSize} Nightmare boards measures SE {seRatingRange}.
                        </Trans>
                    </li>
                    <li>
                        <Trans>
                            A chain has no fixed shape, which is why marking it in pencil helps more here than at the easier tiers.
                        </Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <PuzzleBoard givens={PREVIEW_PUZZLE}>
                <Trans>Puzzle 1 from the Nightmare booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</Trans>
            </PuzzleBoard>
            <PrintableDownloadCard fileName="nightmare.pdf" title={t`Nightmare Sudoku`}>
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
                    The {PRINTABLE_BOOKLET_SIZE} puzzles print {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, sized so a chain crossing the
                    whole grid still fits comfortably on one sheet. Full solved grids close the booklet, which matters more here than at the
                    easier tiers — a single missed elimination partway along a chain compounds quickly, and a printed answer key catches it.
                    The measured spread behind these claims lives in the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>sudoku difficulty rating guide</Link>.
                </Trans>
            </p>
            <h2>
                <Trans>Why paper helps with chains</Trans>
            </h2>
            <p>
                <Trans>
                    A chain has no fixed shape: it is built link by link, and the only way to keep track of it is to write it down. On paper
                    you can mark each strong and weak link as you go, follow the alternation to the far end, and see immediately which cells
                    both ends can see. That is genuinely awkward on a phone screen you have to scroll. It is also the booklet where a wrong
                    elimination compounds worst: mark a candidate as gone that should have stayed, and every link after it is unsound, so
                    treat the solution pages as a real checkpoint rather than a formality.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    Chains falling into place? The{' '}
                    <Link href={buildLocalizedPagePath(printableHellSudokuPageMetadata)}>printable Hell sudoku booklet</Link> is the last
                    tier, where every puzzle needs a forcing chain. Step back to{' '}
                    <Link href={buildLocalizedPagePath(printableHardSudokuPageMetadata)}>printable Hard sudoku</Link> for fish and wings
                    only, or play Nightmare on a screen at the{' '}
                    <Link href={buildLocalizedPagePath(nightmareSudokuPageMetadata)}>Nightmare sudoku lander</Link>.
                </Trans>
            </p>
            <FaqPage>
                <FaqHeading>
                    <Trans>Printable Nightmare Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is the printable Nightmare sudoku PDF free?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>Yes, with no account and no watermark, and every puzzle’s solved grid is included at the back.</Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>What techniques does this Nightmare booklet require?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            At least one chain or coloring technique —{' '}
                            <Link href={buildLocalizedPagePath(swordfishPageMetadata)}>swordfish</Link>-level fish and{' '}
                            <Link href={buildLocalizedPagePath(xyWingPageMetadata)}>XY-Wing</Link>-level wings are not enough on their own —
                            on top of every fish and wing the Hard tier already needs.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Why is paper recommended for chain-based puzzles?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            A chain has no fixed shape and is built link by link, which is far easier to track by writing each strong and
                            weak link down than by scrolling a small screen.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many puzzles are in the printable Nightmare sudoku PDF?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            {PRINTABLE_BOOKLET_SIZE} puzzles across {PRINTABLE_BOOKLET_PAGE_COUNT} pages,{' '}
                            {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with the solved grids at the back.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={printableHellSudokuPageMetadata} previous={printableHardSudokuPageMetadata} />
        </main>
    );
};
