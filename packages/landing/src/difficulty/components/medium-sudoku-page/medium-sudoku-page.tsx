import { Trans } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../../app/(en)/how-to-play/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableMediumSudokuPageMetadata } from '../../../app/(en)/printable/medium/metadata';
import { easySudokuPageMetadata } from '../../../app/(en)/sudoku/easy/metadata';
import { hardSudokuPageMetadata } from '../../../app/(en)/sudoku/hard/metadata';
import { mediumSudokuPageMetadata } from '../../../app/(en)/sudoku/medium/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/(en)/sudoku/metadata';
import { boxLineReductionPageMetadata } from '../../../app/(en)/techniques/box-line-reduction/metadata';
import { hiddenPairPageMetadata } from '../../../app/(en)/techniques/hidden-pair/metadata';
import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
import { nakedPairPageMetadata } from '../../../app/(en)/techniques/naked-pair/metadata';
import { pointingPairPageMetadata } from '../../../app/(en)/techniques/pointing-pair/metadata';
import { pointingTriplePageMetadata } from '../../../app/(en)/techniques/pointing-triple/metadata';
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
export const MediumSudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const mediumReport = getTierTechniqueReport(DifficultyEnum.Medium);
    const clueCount = getDifficultyClueCount(DifficultyEnum.Medium);
    const { sampleSize, singlesOnlyPuzzleCount } = mediumReport;
    const seRatingRange = formatSeRatingRange(mediumReport);

    return (
        <main>
            <ArticleSchema metadata={mediumSudokuPageMetadata} />
            <PageHeader metadata={mediumSudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>
                    <Trans>Sudoku difficulties</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Medium</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <DifficultyBoard difficulty={DifficultyEnum.Medium}>
                <Trans>A Medium board from the same generator the app uses. Play it right here.</Trans>
            </DifficultyBoard>
            <p>
                <Trans>
                    Medium is where Suuudokuuu starts asking for pencil marks. A Medium board carries {clueCount} clues out of 81 cells, and
                    singles alone provably never finish it: every board in the tier has been checked against a singles-only solver and
                    rejected if that solver got through. Once full houses and singles run out, the puzzle stalls until you spot an
                    intersection — a digit confined to where a box and a line overlap — or a pair locked together.{' '}
                    <Link href={buildLocalizedPagePath(pointingPairPageMetadata)}>Pointing pairs</Link>,{' '}
                    <Link href={buildLocalizedPagePath(pointingTriplePageMetadata)}>pointing triples</Link> and{' '}
                    <Link href={buildLocalizedPagePath(boxLineReductionPageMetadata)}>box line reduction</Link> cover the intersections;{' '}
                    <Link href={buildLocalizedPagePath(nakedPairPageMetadata)}>naked pairs</Link> and{' '}
                    <Link href={buildLocalizedPagePath(hiddenPairPageMetadata)}>hidden pairs</Link> cover the smallest subset pattern.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>
                            Medium boards carry {clueCount} clues and are guaranteed to stall on singles and yield to an intersection or a
                            subset.
                        </Trans>
                    </li>
                    <li>
                        <Trans>Intersections: pointing pair, pointing triple, box line reduction. Subsets: naked pair, hidden pair.</Trans>
                    </li>
                    <li>
                        <Trans>
                            Our sample of {sampleSize} Medium boards measures SE {seRatingRange}.
                        </Trans>
                    </li>
                    <li>
                        <Trans>
                            Nothing in the tier ever needs a fish, a wing or a chain — a board that does is promoted to Hard instead.
                        </Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={buildDifficultyPlayUrl(DifficultyEnum.Medium)}>
                <Trans>Play Medium Sudoku now</Trans>
            </a>
            <h2>
                <Trans>What makes a puzzle Medium</Trans>
            </h2>
            <p>
                <Trans>
                    An intersection technique works on the overlap between one box and one row or column. A pointing pair or pointing triple
                    finds a digit confined to two or three cells of a box that all share a line, and erases it from the rest of that line;
                    box line reduction is the mirror image, working from a line back into a box. Naked and hidden pairs are the entry point
                    to subset reasoning: two cells that share exactly two candidates, or two digits that fit in exactly two cells of a unit,
                    either way locking those two cells away from everything else in it. None of these place a digit outright — they only
                    eliminate candidates — but at {clueCount} clues a Medium puzzle always has at least one waiting, and it is usually
                    enough to unlock a fresh naked single a move or two later. The tier is capped at the other end too: nothing in it ever
                    needs a fish, a wing or a chain, because a board that does is promoted to Hard instead.
                </Trans>
            </p>
            <h2>
                <Trans>How hard is it, honestly</Trans>
            </h2>
            <p>
                <Trans>
                    Our sample of {sampleSize} Medium boards measures SE {seRatingRange}, and {singlesOnlyPuzzleCount} of {sampleSize}{' '}
                    finished on singles alone — this is the first tier where that number is zero by construction. The most common hardest
                    step in the sample is the <TechniqueLink technique={mediumReport.typicalHardestTechnique} />, and the hardest anything
                    reached is the <TechniqueLink technique={mediumReport.hardestTechniqueReached} />. Players who read pencil marks
                    fluently clear a Medium board noticeably faster than players relying on mental candidate tracking, who will find this
                    the first tier that genuinely rewards writing candidates down. The full per-tier data sits in our{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>sudoku difficulty rating guide</Link>.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    Comfortable spotting intersections and subsets? Move up to{' '}
                    <Link href={buildLocalizedPagePath(hardSudokuPageMetadata)}>Hard Sudoku</Link>, where a fish or a wing is always
                    required, or drop back to <Link href={buildLocalizedPagePath(easySudokuPageMetadata)}>Easy Sudoku</Link> to revisit
                    singles. Prefer paper? Download the{' '}
                    <Link href={buildLocalizedPagePath(printableMediumSudokuPageMetadata)}>printable Medium sudoku booklet</Link>. Browse
                    the <Link href={buildLocalizedPagePath(techniquesPageMetadata)}>technique index</Link>, the{' '}
                    <Link href={buildLocalizedPagePath(howToPlayPageMetadata)}>how to play guide</Link>, every tier on the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>Sudoku difficulty levels</Link> hub, or head{' '}
                    <Link href={buildLocalizedPagePath(homePageMetadata)}>home</Link>.
                </Trans>
            </p>
            <StoreBadges campaign={StoreBadgeCampaignEnum.DIFFICULTY} />
            <FaqPage>
                <FaqHeading>
                    <Trans>Medium Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>What techniques do I need for Medium sudoku?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Full houses and singles as a baseline, plus pointing pairs, pointing triples, box line reduction and the naked
                            or hidden subsets up to quads whenever singles run dry. At least one of those is always required, and nothing
                            harder ever is.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many clues does a Medium sudoku have?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>{clueCount} clues out of 81 cells, a third of the grid filled in before you start.</Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>What is a pointing pair?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            A digit confined to two cells of one box that also share a row or column. It can then be erased from the rest of
                            that row or column, since one of those two cells must hold it.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is Medium sudoku hard?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            It is a real step up from Easy, but every technique it needs still works inside a single box or line at a time —
                            the longer fish and chain patterns only start at Hard and beyond.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={hardSudokuPageMetadata} previous={easySudokuPageMetadata} />
        </main>
    );
};
