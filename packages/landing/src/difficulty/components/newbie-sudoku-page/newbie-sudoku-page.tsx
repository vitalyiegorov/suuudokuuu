import { Trans } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../../app/(en)/how-to-play/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableNewbieSudokuPageMetadata } from '../../../app/(en)/printable/newbie/metadata';
import { sudokuForSeniorsPageMetadata } from '../../../app/(en)/sudoku-for-seniors/metadata';
import { easySudokuPageMetadata } from '../../../app/(en)/sudoku/easy/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/(en)/sudoku/metadata';
import { newbieSudokuPageMetadata } from '../../../app/(en)/sudoku/newbie/metadata';
import { fullHousePageMetadata } from '../../../app/(en)/techniques/full-house/metadata';
import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
import { nakedSinglePageMetadata } from '../../../app/(en)/techniques/naked-single/metadata';
import { StoreBadges } from '../../../chrome/components/store-badges/store-badges';
import { StoreBadgeCampaignEnum } from '../../../chrome/enums/store-badge-campaign.enum';
import { activateLocale } from '../../../i18n/utils/activate-locale.util';
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
import { buildDifficultyPlayUrl } from '../../utils/build-difficulty-play-url.util';
import { getDifficultyClueCount } from '../../utils/get-difficulty-clue-count.util';
import { DifficultyBoard } from '../difficulty-board/difficulty-board';
import { DifficultyNavigation } from '../difficulty-navigation/difficulty-navigation';

import type { LocaleType } from '../../../seo/types/locale.type';

interface Props {
    locale: LocaleType;
}

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
export const NewbieSudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const newbieReport = getTierTechniqueReport(DifficultyEnum.Newbie);
    const clueCount = getDifficultyClueCount(DifficultyEnum.Newbie);
    const { sampleSize } = newbieReport;
    const seRatingRange = formatSeRatingRange(newbieReport);

    return (
        <main>
            <ArticleSchema metadata={newbieSudokuPageMetadata} />
            <PageHeader metadata={newbieSudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>
                    <Trans>Sudoku difficulties</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Newbie</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <DifficultyBoard difficulty={DifficultyEnum.Newbie}>
                <Trans>A Newbie board from the same generator the app uses. Play it right here.</Trans>
            </DifficultyBoard>
            <p>
                <Trans>
                    Newbie is Suuudokuuu’s beginner tier, the gentlest possible introduction to the grid. A Newbie board starts with{' '}
                    {clueCount} of the 81 cells already filled. Every remaining cell can be found with the two simplest deductions in the
                    game: a <Link href={buildLocalizedPagePath(fullHousePageMetadata)}>full house</Link>, where a unit is down to its last
                    empty cell, and a <Link href={buildLocalizedPagePath(nakedSinglePageMetadata)}>naked single</Link>, where a cell’s row,
                    column and box between them already account for eight of the nine digits. That is not a description of a typical Newbie
                    board — it is the rule the generator enforces: a candidate board is only accepted as Newbie once a solver restricted to
                    full houses and naked singles has finished it. No pencil marks, no elimination logic and no guessing are ever required.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>
                            Newbie boards carry {clueCount} clues and are guaranteed to finish with full houses and naked singles alone.
                        </Trans>
                    </li>
                    <li>
                        <Trans>No pencil marks, no elimination logic and no guessing are ever required.</Trans>
                    </li>
                    <li>
                        <Trans>
                            Our sample of {sampleSize} Newbie boards measures SE {seRatingRange}.
                        </Trans>
                    </li>
                    <li>
                        <Trans>
                            A board that needs a hidden single or anything harder is rejected and regenerated, never labelled Newbie.
                        </Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={buildDifficultyPlayUrl(DifficultyEnum.Newbie)}>
                <Trans>Play Newbie Sudoku now</Trans>
            </a>
            <h2>
                <Trans>What makes a puzzle Newbie</Trans>
            </h2>
            <p>
                <Trans>
                    Full House and Naked Single are the first two strategies Suuudokuuu’s solving engine tries on every board at every
                    difficulty, because they are the cheapest deductions to verify. What sets Newbie apart is that the tier is defined as
                    the boards that never need anything else. Strip more digits and a solver eventually stalls without hidden singles,
                    intersections or subsets, and the generator throws those boards back rather than labelling them Newbie. If you can read
                    a row and name the one digit missing from it, you already have every skill a Newbie puzzle asks for.
                </Trans>
            </p>
            <h2>
                <Trans>How hard is it, honestly</Trans>
            </h2>
            <p>
                <Trans>
                    Every Newbie board is rated on the SE (Sudoku Explainer) scale the moment it is created. Our published sample of{' '}
                    {sampleSize} Newbie boards measures SE {seRatingRange} — the very bottom of a scale that runs to 12, and below what most
                    SE-based charts even bother to name. Newbie exists to teach the row-column-box overlap that every later technique builds
                    on, not to test it. The measured range for this tier and every other is published in our{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>sudoku difficulty rating guide</Link>. Treat a
                    fast, mistake-free Newbie solve as confirmation you’re ready for Easy, not as a benchmark worth chasing for its own
                    sake.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    Ready for a puzzle that needs one more idea? Move up to{' '}
                    <Link href={buildLocalizedPagePath(easySudokuPageMetadata)}>Easy Sudoku</Link>, which adds the hidden single on top of
                    everything here. Prefer paper? Download the{' '}
                    <Link href={buildLocalizedPagePath(printableNewbieSudokuPageMetadata)}>printable Newbie sudoku booklet</Link>, or see
                    the <Link href={buildLocalizedPagePath(sudokuForSeniorsPageMetadata)}>sudoku for seniors</Link> guide for large-print
                    and comfort options. Browse the full <Link href={buildLocalizedPagePath(techniquesPageMetadata)}>technique index</Link>{' '}
                    or the <Link href={buildLocalizedPagePath(howToPlayPageMetadata)}>how to play guide</Link>, or head back{' '}
                    <Link href={buildLocalizedPagePath(homePageMetadata)}>home</Link> and see all seven tiers on the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>Sudoku difficulty levels</Link> hub.
                </Trans>
            </p>
            <StoreBadges campaign={StoreBadgeCampaignEnum.DIFFICULTY} />
            <FaqPage>
                <FaqHeading>
                    <Trans>Newbie Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>How hard is Newbie sudoku?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            It is the easiest tier Suuudokuuu offers, and the generator guarantees it: a board only ships as Newbie once a
                            solver limited to full houses and naked singles has finished it. Our sample measures SE {seRatingRange}, with no
                            candidate tracking and no risk of a forced guess.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many clues does a Newbie puzzle have?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>{clueCount} clues out of 81 cells, and every blank is reachable with a full house or a naked single.</Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>What is the easiest Sudoku difficulty?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Newbie is the easiest of Suuudokuuu’s seven tiers, followed by Easy, Medium, Hard, Nightmare, Hell and Infinity
                            in increasing order of difficulty.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Do I need pencil marks for Newbie puzzles?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            No. Both techniques a Newbie puzzle requires can be read straight off the board, which is exactly why they are
                            the fastest deductions in the game.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={easySudokuPageMetadata} />
        </main>
    );
};
