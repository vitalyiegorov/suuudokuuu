import { Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { SE_RATING_CEILING } from '@suuudokuuu/rating';
import Link from 'next/link';

import { hardestSudokuPuzzlesPageMetadata } from '../../../app/(en)/hardest-sudoku-puzzles/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableHellSudokuPageMetadata } from '../../../app/(en)/printable/hell/metadata';
import { printableInfinitySudokuPageMetadata } from '../../../app/(en)/printable/infinity/metadata';
import { printableSudokuPageMetadata } from '../../../app/(en)/printable/metadata';
import { infinitySudokuPageMetadata } from '../../../app/(en)/sudoku/infinity/metadata';
import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import {
    INFINITY_HIGHEST_RATING,
    INFINITY_LOWEST_RATING,
    INFINITY_MAXIMUM_GIVEN_COUNT,
    INFINITY_MINIMUM_GIVEN_COUNT
} from '../../../difficulty/constants/infinity-corpus.constant';
import { activateLocale } from '../../../i18n/utils/activate-locale.util';
import { PuzzleBoard } from '../../../puzzle/components/puzzle-board/puzzle-board';
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

const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Infinity];
const lowestRatingLabel = INFINITY_LOWEST_RATING.toFixed(1);
const highestRatingLabel = INFINITY_HIGHEST_RATING.toFixed(1);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
export const PrintableInfinitySudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const { t } = useLingui();

    return (
        <main>
            <ArticleSchema metadata={printableInfinitySudokuPageMetadata} />
            <PageHeader metadata={printableInfinitySudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(printableSudokuPageMetadata)}>
                    <Trans>Printable sudoku</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Infinity</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <p>
                <Trans>
                    This booklet prints {PRINTABLE_BOOKLET_SIZE} of the hardest sudoku puzzles ever published, taken from Suuudokuuu’s
                    Infinity tier: Arto Inkala’s Everest, AI Escargot, Platinum Blonde, Golden Nugget and other record grids, each with a
                    published SE (Sudoku Explainer) rating between {lowestRatingLabel} and {highestRatingLabel}. Every one has exactly one
                    solution, and the solved grids are at the back.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>
                            {PRINTABLE_BOOKLET_SIZE} record puzzles, printed {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with a full
                            solution key.
                        </Trans>
                    </li>
                    <li>
                        <Trans>Includes Everest (SE 11.9), Platinum Blonde (SE 10.9) and AI Escargot (SE 10.6).</Trans>
                    </li>
                    <li>
                        <Trans>
                            Infinity puzzles carry {INFINITY_MINIMUM_GIVEN_COUNT} to {INFINITY_MAXIMUM_GIVEN_COUNT} clues and are checked
                            for a single solution by two independent solving algorithms.
                        </Trans>
                    </li>
                    <li>
                        <Trans>The ratings are the values independent raters publish, not our own measurements.</Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <PuzzleBoard givens={PREVIEW_PUZZLE}>
                <Trans>Puzzle 1 from the Infinity booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</Trans>
            </PuzzleBoard>
            <PrintableDownloadCard fileName="infinity.pdf" title={t`Infinity Sudoku`}>
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
                    The puzzles are printed exactly as they were published, with no reshuffling, so you can compare your grid with the
                    originals discussed on the{' '}
                    <Link href={buildLocalizedPagePath(hardestSudokuPuzzlesPageMetadata)}>hardest sudoku puzzles</Link> page. They print{' '}
                    {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page with room for a full set of pencil marks, which you will need: at this
                    level most solvers keep every candidate written in and test chains on a separate sheet. The final pages hold the
                    completed grids, so you can check a long line of reasoning without having to finish it first.
                </Trans>
            </p>
            <h2>
                <Trans>How hard these puzzles are</Trans>
            </h2>
            <p>
                <Trans>
                    Very. Every puzzle in the Infinity set has a published SE rating of at least {lowestRatingLabel}, well past anything the
                    generated tiers or the Hell corpus produce. Our own rater stops pricing the SE ladder at {SE_RATING_CEILING}, so the
                    figures quoted here come from independent raters, and our technique engine cannot finish any of these grids on its own.
                    Expect to need long forcing chains and forcing nets, and expect a single puzzle to take far longer than anything else on
                    this site.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    Want to warm up first? The{' '}
                    <Link href={buildLocalizedPagePath(printableHellSudokuPageMetadata)}>printable Hell sudoku booklet</Link> holds
                    forcing-chain puzzles that are hard but still within reach of our technique ladder. Prefer a screen? Play the same
                    record puzzles on the <Link href={buildLocalizedPagePath(infinitySudokuPageMetadata)}>Infinity sudoku lander</Link>,
                    where each game reshuffles the grid, or browse every booklet on the{' '}
                    <Link href={buildLocalizedPagePath(printableSudokuPageMetadata)}>printable sudoku hub</Link>.
                </Trans>
            </p>
            <FaqPage>
                <FaqHeading>
                    <Trans>Printable Infinity Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is the printable Infinity sudoku PDF free?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>Yes, with no account and no watermark, and every puzzle’s solved grid is included at the back.</Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is AI Escargot in the printable booklet?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Yes, along with Everest, Platinum Blonde and Golden Nugget. The booklet prints the puzzles as they were
                            originally published.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Who rated these puzzles?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            The SE ratings are the values independent raters and the sudoku-solving community publish. Suuudokuuu’s own
                            rater reports {SE_RATING_CEILING} with a ceiling flag for anything harder than that, so it does not produce its
                            own figure for these puzzles.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many puzzles are in the printable Infinity sudoku PDF?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            {PRINTABLE_BOOKLET_SIZE} puzzles across {PRINTABLE_BOOKLET_PAGE_COUNT} pages,{' '}
                            {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with the solved grids at the back.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation previous={printableHellSudokuPageMetadata} />
        </main>
    );
};
