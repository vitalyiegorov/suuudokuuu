import { Trans } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../../app/(en)/how-to-play/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableNightmareSudokuPageMetadata } from '../../../app/(en)/printable/nightmare/metadata';
import { hardSudokuPageMetadata } from '../../../app/(en)/sudoku/hard/metadata';
import { hellSudokuPageMetadata } from '../../../app/(en)/sudoku/hell/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/(en)/sudoku/metadata';
import { nightmareSudokuPageMetadata } from '../../../app/(en)/sudoku/nightmare/metadata';
import { aicPageMetadata } from '../../../app/(en)/techniques/aic/metadata';
import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
import { simpleColoringPageMetadata } from '../../../app/(en)/techniques/simple-coloring/metadata';
import { wWingPageMetadata } from '../../../app/(en)/techniques/w-wing/metadata';
import { xChainPageMetadata } from '../../../app/(en)/techniques/x-chain/metadata';
import { xyChainPageMetadata } from '../../../app/(en)/techniques/xy-chain/metadata';
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
export const NightmareSudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const nightmareReport = getTierTechniqueReport(DifficultyEnum.Nightmare);
    const clueCount = getDifficultyClueCount(DifficultyEnum.Nightmare);
    const { sampleSize } = nightmareReport;
    const seRatingRange = formatSeRatingRange(nightmareReport);

    return (
        <main>
            <ArticleSchema metadata={nightmareSudokuPageMetadata} />
            <PageHeader metadata={nightmareSudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>
                    <Trans>Sudoku difficulties</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Nightmare</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <DifficultyBoard difficulty={DifficultyEnum.Nightmare}>
                <Trans>A Nightmare board from the same generator the app uses. Play it right here.</Trans>
            </DifficultyBoard>
            <p>
                <Trans>
                    Nightmare is Suuudokuuu’s expert tier — what most other apps would call very hard or expert. A Nightmare board carries
                    just {clueCount} clues out of 81 cells, and it is the tier where bounded patterns stop being enough: every board here
                    has been checked against a solver that already knows every fish and every wing up to the{' '}
                    <Link href={buildLocalizedPagePath(wWingPageMetadata)}>W-Wing</Link>, and is only labelled Nightmare because that solver
                    stalled. Finishing one needs chain reasoning — <Link href={buildLocalizedPagePath(xChainPageMetadata)}>X-Chain</Link>,{' '}
                    <Link href={buildLocalizedPagePath(xyChainPageMetadata)}>XY-Chain</Link>,{' '}
                    <Link href={buildLocalizedPagePath(simpleColoringPageMetadata)}>simple coloring</Link> and{' '}
                    <Link href={buildLocalizedPagePath(aicPageMetadata)}>AIC</Link>, the alternating inference chain that generalises the
                    other three.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>
                            Nightmare boards carry {clueCount} clues and are guaranteed to need at least one chain or coloring technique
                            beyond every fish and wing.
                        </Trans>
                    </li>
                    <li>
                        <Trans>Chain and coloring techniques: X-Chain, XY-Chain, simple coloring and AIC.</Trans>
                    </li>
                    <li>
                        <Trans>
                            Our sample of {sampleSize} Nightmare boards measures SE {seRatingRange}.
                        </Trans>
                    </li>
                    <li>
                        <Trans>Nightmare is capped at AIC — a board resisting that is beyond what the generated tiers hand you.</Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={buildDifficultyPlayUrl(DifficultyEnum.Nightmare)}>
                <Trans>Play Nightmare Sudoku now</Trans>
            </a>
            <h2>
                <Trans>What makes a puzzle Nightmare</Trans>
            </h2>
            <p>
                <Trans>
                    A chain follows an alternating sequence of strong and weak links between candidates, starting from one end and reasoning
                    outward until the two ends prove an elimination no matter which of them turns out to be true. X-Chain does this with a
                    single digit; XY-Chain walks a path of bivalue cells instead, changing digit at every step. Simple coloring assigns two
                    alternating colours to a network of strong links on one digit and clears any candidate that can see both colours. AIC
                    folds all of them into one technique, mixing digits and link types along a single continuous chain. The difference from
                    a fish or a wing is not subtlety but shape: a wing is a fixed arrangement of three or four cells you learn to recognise,
                    while a chain has no fixed size and has to be built move by move. Nightmare is capped at AIC — anything that still
                    resists is beyond what the generated tiers will hand you.
                </Trans>
            </p>
            <h2>
                <Trans>How hard is it, honestly</Trans>
            </h2>
            <p>
                <Trans>
                    Our sample of {sampleSize} Nightmare boards measures SE (Sudoku Explainer) {seRatingRange}, with the{' '}
                    <TechniqueLink technique={nightmareReport.typicalHardestTechnique} /> as the most common hardest step. AIC is the
                    ceiling here: every Nightmare board falls to it, and the{' '}
                    <Link href={buildLocalizedPagePath(hellSudokuPageMetadata)}>Hell tier</Link> begins exactly where it stops, with boards
                    that need a forcing chain. Some of those Hell boards carry more givens than Nightmare does, which is the clearest
                    evidence on the site that clue count and difficulty are separate facts. The measured tables live in our{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>sudoku difficulty rating guide</Link>.
                    Qualitatively, this is where difficulty stops being about speed and becomes about holding an entire line of implication
                    in your head without losing track of it.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    Cleared a few Nightmare boards? <Link href={buildLocalizedPagePath(hellSudokuPageMetadata)}>Hell Sudoku</Link> is the
                    last tier, where every board needs a forcing chain. Step back to{' '}
                    <Link href={buildLocalizedPagePath(hardSudokuPageMetadata)}>Hard Sudoku</Link> if fish and wings still feel unreliable.
                    Prefer paper? Download the{' '}
                    <Link href={buildLocalizedPagePath(printableNightmareSudokuPageMetadata)}>printable Nightmare sudoku booklet</Link>.
                    Browse the <Link href={buildLocalizedPagePath(techniquesPageMetadata)}>technique index</Link>, the{' '}
                    <Link href={buildLocalizedPagePath(howToPlayPageMetadata)}>how to play guide</Link>, every tier on the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>Sudoku difficulty levels</Link> hub, or head{' '}
                    <Link href={buildLocalizedPagePath(homePageMetadata)}>home</Link>.
                </Trans>
            </p>
            <StoreBadges campaign={StoreBadgeCampaignEnum.DIFFICULTY} />
            <FaqPage>
                <FaqHeading>
                    <Trans>Nightmare Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>How hard is Nightmare sudoku?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            It is Suuudokuuu’s hardest generated tier, measured at SE {seRatingRange} across a sample of {sampleSize}{' '}
                            boards. Every one of them needs chain or coloring logic on top of the fish and wing patterns Hard already
                            requires.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many clues does a Nightmare sudoku have?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>{clueCount} clues out of 81 cells, well under a third of the grid.</Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>What is the difference between a wing and a chain?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Size and shape. A wing is a fixed pattern of three or four cells you learn to recognise at a glance; a chain is
                            built link by link and can run to any length, which is why chains sit a full band above wings on the SE scale.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Do Nightmare puzzles ever need guessing?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            No. Every board in the tier is verified solvable by the technique ladder up to AIC before it ships, so a
                            completed chain always exists — finding it is the work.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={hellSudokuPageMetadata} previous={hardSudokuPageMetadata} />
        </main>
    );
};
