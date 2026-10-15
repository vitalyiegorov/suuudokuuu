import { Trans } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { howToPlayPageMetadata } from '../../../app/(en)/how-to-play/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableEasySudokuPageMetadata } from '../../../app/(en)/printable/easy/metadata';
import { sudokuForSeniorsPageMetadata } from '../../../app/(en)/sudoku-for-seniors/metadata';
import { easySudokuPageMetadata } from '../../../app/(en)/sudoku/easy/metadata';
import { mediumSudokuPageMetadata } from '../../../app/(en)/sudoku/medium/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/(en)/sudoku/metadata';
import { newbieSudokuPageMetadata } from '../../../app/(en)/sudoku/newbie/metadata';
import { fullHousePageMetadata } from '../../../app/(en)/techniques/full-house/metadata';
import { hiddenSinglePageMetadata } from '../../../app/(en)/techniques/hidden-single/metadata';
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
export const EasySudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const easyReport = getTierTechniqueReport(DifficultyEnum.Easy);
    const clueCount = getDifficultyClueCount(DifficultyEnum.Easy);
    const { sampleSize } = easyReport;
    const seRatingRange = formatSeRatingRange(easyReport);

    return (
        <main>
            <ArticleSchema metadata={easySudokuPageMetadata} />
            <PageHeader metadata={easySudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>
                    <Trans>Sudoku difficulties</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Easy</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <DifficultyBoard difficulty={DifficultyEnum.Easy}>
                <Trans>An Easy board from the same generator the app uses. Play it right here.</Trans>
            </DifficultyBoard>
            <p>
                <Trans>
                    Easy is the first tier where Suuudokuuu expects a genuine, if gentle, solve. An Easy board carries {clueCount} clues out
                    of 81 cells, a handful fewer than Newbie. Full houses and naked singles still clear most of the grid, but never all of
                    it: at least one cell always needs a <Link href={buildLocalizedPagePath(hiddenSinglePageMetadata)}>hidden single</Link>,
                    where a digit fits only one cell of a row, column or box even though that cell still shows other candidates. That one
                    extra pattern is the entire step up from Newbie to Easy, and it is a guarantee rather than a tendency: a board that a
                    full-house-and-naked-single solver can finish is rejected as too easy for the tier, and a board that needs anything past
                    the hidden single is rejected as too hard.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>
                            Easy boards carry {clueCount} clues and are guaranteed to need at least one hidden single and nothing harder.
                        </Trans>
                    </li>
                    <li>
                        <Trans>
                            Full houses and naked singles still clear most of the grid; the hidden single is the one addition over Newbie.
                        </Trans>
                    </li>
                    <li>
                        <Trans>
                            Our sample of {sampleSize} Easy boards measures SE {seRatingRange}.
                        </Trans>
                    </li>
                    <li>
                        <Trans>A board that a full-house-and-naked-single solver can finish is rejected as too easy for the tier.</Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={buildDifficultyPlayUrl(DifficultyEnum.Easy)}>
                <Trans>Play Easy Sudoku now</Trans>
            </a>
            <h2>
                <Trans>What makes a puzzle Easy</Trans>
            </h2>
            <p>
                <Trans>
                    Those extra blanks over Newbie are enough that the grid stops filling itself in from{' '}
                    <Link href={buildLocalizedPagePath(fullHousePageMetadata)}>full houses</Link> alone. Once the obvious placements run
                    out, an Easy puzzle always leaves at least one cell where hidden single reasoning is the only way forward — check each
                    unit’s missing digits against where they can still legally go, rather than reading candidates straight off one cell.
                    Suuudokuuu’s technique engine tries hidden single third, right after full house and{' '}
                    <Link href={buildLocalizedPagePath(nakedSinglePageMetadata)}>naked single</Link>, and an Easy-rated puzzle never needs
                    to go further than that: no pointing pairs, no subsets, nothing that asks you to hold more than one unit in mind at
                    once. The gap between the tiers is small on purpose — it is exactly one technique wide.
                </Trans>
            </p>
            <h2>
                <Trans>How hard is it, honestly</Trans>
            </h2>
            <p>
                <Trans>
                    Easy sits at the bottom of the SE (Sudoku Explainer) scale alongside Newbie: our sample of {sampleSize} boards measures
                    SE {seRatingRange}. The two tiers share a range because SE prices a hidden single at 1.5, below a naked single at 2.3 —
                    so the technique that defines Easy is, by that scale, cheaper than the one that defines Newbie. What genuinely changes
                    is where you have to look: a naked single is read off one cell, a hidden single off a whole unit. It suits players who
                    have cleared a few Newbie boards and want a puzzle that takes noticeably longer to finish.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    Solving Easy boards without reaching for a hidden single? Step back to{' '}
                    <Link href={buildLocalizedPagePath(newbieSudokuPageMetadata)}>Newbie Sudoku</Link>, or step up to{' '}
                    <Link href={buildLocalizedPagePath(mediumSudokuPageMetadata)}>Medium Sudoku</Link>, where intersections and your first
                    pairs appear. Prefer paper? Download the{' '}
                    <Link href={buildLocalizedPagePath(printableEasySudokuPageMetadata)}>printable Easy sudoku booklet</Link>, or see the{' '}
                    <Link href={buildLocalizedPagePath(sudokuForSeniorsPageMetadata)}>sudoku for seniors</Link> guide for large-print and
                    comfort options. See the full <Link href={buildLocalizedPagePath(techniquesPageMetadata)}>technique index</Link>, the{' '}
                    <Link href={buildLocalizedPagePath(howToPlayPageMetadata)}>how to play</Link> guide, or every tier on the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>Sudoku difficulty levels</Link> hub back{' '}
                    <Link href={buildLocalizedPagePath(homePageMetadata)}>home</Link>.
                </Trans>
            </p>
            <StoreBadges campaign={StoreBadgeCampaignEnum.DIFFICULTY} />
            <FaqPage>
                <FaqHeading>
                    <Trans>Easy Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many clues does an easy sudoku have?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            {clueCount} clues out of 81 cells, solved start to finish with full houses, naked singles and hidden singles.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>What is the difference between Newbie and Easy sudoku?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Exactly one technique. Every Newbie board can be finished with full houses and naked singles; every Easy board
                            provably cannot, and needs at least one hidden single to break the deadlock.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Do Easy puzzles ever need pencil marks?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Rarely. Most players can track the handful of candidates a hidden single needs in their head, but writing them
                            down never hurts on a busier row.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How hard is Easy sudoku?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Easy stays within singles-only logic, so it is still beginner-friendly. The only added skill over Newbie is
                            spotting a digit that fits nowhere else in a unit.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={mediumSudokuPageMetadata} previous={newbieSudokuPageMetadata} />
        </main>
    );
};
