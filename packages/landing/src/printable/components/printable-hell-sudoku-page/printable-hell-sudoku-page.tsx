import { Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { HELL_CORPUS_MAXIMUM_GIVEN_COUNT, HELL_CORPUS_MINIMUM_GIVEN_COUNT } from '@suuudokuuu/hell-corpus';
import Link from 'next/link';

import { seventeenClueSudokuPageMetadata } from '../../../app/(en)/17-clue-sudoku/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableHardSudokuPageMetadata } from '../../../app/(en)/printable/hard/metadata';
import { printableHellSudokuPageMetadata } from '../../../app/(en)/printable/hell/metadata';
import { printableInfinitySudokuPageMetadata } from '../../../app/(en)/printable/infinity/metadata';
import { printableSudokuPageMetadata } from '../../../app/(en)/printable/metadata';
import { printableNightmareSudokuPageMetadata } from '../../../app/(en)/printable/nightmare/metadata';
import { hellSudokuPageMetadata } from '../../../app/(en)/sudoku/hell/metadata';
import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
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

const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Hell];
const hellReport = getTierTechniqueReport(DifficultyEnum.Hell);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
export const PrintableHellSudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const { t } = useLingui();
    const { sampleSize } = hellReport;
    const seRatingRange = formatSeRatingRange(hellReport);

    return (
        <main>
            <ArticleSchema metadata={printableHellSudokuPageMetadata} />
            <PageHeader metadata={printableHellSudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(printableSudokuPageMetadata)}>
                    <Trans>Printable sudoku</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Hell</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <p>
                <Trans>
                    Every puzzle in this booklet needs a forcing chain: none can be finished with the techniques Nightmare allows, and each
                    is drawn from our bundled and independently verified Hell corpus rather than generated fresh. Our published sample of{' '}
                    {sampleSize} boards measures the tier at SE {seRatingRange}, with the{' '}
                    <TechniqueLink technique={hellReport.typicalHardestTechnique} /> as the most common hardest step. See the{' '}
                    <Link href={buildLocalizedPagePath(seventeenClueSudokuPageMetadata)}>17-clue guide</Link> for why the clue count is not
                    what makes them hard.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>
                            Every puzzle needs a forcing chain, drawn from a bundled and independently verified corpus of boards with{' '}
                            {HELL_CORPUS_MINIMUM_GIVEN_COUNT} to {HELL_CORPUS_MAXIMUM_GIVEN_COUNT} clues.
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
                            Our sample of {sampleSize} Hell boards measures SE {seRatingRange}, with the{' '}
                            <TechniqueLink technique={hellReport.typicalHardestTechnique} /> as the most common hardest step.
                        </Trans>
                    </li>
                    <li>
                        <Trans>Hardness here comes from the technique each board requires, not from the clue count.</Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <PuzzleBoard givens={PREVIEW_PUZZLE}>
                <Trans>Puzzle 1 from the Hell booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</Trans>
            </PuzzleBoard>
            <PrintableDownloadCard fileName="hell.pdf" title={t`Hell Sudoku`}>
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
                    Some of these grids start with as few as {HELL_CORPUS_MINIMUM_GIVEN_COUNT} givens and look almost empty at first glance
                    — the {PRINTABLE_BOOKLET_SIZE} puzzles print {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page with generous cell size
                    specifically so there is room to track candidates by hand across a long chain. The final pages hold the completed grids,
                    which is close to essential at this tier: verifying a chain of eliminations by eye is slow, and a printed key lets you
                    confirm the end state without re-deriving the whole path.
                </Trans>
            </p>
            <h2>
                <Trans>How the puzzles are verified</Trans>
            </h2>
            <p>
                <Trans>
                    Every puzzle in this booklet comes from a bundled corpus that Suuudokuuu checks with two independent solving algorithms
                    — a Dancing Links exact-cover solver and a typed-array bitmask solver — before it ships, so each grid is confirmed to
                    have exactly one solution. The corpus draws from the tdoku project’s 17-clue catalog and the magictour top1465
                    hard-puzzle list, and each puzzle is also solved logically and rated on the SE scale as the corpus is packed. Only
                    boards whose hardest step is a forcing chain survive; anything that falls to a chain, coloring or AIC is dropped,
                    because neither the clue count nor the source list alone would be enough to promise a Hell puzzle. Every survivor still
                    solves on our technique ladder without guessing, so every puzzle here is guaranteed solvable by logic before you ever
                    pick up a pencil.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    Not ready for chains on paper yet? Step back to the{' '}
                    <Link href={buildLocalizedPagePath(printableNightmareSudokuPageMetadata)}>printable Nightmare sudoku booklet</Link> for
                    the same chain reasoning with more of the grid filled in, or to{' '}
                    <Link href={buildLocalizedPagePath(printableHardSudokuPageMetadata)}>printable Hard sudoku</Link> for fish and wings
                    without chain-length reasoning, or play Hell on a screen at the{' '}
                    <Link href={buildLocalizedPagePath(hellSudokuPageMetadata)}>Hell sudoku lander</Link>, where the same corpus powers
                    every puzzle. Ready for the record puzzles? The{' '}
                    <Link href={buildLocalizedPagePath(printableInfinitySudokuPageMetadata)}>printable Infinity sudoku booklet</Link> prints
                    Everest, AI Escargot and other record grids.
                </Trans>
            </p>
            <FaqPage>
                <FaqHeading>
                    <Trans>Printable Hell Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is the printable Hell sudoku PDF free?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>Yes, with no account and no watermark, and every puzzle’s solved grid is included at the back.</Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Are these 17-clue puzzles?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Not necessarily. Hell puzzles carry {HELL_CORPUS_MINIMUM_GIVEN_COUNT} to {HELL_CORPUS_MAXIMUM_GIVEN_COUNT}{' '}
                            clues, drawn from a bundled corpus checked by two independent solving algorithms and filtered to boards that
                            need a forcing chain, rather than generated fresh at print time.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Does a low clue count make these puzzles hard?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            No. Clue count and difficulty are separate facts — see the{' '}
                            <Link href={buildLocalizedPagePath(seventeenClueSudokuPageMetadata)}>17-clue sudoku guide</Link>. These puzzles
                            are hard because every one needs a forcing chain, not because of how many clues they start with.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many puzzles are in the printable Hell sudoku PDF?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            {PRINTABLE_BOOKLET_SIZE} puzzles across {PRINTABLE_BOOKLET_PAGE_COUNT} pages,{' '}
                            {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, with the solved grids at the back.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={printableInfinitySudokuPageMetadata} previous={printableNightmareSudokuPageMetadata} />
        </main>
    );
};
