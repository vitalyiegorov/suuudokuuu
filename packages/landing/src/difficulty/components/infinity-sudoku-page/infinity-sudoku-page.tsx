import { Trans } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { INFINITY_CORPUS_MINIMUM_RATING, infinityCorpusSize } from '@suuudokuuu/hell-corpus';
import { SE_RATING_CEILING } from '@suuudokuuu/rating';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import Link from 'next/link';

import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../../../app/(en)/hardest-sudoku-puzzles/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableInfinitySudokuPageMetadata } from '../../../app/(en)/printable/infinity/metadata';
import { hellSudokuPageMetadata } from '../../../app/(en)/sudoku/hell/metadata';
import { infinitySudokuPageMetadata } from '../../../app/(en)/sudoku/infinity/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/(en)/sudoku/metadata';
import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
import { StoreBadges } from '../../../chrome/components/store-badges/store-badges';
import { StoreBadgeCampaignEnum } from '../../../chrome/enums/store-badge-campaign.enum';
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
import {
    INFINITY_HIGHEST_RATING,
    INFINITY_LOWEST_RATING,
    INFINITY_MAXIMUM_GIVEN_COUNT,
    INFINITY_MINIMUM_GIVEN_COUNT
} from '../../constants/infinity-corpus.constant';
import { buildDifficultyPlayUrl } from '../../utils/build-difficulty-play-url.util';
import { DifficultyBoard } from '../difficulty-board/difficulty-board';
import { DifficultyNavigation } from '../difficulty-navigation/difficulty-navigation';

import type { LocaleType } from '../../../seo/types/locale.type';

interface Props {
    locale: LocaleType;
}

const EVEREST_GIVENS = '800000000003600000070090200050007000000045700000100030001000068008500010090000400';

const lowestRatingLabel = INFINITY_LOWEST_RATING.toFixed(1);
const highestRatingLabel = INFINITY_HIGHEST_RATING.toFixed(1);
const minimumRatingLabel = INFINITY_CORPUS_MINIMUM_RATING.toFixed(1);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
export const InfinitySudokuPage = ({ locale }: Props) => {
    activateLocale(locale);
    const hellReport = getTierTechniqueReport(DifficultyEnum.Hell);
    const { sampleSize } = hellReport;
    const hellSeRatingRange = formatSeRatingRange(hellReport);
    const additionalPuzzleCount = infinityCorpusSize - 4;

    return (
        <main>
            <ArticleSchema metadata={infinitySudokuPageMetadata} />
            <PageHeader metadata={infinitySudokuPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem path={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>
                    <Trans>Sudoku difficulties</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Infinity</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <DifficultyBoard difficulty={DifficultyEnum.Infinity}>
                <Trans>An Infinity record puzzle from the same curated set the app uses, reshuffled. Play it right here.</Trans>
            </DifficultyBoard>
            <p>
                <Trans>
                    Infinity is Suuudokuuu’s tier beyond Hell: a curated set of the hardest sudoku puzzles ever published, the record grids
                    the solving community still argues about, ready to play for free. Every Infinity board is a known puzzle with a
                    published Sudoku Explainer (SE) rating of at least {minimumRatingLabel} — Arto Inkala’s Everest, Platinum Blonde, AI
                    Escargot, Golden Nugget and {additionalPuzzleCount} more — checked for a single solution before it ships. These are the
                    puzzles our <Link href={buildLocalizedPagePath(hardestSudokuPuzzlesPageMetadata)}>hardest sudoku puzzles</Link> guide
                    describes; Infinity is where you play them.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>
                            {infinityCorpusSize} record puzzles with {INFINITY_MINIMUM_GIVEN_COUNT} to {INFINITY_MAXIMUM_GIVEN_COUNT} clues,
                            published at SE {lowestRatingLabel} to {highestRatingLabel}.
                        </Trans>
                    </li>
                    <li>
                        <Trans>Includes Everest (SE 11.9), Platinum Blonde (SE 10.9) and AI Escargot (SE 10.6).</Trans>
                    </li>
                    <li>
                        <Trans>Every board is checked for exactly one solution by two independent solving algorithms.</Trans>
                    </li>
                    <li>
                        <Trans>Each game reshuffles the grid, so a familiar record puzzle never looks the same twice.</Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={buildDifficultyPlayUrl(DifficultyEnum.Infinity)}>
                <Trans>Play Infinity Sudoku now</Trans>
            </a>
            <h2>
                <Trans>What makes a puzzle Infinity</Trans>
            </h2>
            <p>
                <Trans>
                    The other tiers are defined by the techniques they require. Infinity is defined by reputation, measured: a puzzle
                    qualifies only if independent raters have published an SE rating of {minimumRatingLabel} or higher for it. Most of the{' '}
                    {infinityCorpusSize} come from a 2011 snapshot of the hardest-puzzle database the sudoku-solving community maintains;
                    the rest are the named classics, taken from the forum threads and publications where they first appeared. Before the set
                    is packed into the app, a Dancing Links exact-cover solver and a bitmask solver both confirm that every grid has exactly
                    one solution.
                </Trans>
            </p>
            <p>
                <Trans>
                    When you start an Infinity game, the app picks one of those puzzles and disguises it. It relabels the digits, shuffles
                    rows within their bands, columns within their stacks and the bands and stacks themselves, and sometimes mirrors the grid
                    across its diagonal. None of that changes the logic or the rating, so the Everest you play is still Everest, it just
                    does not look like the picture below.
                </Trans>
            </p>
            <PuzzleBoard givens={EVEREST_GIVENS}>
                <Trans>Arto Inkala’s Everest (2010), 21 givens, published at SE 11.9.</Trans>
            </PuzzleBoard>
            <h2>
                <Trans>How hard is it, honestly</Trans>
            </h2>
            <p>
                <Trans>
                    Harder than anything else in the app, by a wide margin. Our sample of {sampleSize}{' '}
                    <Link href={buildLocalizedPagePath(hellSudokuPageMetadata)}>Hell</Link> boards measures SE {hellSeRatingRange}; Infinity
                    starts at {lowestRatingLabel}. The Infinity ratings are not our own measurements. Suuudokuuu’s rater prices the SE
                    ladder only as far as forcing chains and nets and reports {SE_RATING_CEILING} with a ceiling flag above that, so for
                    these puzzles we quote the figures independent raters publish, as the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>difficulty rating guide</Link> explains.
                </Trans>
            </p>
            <p>
                <Trans>
                    Our technique engine agrees that these boards sit past its reach. It knows every pattern on the{' '}
                    <Link href={buildLocalizedPagePath(techniquesPageMetadata)}>technique index</Link>, up to the{' '}
                    <TechniqueLink technique={SolutionTechniqueEnum.NishioForcingChain} /> and the{' '}
                    <TechniqueLink technique={SolutionTechniqueEnum.RegionForcingChain} />, and it still cannot finish a single Infinity
                    puzzle on its own. That does not mean they need guessing; it means they need longer forcing nets than the engine
                    implements. Hints are off by default on Nightmare, Hell and Infinity, and a setting turns them back on if you want the
                    engine’s help for as far as it goes.
                </Trans>
            </p>
            <h2>
                <Trans>Where to go next</Trans>
            </h2>
            <p>
                <Trans>
                    Want the record puzzles on paper? Download the{' '}
                    <Link href={buildLocalizedPagePath(printableInfinitySudokuPageMetadata)}>printable Infinity sudoku PDF</Link>. Not ready
                    for them yet? Step back to <Link href={buildLocalizedPagePath(hellSudokuPageMetadata)}>Hell Sudoku</Link>, where every
                    board needs a forcing chain but stays within reach of our technique ladder. Read the stories behind Everest and AI
                    Escargot on the <Link href={buildLocalizedPagePath(hardestSudokuPuzzlesPageMetadata)}>hardest sudoku puzzles</Link>{' '}
                    page, compare every tier on the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>Sudoku difficulty levels</Link> hub, or head{' '}
                    <Link href={buildLocalizedPagePath(homePageMetadata)}>home</Link>.
                </Trans>
            </p>
            <StoreBadges campaign={StoreBadgeCampaignEnum.DIFFICULTY} />
            <FaqPage>
                <FaqHeading>
                    <Trans>Infinity Sudoku FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>What is Infinity sudoku?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Suuudokuuu’s hardest tier: {infinityCorpusSize} of the hardest sudoku puzzles ever published, each with a
                            published SE rating of {minimumRatingLabel} or more, playable for free with no ads.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Can I play AI Escargot and Everest here?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Yes. Both are in the Infinity set, along with Platinum Blonde and Golden Nugget. Each game reshuffles digits,
                            rows and columns, so the grid looks different every time while the puzzle stays the same.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is Infinity harder than Hell?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Yes. Our sample measures Hell at SE {hellSeRatingRange}, and every Infinity puzzle carries a published rating
                            between {lowestRatingLabel} and {highestRatingLabel}. Hell boards still yield to our technique ladder; Infinity
                            boards do not.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Do Infinity puzzles have a unique solution?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Yes. Every grid is checked by a Dancing Links exact-cover solver and a bitmask solver before it ships, and each
                            has exactly one solution.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation previous={hellSudokuPageMetadata} />
        </main>
    );
};
