import { Trans } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { HELL_CORPUS_MAXIMUM_GIVEN_COUNT, HELL_CORPUS_MINIMUM_GIVEN_COUNT, hellCorpusSize } from '@suuudokuuu/hell-corpus';
import Link from 'next/link';

import { seventeenClueSudokuPageMetadata } from '../../../app/(en)/17-clue-sudoku/metadata';
import { sudokuCluesVsDifficultyPageMetadata } from '../../../app/(en)/guides/sudoku-clues-vs-difficulty/metadata';
import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../../app/(en)/how-to-play/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableHellSudokuPageMetadata } from '../../../app/(en)/printable/hell/metadata';
import { hellSudokuPageMetadata } from '../../../app/(en)/sudoku/hell/metadata';
import { infinitySudokuPageMetadata } from '../../../app/(en)/sudoku/infinity/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/(en)/sudoku/metadata';
import { nightmareSudokuPageMetadata } from '../../../app/(en)/sudoku/nightmare/metadata';
import { aicPageMetadata } from '../../../app/(en)/techniques/aic/metadata';
import { cellForcingChainPageMetadata } from '../../../app/(en)/techniques/cell-forcing-chain/metadata';
import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
import { nishioForcingChainPageMetadata } from '../../../app/(en)/techniques/nishio-forcing-chain/metadata';
import { regionForcingChainPageMetadata } from '../../../app/(en)/techniques/region-forcing-chain/metadata';
import { simpleColoringPageMetadata } from '../../../app/(en)/techniques/simple-coloring/metadata';
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
export const HellSudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const hellReport = getTierTechniqueReport(DifficultyEnum.Hell);
    const nightmareReport = getTierTechniqueReport(DifficultyEnum.Nightmare);
    const { sampleSize } = hellReport;
    const hellSeRatingRange = formatSeRatingRange(hellReport);
    const nightmareSeRatingRange = formatSeRatingRange(nightmareReport);
    const nightmareClueCount = getDifficultyClueCount(DifficultyEnum.Nightmare);

    return (
        <main>
            <ArticleSchema metadata={hellSudokuPageMetadata} />
            <PageHeader metadata={hellSudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>
                    <Trans>Sudoku difficulties</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Hell</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <DifficultyBoard difficulty={DifficultyEnum.Hell}>
                <Trans>A Hell board from the same verified corpus the app uses. Play it right here.</Trans>
            </DifficultyBoard>
            <p>
                <Trans>
                    Hell is Suuudokuuu’s hardest technique-graded tier — what most competitors call evil or extreme. A Hell board is defined
                    by the reasoning it demands, not by how few clues it starts with: no Hell board can be finished with any technique
                    Nightmare allows, so every one needs a forcing chain. Unlike the generated tiers, Hell is drawn from a bundled corpus of
                    published hard puzzles, verified by two independent solvers before it ships, and every board still solves on our
                    technique ladder without guessing. Expect to use every chain and coloring pattern first —{' '}
                    <Link href={buildLocalizedPagePath(xChainPageMetadata)}>X-Chain</Link>,{' '}
                    <Link href={buildLocalizedPagePath(xyChainPageMetadata)}>XY-Chain</Link>,{' '}
                    <Link href={buildLocalizedPagePath(simpleColoringPageMetadata)}>simple coloring</Link> and{' '}
                    <Link href={buildLocalizedPagePath(aicPageMetadata)}>AIC</Link> — before a forcing chain breaks the deadlock.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>
                            Every Hell board needs a forcing chain: none can be solved with the techniques Nightmare allows, up to AIC.
                        </Trans>
                    </li>
                    <li>
                        <Trans>
                            {hellCorpusSize} verified puzzles with {HELL_CORPUS_MINIMUM_GIVEN_COUNT} to {HELL_CORPUS_MAXIMUM_GIVEN_COUNT}{' '}
                            clues, drawn from the tdoku 17-clue catalog and the magictour top1465 list rather than generated fresh.
                        </Trans>
                    </li>
                    <li>
                        <Trans>
                            Our sample of {sampleSize} Hell boards measures SE {hellSeRatingRange}.
                        </Trans>
                    </li>
                    <li>
                        <Trans>Hardness here comes from the technique each board requires, not from the clue count.</Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={buildDifficultyPlayUrl(DifficultyEnum.Hell)}>
                <Trans>Play Hell Sudoku now</Trans>
            </a>
            <h2>
                <Trans>What makes a puzzle Hell</Trans>
            </h2>
            <p>
                <Trans>
                    A chain follows an alternating sequence of strong and weak links, starting from a candidate and working outward until it
                    proves an elimination or a placement no matter which branch turns out to be true. X-Chain works on a single digit;
                    XY-Chain follows a path of bivalue cells instead. Simple coloring assigns two alternating colours to a network of strong
                    links on one digit and clears any candidate that sees both colours, and AIC generalises the whole family, mixing digits
                    and cell types along one continuous chain. Hell starts where all of that runs out. A forcing chain assumes a candidate,
                    a cell’s possibilities or a house’s placements, follows every consequence, and keeps only what holds in every branch —
                    the <Link href={buildLocalizedPagePath(nishioForcingChainPageMetadata)}>Nishio</Link>,{' '}
                    <Link href={buildLocalizedPagePath(cellForcingChainPageMetadata)}>cell</Link> and{' '}
                    <Link href={buildLocalizedPagePath(regionForcingChainPageMetadata)}>region forcing chain</Link> pages walk through one
                    of each. A board makes the Hell corpus only if its hardest step on the rating-optimal path is a forcing chain, and only
                    if our ladder can still finish it, so no Hell board ever asks you to guess.
                </Trans>
            </p>
            <h2>
                <Trans>How hard is it, honestly</Trans>
            </h2>
            <p>
                <Trans>
                    Our sample of {sampleSize} Hell boards measures SE (Sudoku Explainer) {hellSeRatingRange}, with the{' '}
                    <TechniqueLink technique={hellReport.typicalHardestTechnique} /> as the most common hardest step and the{' '}
                    <TechniqueLink technique={hellReport.hardestTechniqueReached} /> as the hardest step anything in the sample reached. Be
                    careful not to read the clue count as the cause: the same sample puts{' '}
                    <Link href={buildLocalizedPagePath(nightmareSudokuPageMetadata)}>Nightmare</Link> at SE {nightmareSeRatingRange} with{' '}
                    {nightmareClueCount} clues, and some Hell boards start with more givens than that. This tier used to be built from
                    17-clue puzzles alone, and it rated no harder than Nightmare; selecting on the required technique instead is what
                    separates the two. Our{' '}
                    <Link href={buildLocalizedPagePath(sudokuCluesVsDifficultyPageMetadata)}>clues versus difficulty guide</Link> takes that
                    argument apart properly, and the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>rating guide</Link> publishes the per-tier
                    tables.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    Finished a Hell board and want more?{' '}
                    <Link href={buildLocalizedPagePath(infinitySudokuPageMetadata)}>Infinity Sudoku</Link> serves the record puzzles —
                    Everest, Platinum Blonde, AI Escargot — that sit past even our forcing chains. Not ready for chains yet? Step back to{' '}
                    <Link href={buildLocalizedPagePath(nightmareSudokuPageMetadata)}>Nightmare Sudoku</Link>, which asks for the same
                    reasoning with more of the grid already filled in. Prefer paper? Download the{' '}
                    <Link href={buildLocalizedPagePath(printableHellSudokuPageMetadata)}>printable Hell sudoku PDF</Link>. Browse the{' '}
                    <Link href={buildLocalizedPagePath(techniquesPageMetadata)}>technique index</Link>, especially X-Chain, XY-Chain, Simple
                    Coloring and AIC, the <Link href={buildLocalizedPagePath(howToPlayPageMetadata)}>how to play guide</Link>, the{' '}
                    <Link href={buildLocalizedPagePath(seventeenClueSudokuPageMetadata)}>17-clue sudoku guide</Link>, every tier on the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>Sudoku difficulty levels</Link> hub, or head{' '}
                    <Link href={buildLocalizedPagePath(homePageMetadata)}>home</Link>.
                </Trans>
            </p>
            <StoreBadges campaign={StoreBadgeCampaignEnum.DIFFICULTY} />
            <FaqPage>
                <FaqHeading>
                    <Trans>Hell Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>What techniques do I need for Hell level?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            A forcing chain, on every board, layered on top of the chains, coloring, fish, wings and subsets the earlier
                            tiers already require. X-Chain, XY-Chain, Simple Coloring and AIC will carry you far, but never all the way
                            through; a <Link href={buildLocalizedPagePath(nishioForcingChainPageMetadata)}>Nishio forcing chain</Link> is
                            the usual way to break the deadlock.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many clues does a Hell sudoku have?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Anywhere from {HELL_CORPUS_MINIMUM_GIVEN_COUNT} to {HELL_CORPUS_MAXIMUM_GIVEN_COUNT}. Hell does not use clue
                            count to choose its puzzles; a board qualifies by needing a forcing chain, whatever its number of givens.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is Hell harder than Nightmare?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Yes, by construction. Nightmare stops at AIC, and no Hell board can be solved with anything Nightmare allows.
                            Our sample measures Hell at SE {hellSeRatingRange} and Nightmare at SE {nightmareSeRatingRange}.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Why does Hell use a fixed puzzle corpus instead of generating puzzles?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Boards that need a forcing chain are rare and expensive to search for on demand, so Suuudokuuu ships a bundled
                            corpus that has already been checked by a Dancing Links exact-cover solver and a bitmask solver, rated, and
                            filtered to forcing-chain boards before it is packed.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={infinitySudokuPageMetadata} previous={nightmareSudokuPageMetadata} />
        </main>
    );
};
