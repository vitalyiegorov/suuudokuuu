import { Trans } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../../app/(en)/how-to-play/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableHardSudokuPageMetadata } from '../../../app/(en)/printable/hard/metadata';
import { hardSudokuPageMetadata } from '../../../app/(en)/sudoku/hard/metadata';
import { mediumSudokuPageMetadata } from '../../../app/(en)/sudoku/medium/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/(en)/sudoku/metadata';
import { nightmareSudokuPageMetadata } from '../../../app/(en)/sudoku/nightmare/metadata';
import { finnedSwordfishPageMetadata } from '../../../app/(en)/techniques/finned-swordfish/metadata';
import { finnedXWingPageMetadata } from '../../../app/(en)/techniques/finned-x-wing/metadata';
import { hiddenQuadPageMetadata } from '../../../app/(en)/techniques/hidden-quad/metadata';
import { jellyfishPageMetadata } from '../../../app/(en)/techniques/jellyfish/metadata';
import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
import { sashimiXWingPageMetadata } from '../../../app/(en)/techniques/sashimi-x-wing/metadata';
import { swordfishPageMetadata } from '../../../app/(en)/techniques/swordfish/metadata';
import { wWingPageMetadata } from '../../../app/(en)/techniques/w-wing/metadata';
import { xWingPageMetadata } from '../../../app/(en)/techniques/x-wing/metadata';
import { xyWingPageMetadata } from '../../../app/(en)/techniques/xy-wing/metadata';
import { xyzWingPageMetadata } from '../../../app/(en)/techniques/xyz-wing/metadata';
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
import { TechniqueLink } from '../../../techniques/components/technique-link/technique-link';
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
export const HardSudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const hardReport = getTierTechniqueReport(DifficultyEnum.Hard);
    const clueCount = getDifficultyClueCount(DifficultyEnum.Hard);
    const { sampleSize } = hardReport;
    const seRatingRange = formatSeRatingRange(hardReport);

    return (
        <main>
            <ArticleSchema metadata={hardSudokuPageMetadata} />
            <PageHeader metadata={hardSudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>
                    <Trans>Sudoku difficulties</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Hard</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <DifficultyBoard difficulty={DifficultyEnum.Hard}>
                <Trans>A Hard board from the same generator the app uses. Play it right here.</Trans>
            </DifficultyBoard>
            <p>
                <Trans>
                    Hard Sudoku is a difficulty tier that starts at {clueCount} clues out of 81 cells and is defined by what a subset-only
                    solver cannot finish: every board in the tier has been run through a solver equipped with every intersection and every
                    subset up to the <Link href={buildLocalizedPagePath(hiddenQuadPageMetadata)}>hidden quad</Link>, and kept only because
                    that solver got stuck. What breaks the deadlock is a fish —{' '}
                    <Link href={buildLocalizedPagePath(xWingPageMetadata)}>X-Wing</Link>,{' '}
                    <Link href={buildLocalizedPagePath(swordfishPageMetadata)}>swordfish</Link>,{' '}
                    <Link href={buildLocalizedPagePath(jellyfishPageMetadata)}>jellyfish</Link> and their{' '}
                    <Link href={buildLocalizedPagePath(finnedXWingPageMetadata)}>finned</Link> and{' '}
                    <Link href={buildLocalizedPagePath(sashimiXWingPageMetadata)}>sashimi</Link> variants — or a wing:{' '}
                    <Link href={buildLocalizedPagePath(xyWingPageMetadata)}>XY-Wing</Link>,{' '}
                    <Link href={buildLocalizedPagePath(xyzWingPageMetadata)}>XYZ-Wing</Link> and{' '}
                    <Link href={buildLocalizedPagePath(wWingPageMetadata)}>W-Wing</Link>.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>
                            Hard boards carry {clueCount} clues and are guaranteed to need at least one fish or wing pattern beyond every
                            subset.
                        </Trans>
                    </li>
                    <li>
                        <Trans>
                            Fish patterns: X-Wing, swordfish, jellyfish and their finned and sashimi variants. Wing patterns: XY-Wing,
                            XYZ-Wing and W-Wing.
                        </Trans>
                    </li>
                    <li>
                        <Trans>
                            Our sample of {sampleSize} Hard boards measures SE {seRatingRange}.
                        </Trans>
                    </li>
                    <li>
                        <Trans>Hard is capped at the W-Wing — a board that resists every fish and wing is graded Nightmare instead.</Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={buildDifficultyPlayUrl(DifficultyEnum.Hard)}>
                <Trans>Play Hard Sudoku now</Trans>
            </a>
            <h2>
                <Trans>What makes a puzzle Hard</Trans>
            </h2>
            <p>
                <Trans>
                    A fish looks at one digit across several lines at once. The X-Wing is the smallest: a digit confined to the same two
                    columns across two rows can be erased from the rest of those columns, because whichever row ends up holding it, the
                    columns are already fixed. A <Link href={buildLocalizedPagePath(swordfishPageMetadata)}>swordfish</Link> stretches the
                    same idea over three lines and a jellyfish over four. Finned and sashimi variants relax the base pattern by allowing one
                    extra candidate that still supports a smaller, safe elimination once you account for it — and in our sample they fire
                    far more often than the textbook shapes do. Wings work differently: an XY-Wing links three bivalue cells so a candidate
                    shared between two of them can be erased wherever both can see, XYZ-Wing gives the pivot that candidate too, and W-Wing
                    joins two matching bivalue cells through a strong link on one shared digit. Hard is capped at the W-Wing: a board that
                    still will not move after every fish and wing has been tried is a Nightmare board, not a Hard one.
                </Trans>
            </p>
            <h2>
                <Trans>How hard is it, honestly</Trans>
            </h2>
            <p>
                <Trans>
                    Our sample of {sampleSize} Hard boards measures SE (Sudoku Explainer) {seRatingRange} — squarely in the range the
                    solving community associates with fish and wing patterns, and well below the chain territory above 7. The most common
                    hardest step is the <TechniqueLink technique={hardReport.typicalHardestTechnique} />, and the hardest anything in the
                    sample reached is the <TechniqueLink technique={hardReport.hardestTechniqueReached} />. This is where casual solvers
                    start reaching for a hint: fish and wings are easy to describe and genuinely hard to see on a live board, so expect a
                    noticeably longer, more deliberate solve than Medium asks for. See the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>sudoku difficulty rating guide</Link> for the
                    full per-tier data.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    Ready to chain eliminations together instead of spotting shapes? Move up to{' '}
                    <Link href={buildLocalizedPagePath(nightmareSudokuPageMetadata)}>Nightmare Sudoku</Link>, or step back to{' '}
                    <Link href={buildLocalizedPagePath(mediumSudokuPageMetadata)}>Medium Sudoku</Link> for an intersections-and-subsets
                    puzzle. Prefer paper? Download the{' '}
                    <Link href={buildLocalizedPagePath(printableHardSudokuPageMetadata)}>printable Hard sudoku PDF</Link>. See the{' '}
                    <Link href={buildLocalizedPagePath(techniquesPageMetadata)}>technique index</Link>, the{' '}
                    <Link href={buildLocalizedPagePath(howToPlayPageMetadata)}>how to play guide</Link>, every tier on the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>Sudoku difficulty levels</Link> hub, or head{' '}
                    <Link href={buildLocalizedPagePath(homePageMetadata)}>home</Link>.
                </Trans>
            </p>
            <StoreBadges campaign={StoreBadgeCampaignEnum.DIFFICULTY} />
            <FaqPage>
                <FaqHeading>
                    <Trans>Hard Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>What techniques do I need for Hard sudoku?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Everything Medium needs, plus at least one fish or wing pattern: X-Wing, swordfish, jellyfish, their finned and
                            sashimi variants, XY-Wing, XYZ-Wing or W-Wing. One of those is always required, because a board that does not
                            need one is graded Medium instead.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many clues does a Hard sudoku have?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            {clueCount} clues out of 81 cells — only one fewer than Medium, which is exactly why the tier is defined by the
                            techniques it requires rather than by its clue count.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>What is a finned fish in sudoku?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            An almost-fish: the rows or columns line up as an X-Wing or{' '}
                            <Link href={buildLocalizedPagePath(finnedSwordfishPageMetadata)}>swordfish</Link> except for one or two extra
                            candidates, the fin. The elimination still holds, but only in the cells that both the fish and the fin can see.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is Hard sudoku harder than Nightmare?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            No. Hard tops out at the W-Wing; Nightmare starts where Hard stops and runs up to alternating inference chains.
                            The two tiers are separated by a technique boundary, not by a clue count.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={nightmareSudokuPageMetadata} previous={mediumSudokuPageMetadata} />
        </main>
    );
};
