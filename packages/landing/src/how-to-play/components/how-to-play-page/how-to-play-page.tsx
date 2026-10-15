import { Trans, useLingui } from '@lingui/react/macro';
import Link from 'next/link';

import { glossaryPageMetadata } from '../../../app/(en)/glossary/metadata';
import { howToPlayPageMetadata } from '../../../app/(en)/how-to-play/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableNewbieSudokuPageMetadata } from '../../../app/(en)/printable/newbie/metadata';
import { infinitySudokuPageMetadata } from '../../../app/(en)/sudoku/infinity/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/(en)/sudoku/metadata';
import { hiddenSinglePageMetadata } from '../../../app/(en)/techniques/hidden-single/metadata';
import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
import { nakedSinglePageMetadata } from '../../../app/(en)/techniques/naked-single/metadata';
import { activateLocale } from '../../../i18n/utils/activate-locale.util';
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { HowToStep } from '../../../seo/components/how-to-step/how-to-step';
import { HowTo } from '../../../seo/components/how-to/how-to';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildLocalizedPagePath } from '../../../seo/utils/build-localized-page-path.util';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { HowToPlayFaq } from '../how-to-play-faq/how-to-play-faq';

import type { LocaleType } from '../../../seo/types/locale.type';

interface Props {
    locale: LocaleType;
}

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
export const HowToPlayPage = ({ locale }: Props) => {
    activateLocale(locale);
    const { t } = useLingui();

    return (
        <main>
            <ArticleSchema metadata={howToPlayPageMetadata} />
            <PageHeader metadata={howToPlayPageMetadata}>
                <BreadcrumbListItem path={buildLocalizedPagePath(homePageMetadata)}>
                    <Trans>Home</Trans>
                </BreadcrumbListItem>
                <BreadcrumbListItem>
                    <Trans>How to play</Trans>
                </BreadcrumbListItem>
            </PageHeader>
            <p>
                <Trans>
                    Sudoku is a logic puzzle played on a 9×9 grid, divided into nine 3×3 boxes. The goal is to fill every empty cell with a
                    digit from 1 to 9 so that no digit repeats in any row, column or box. A well-formed Sudoku always starts with some cells
                    already filled in — the givens, or clues — and always has exactly one valid solution reachable by logic alone, with no
                    guessing.
                </Trans>
            </p>
            <p>
                <Trans>
                    The grid itself never changes: nine rows, nine columns and nine boxes, eighty-one cells in total. What changes from
                    puzzle to puzzle is only which cells start filled and which digits they hold, and it is that starting layout of givens
                    that determines how much logic is needed to reach the one valid solution.
                </Trans>
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        <Trans>
                            Fill every empty cell with a digit from 1 to 9 so that no digit repeats in a row, a column or a 3×3 box.
                        </Trans>
                    </li>
                    <li>
                        <Trans>A well-formed puzzle always has exactly one solution and never requires a guess.</Trans>
                    </li>
                    <li>
                        <Trans>Solve the cheapest placements first: full houses, then naked singles, then hidden singles.</Trans>
                    </li>
                    <li>
                        <Trans>Write candidates into a cell only once scanning stops producing placements.</Trans>
                    </li>
                    <li>
                        <Trans>
                            Every named technique is a faster way of tracking the same row, column and box overlap across many cells at
                            once.
                        </Trans>
                    </li>
                </ul>
            </TechniqueSummary>
            <h2>
                <Trans>The three rules of Sudoku</Trans>
            </h2>
            <p>
                <Trans>
                    Every Sudoku rule is really the same constraint applied to three different kinds of unit. Learn the constraint once and
                    you already know all three rules.
                </Trans>
            </p>
            <ul className="link-list">
                <li>
                    <Trans>
                        <strong>Row rule.</strong> Each of the nine rows must contain the digits 1 to 9 exactly once each.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <strong>Column rule.</strong> Each of the nine columns must contain the digits 1 to 9 exactly once each.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <strong>Box rule.</strong> Each of the nine 3×3 boxes must contain the digits 1 to 9 exactly once each.
                    </Trans>
                </li>
            </ul>
            <p>
                <Trans>
                    A finished grid satisfies all three at the same time. That overlap is what makes Sudoku solvable by logic: a digit that
                    is already ruled out by its row, its column and its box has nowhere left to go, which is the basis of almost every
                    solving technique. Every named technique on this site, from the simplest single to the longest chain, is ultimately just
                    a more efficient way of tracking that overlap across many cells at once instead of one cell at a time.
                </Trans>
            </p>
            <h2>
                <Trans>Solving your first cells</Trans>
            </h2>
            <p>
                <Trans>
                    Do not scan for the hardest cell first. Start by looking for the easiest possible placements, because clearing those
                    first makes every later cell easier too.
                </Trans>
            </p>
            <p>
                <Trans>
                    The very first thing to check is whether a box, row or column is missing only one digit. If eight of the nine cells in a
                    unit are already filled, the ninth cell must take the digit the unit is still missing — no candidates to compare, just
                    subtraction.
                </Trans>
            </p>
            <p>
                <Trans>
                    After that, look at a single blank cell and cross off every digit that already appears in its row, its column and its
                    box. If only one digit survives, that is a{' '}
                    <Link href={buildLocalizedPagePath(nakedSinglePageMetadata)}>naked single</Link>, and it can be placed immediately. If a
                    cell still has several candidates left, check whether one of those candidates cannot go anywhere else in the same unit —
                    that is a <Link href={buildLocalizedPagePath(hiddenSinglePageMetadata)}>hidden single</Link>, and it is just as safe to
                    place. Together these two patterns solve most of an easy puzzle without any deeper reasoning.
                </Trans>
            </p>
            <h2>
                <Trans>Notes and candidates</Trans>
            </h2>
            <p>
                <Trans>
                    Once the easy placements run out, tracking candidates by hand becomes essential. A candidate, sometimes called a pencil
                    mark, is a digit that a cell could still legally hold based on what its row, column and box already contain. Writing
                    every candidate into a cell — on paper as small numbers in the corner, or with the notes mode in an app — turns a puzzle
                    that looks stuck into one where patterns become visible: pairs, triples and quads of candidates that repeat across a
                    unit are exactly what techniques like naked pairs and hidden pairs are built to spot. The full method for every pattern
                    lives in the <Link href={buildLocalizedPagePath(techniquesPageMetadata)}>sudoku techniques index</Link>, and every term
                    used across these guides is defined in the{' '}
                    <Link href={buildLocalizedPagePath(glossaryPageMetadata)}>sudoku glossary</Link>.
                </Trans>
            </p>
            <h2>
                <Trans>Sudoku difficulty levels</Trans>
            </h2>
            <p>
                <Trans>
                    Suuudokuuu has seven difficulty levels: six that each require a wider set of techniques than the last, and Infinity.
                </Trans>
            </p>
            <ul className="link-list">
                <li>
                    <Trans>
                        <strong>Newbie.</strong> Solvable with full houses and naked singles alone.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <strong>Easy.</strong> Adds hidden singles, still no candidate tracking required.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <strong>Medium.</strong> Always stalls on singles and always yields to intersections and subsets — pointing pairs,
                        box line reduction, naked and hidden pairs through quads.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <strong>Hard.</strong> Always stalls on subsets and always yields to a fish or a wing pattern.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <strong>Nightmare.</strong> Always stalls on fish and wings and always yields to chain or coloring logic.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <strong>Hell.</strong> Always stalls on chains and AIC and always needs a forcing chain, drawn from a bundled,
                        verified corpus.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <strong>Infinity.</strong> The hardest sudoku puzzles ever published, such as Everest and AI Escargot, chosen by
                        their published rating rather than a technique band — see the{' '}
                        <Link href={buildLocalizedPagePath(infinitySudokuPageMetadata)}>Infinity lander</Link>.
                    </Trans>
                </li>
            </ul>
            <p>
                <Trans>
                    Every level is free to play, with no ads and no sign-up. <a href={SITE_PLAY_URL}>Play a puzzle now</a> at any of the
                    seven levels, or read the full breakdown of clue counts and required techniques on the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>Sudoku difficulty levels</Link> hub. Learning on
                    paper? Start with the{' '}
                    <Link href={buildLocalizedPagePath(printableNewbieSudokuPageMetadata)}>printable Newbie sudoku PDF</Link>.
                </Trans>
            </p>
            <h2>
                <Trans>Getting started</Trans>
            </h2>
            <HowTo name={t`How to start solving a Sudoku puzzle`}>
                <HowToStep name={t`Scan for missing units`}>
                    <Trans>
                        Check every row, column and box for one that already has eight of its nine cells filled, and place the missing digit
                        in the empty one.
                    </Trans>
                </HowToStep>
                <HowToStep name={t`Cross off candidates cell by cell`}>
                    <Trans>
                        For each remaining blank cell, rule out every digit already used in its row, column and box. If exactly one digit is
                        left, place it.
                    </Trans>
                </HowToStep>
                <HowToStep name={t`Look for hidden singles`}>
                    <Trans>
                        For each unit with several blank cells, check whether a digit that is still missing from the unit only fits in one
                        of them, even if that cell has other candidates too.
                    </Trans>
                </HowToStep>
                <HowToStep name={t`Write in candidates once the easy cells run out`}>
                    <Trans>
                        Pencil in every remaining candidate for the blank cells that are left, then work through the technique index in
                        difficulty order to keep clearing them.
                    </Trans>
                </HowToStep>
            </HowTo>
            <HowToPlayFaq />
        </main>
    );
};
