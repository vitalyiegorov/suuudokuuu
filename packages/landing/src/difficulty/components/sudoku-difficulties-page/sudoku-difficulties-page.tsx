import { Trans } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { infinityCorpusSize } from '@suuudokuuu/hell-corpus';
import Link from 'next/link';

import { sudokuCluesVsDifficultyPageMetadata } from '../../../app/(en)/guides/sudoku-clues-vs-difficulty/metadata';
import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../../app/(en)/how-to-play/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { easySudokuPageMetadata } from '../../../app/(en)/sudoku/easy/metadata';
import { hardSudokuPageMetadata } from '../../../app/(en)/sudoku/hard/metadata';
import { hellSudokuPageMetadata } from '../../../app/(en)/sudoku/hell/metadata';
import { infinitySudokuPageMetadata } from '../../../app/(en)/sudoku/infinity/metadata';
import { mediumSudokuPageMetadata } from '../../../app/(en)/sudoku/medium/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/(en)/sudoku/metadata';
import { newbieSudokuPageMetadata } from '../../../app/(en)/sudoku/newbie/metadata';
import { nightmareSudokuPageMetadata } from '../../../app/(en)/sudoku/nightmare/metadata';
import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
import { activateLocale } from '../../../i18n/utils/activate-locale.util';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { ItemListSchema } from '../../../seo/components/item-list-schema/item-list-schema';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildLocalizedPagePath } from '../../../seo/utils/build-localized-page-path.util';
import { INFINITY_HIGHEST_RATING, INFINITY_LOWEST_RATING } from '../../constants/infinity-corpus.constant';
import { getDifficultyClueCount } from '../../utils/get-difficulty-clue-count.util';

import type { LocaleType } from '../../../seo/types/locale.type';

interface Props {
    locale: LocaleType;
}

const DIFFICULTY_ITEMS = [
    newbieSudokuPageMetadata,
    easySudokuPageMetadata,
    mediumSudokuPageMetadata,
    hardSudokuPageMetadata,
    nightmareSudokuPageMetadata,
    hellSudokuPageMetadata,
    infinitySudokuPageMetadata
];

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
export const SudokuDifficultiesPage = ({ locale }: Props) => {
    activateLocale(locale);
    const newbieClueCount = getDifficultyClueCount(DifficultyEnum.Newbie);
    const easyClueCount = getDifficultyClueCount(DifficultyEnum.Easy);
    const mediumClueCount = getDifficultyClueCount(DifficultyEnum.Medium);
    const hardClueCount = getDifficultyClueCount(DifficultyEnum.Hard);
    const nightmareClueCount = getDifficultyClueCount(DifficultyEnum.Nightmare);
    const infinityLowestRating = INFINITY_LOWEST_RATING.toFixed(1);
    const infinityHighestRating = INFINITY_HIGHEST_RATING.toFixed(1);

    return (
        <main>
            <PageHeader metadata={sudokuDifficultiesPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>Sudoku difficulties</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <ItemListSchema items={DIFFICULTY_ITEMS} metadata={sudokuDifficultiesPageMetadata} />
            <p>
                <Trans>
                    Suuudokuuu grades its puzzles on a six-tier ladder, from Newbie through Hell, and each tier is defined by two concrete
                    facts rather than a marketing label: how many clues the grid starts with, and which named solving techniques the tier is
                    guaranteed to require. Every new board is also rated on the SE (Sudoku Explainer) scale the moment it is created, by the
                    same open-source rating package the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultyRatingPageMetadata)}>sudoku difficulty rating guide</Link> uses to
                    publish the measured band and SE range of every ladder tier below. Above the ladder sits{' '}
                    <Link href={buildLocalizedPagePath(infinitySudokuPageMetadata)}>Infinity</Link>, a curated set of record puzzles that
                    carry the ratings independent raters publish, because they reach past the top of our own rating scale.
                </Trans>
            </p>
            <a className="hero__cta" href={SITE_PLAY_URL}>
                <Trans>Play now</Trans>
            </a>
            <ul className="link-list">
                <li>
                    <Trans>
                        <Link href={buildLocalizedPagePath(newbieSudokuPageMetadata)}>Newbie</Link> — {newbieClueCount} clues, solved with
                        full houses and naked singles alone.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <Link href={buildLocalizedPagePath(easySudokuPageMetadata)}>Easy</Link> — {easyClueCount} clues, guaranteed to need
                        at least one hidden single and never more than that.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <Link href={buildLocalizedPagePath(mediumSudokuPageMetadata)}>Medium</Link> — {mediumClueCount} clues, guaranteed to
                        stall on singles and to yield to intersections and subsets.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <Link href={buildLocalizedPagePath(hardSudokuPageMetadata)}>Hard</Link> — {hardClueCount} clues, guaranteed to stall
                        on subsets and to yield to fish and wing patterns.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <Link href={buildLocalizedPagePath(nightmareSudokuPageMetadata)}>Nightmare</Link> — {nightmareClueCount} clues,
                        guaranteed to stall on wings and to yield to chains and coloring.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <Link href={buildLocalizedPagePath(hellSudokuPageMetadata)}>Hell</Link> — guaranteed to stall on AIC and to need a
                        forcing chain, drawn from a bundled, verified corpus rather than generated to a band.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <Link href={buildLocalizedPagePath(infinitySudokuPageMetadata)}>Infinity</Link> — {infinityCorpusSize} of the
                        hardest puzzles ever published, chosen by their published SE rating of {infinityLowestRating} to{' '}
                        {infinityHighestRating} rather than by a technique band, and past the reach of every technique on the ladder.
                    </Trans>
                </li>
            </ul>
            <h2>
                <Trans>How the ladder is built</Trans>
            </h2>
            <p>
                <Trans>
                    Clue count is not the difficulty. It is only the input: fewer starting digits mean fewer immediate placements, which
                    forces the solver — human or machine — to reach for a wider set of named techniques before the grid moves again.
                    Suuudokuuu strips digits from a solved grid down to a per-tier target, verifies the result still has exactly one
                    solution, and then does the part that actually defines the tier: it solves the candidate twice, once with the technique
                    ladder of the tier below and once with its own, and keeps the board only if the first solve fails and the second
                    succeeds. Boards that miss are discarded and a fresh one is generated. That is why each tier above is stated as a
                    guarantee rather than a hope. The{' '}
                    <Link href={buildLocalizedPagePath(techniquesPageMetadata)}>full technique index</Link> lists every pattern that ladder
                    contains, in the order a solver tries them. Within a band two boards can still differ a lot —{' '}
                    <Link href={buildLocalizedPagePath(sudokuCluesVsDifficultyPageMetadata)}>clues versus difficulty</Link> measures exactly
                    how much.
                </Trans>
            </p>
            <p>
                <Trans>
                    New to the grid itself? Start with the{' '}
                    <Link href={buildLocalizedPagePath(howToPlayPageMetadata)}>how to play guide</Link> for the three rules and your first
                    placements before picking a tier above.
                </Trans>
            </p>
            <FaqPage>
                <FaqHeading>
                    <Trans>Sudoku difficulty levels FAQ</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>How many sudoku difficulty levels does Suuudokuuu have?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Seven. Newbie, Easy, Medium, Hard, Nightmare and Hell form the technique ladder, each defined by a clue count
                            and a guaranteed technique band rather than a marketing label. Infinity sits above them, a curated set of record
                            puzzles chosen by published rating.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Does a lower clue count always mean a harder puzzle?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            No. Clue count is only the input that forces a solver toward a wider technique set; the technique band the
                            generator verifies is what actually defines each tier. The{' '}
                            <Link href={buildLocalizedPagePath(sudokuCluesVsDifficultyPageMetadata)}>clues versus difficulty guide</Link>{' '}
                            measures the gap directly.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>How does Suuudokuuu guarantee a tier’s technique requirement?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Every candidate board is solved twice: once with the tier below’s technique ladder, which must fail, and once
                            with its own ladder, which must succeed. Boards that miss either test are discarded and regenerated.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Which sudoku difficulty should I start with?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            New solvers should start at Newbie and move up one tier at a time; each step adds exactly one new technique over
                            the tier before it, all the way up to Hard. See the{' '}
                            <Link href={buildLocalizedPagePath(howToPlayPageMetadata)}>how to play guide</Link> first if the three core
                            rules are still unfamiliar.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
        </main>
    );
};
