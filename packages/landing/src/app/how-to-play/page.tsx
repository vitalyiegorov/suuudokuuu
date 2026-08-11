import Link from 'next/link';

import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../seo/components/breadcrumbs/breadcrumbs';
import { Faq } from '../../seo/components/faq/faq';
import { FaqAnswer } from '../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../seo/components/faq-question/faq-question';
import { HowTo } from '../../seo/components/how-to/how-to';
import { HowToStep } from '../../seo/components/how-to-step/how-to-step';
import { SITE_PLAY_URL } from '../../seo/constants/site.constant';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { glossaryPageMetadata } from '../glossary/metadata';
import { homePageMetadata } from '../metadata';
import { sudokuDifficultiesPageMetadata } from '../sudoku/metadata';
import { hiddenSinglePageMetadata } from '../techniques/hidden-single/metadata';
import { techniquesPageMetadata } from '../techniques/metadata';
import { nakedSinglePageMetadata } from '../techniques/naked-single/metadata';

import { howToPlayPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(howToPlayPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const HowToPlayPage = () => (
    <main>
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>How to play</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>How to Play Sudoku</h1>
        <p>
            Sudoku is a logic puzzle played on a 9×9 grid, divided into nine 3×3 boxes. The goal is to fill every empty cell with a digit
            from 1 to 9 so that no digit repeats in any row, column or box. A well-formed Sudoku always starts with some cells already
            filled in — the givens, or clues — and always has exactly one valid solution reachable by logic alone, with no guessing.
        </p>
        <p>
            The grid itself never changes: nine rows, nine columns and nine boxes, eighty-one cells in total. What changes from puzzle to
            puzzle is only which cells start filled and which digits they hold, and it is that starting layout of givens that determines how
            much logic is needed to reach the one valid solution.
        </p>
        <h2>The three rules of Sudoku</h2>
        <p>
            Every Sudoku rule is really the same constraint applied to three different kinds of unit. Learn the constraint once and you
            already know all three rules.
        </p>
        <ul className="link-list">
            <li>
                <strong>Row rule.</strong> Each of the nine rows must contain the digits 1 to 9 exactly once each.
            </li>
            <li>
                <strong>Column rule.</strong> Each of the nine columns must contain the digits 1 to 9 exactly once each.
            </li>
            <li>
                <strong>Box rule.</strong> Each of the nine 3×3 boxes must contain the digits 1 to 9 exactly once each.
            </li>
        </ul>
        <p>
            A finished grid satisfies all three at the same time. That overlap is what makes Sudoku solvable by logic: a digit that is
            already ruled out by its row, its column and its box has nowhere left to go, which is the basis of almost every solving
            technique. Every named technique on this site, from the simplest single to the longest chain, is ultimately just a more
            efficient way of tracking that overlap across many cells at once instead of one cell at a time.
        </p>
        <h2>Solving your first cells</h2>
        <p>
            Do not scan for the hardest cell first. Start by looking for the easiest possible placements, because clearing those first makes
            every later cell easier too.
        </p>
        <p>
            The very first thing to check is whether a box, row or column is missing only one digit. If eight of the nine cells in a unit
            are already filled, the ninth cell must take the digit the unit is still missing — no candidates to compare, just subtraction.
        </p>
        <p>
            After that, look at a single blank cell and cross off every digit that already appears in its row, its column and its box. If
            only one digit survives, that is a <Link href={nakedSinglePageMetadata.path}>naked single</Link>, and it can be placed
            immediately. If a cell still has several candidates left, check whether one of those candidates cannot go anywhere else in the
            same unit — that is a <Link href={hiddenSinglePageMetadata.path}>hidden single</Link>, and it is just as safe to place. Together
            these two patterns solve most of an easy puzzle without any deeper reasoning.
        </p>
        <h2>Notes and candidates</h2>
        <p>
            Once the easy placements run out, tracking candidates by hand becomes essential. A candidate, sometimes called a pencil mark, is
            a digit that a cell could still legally hold based on what its row, column and box already contain. Writing every candidate into
            a cell — on paper as small numbers in the corner, or with the notes mode in an app — turns a puzzle that looks stuck into one
            where patterns become visible: pairs, triples and quads of candidates that repeat across a unit are exactly what techniques like
            naked pairs and hidden pairs are built to spot. The full method for every pattern lives in the{' '}
            <Link href={techniquesPageMetadata.path}>sudoku techniques index</Link>, and every term used across these guides is defined in
            the <Link href={glossaryPageMetadata.path}>sudoku glossary</Link>.
        </p>
        <h2>Sudoku difficulty levels</h2>
        <p>Suuudokuuu’s difficulty ladder has six tiers, each requiring a wider set of techniques than the last.</p>
        <ul className="link-list">
            <li>
                <strong>Newbie.</strong> Solvable with full houses and naked singles alone.
            </li>
            <li>
                <strong>Easy.</strong> Adds hidden singles, still no candidate tracking required.
            </li>
            <li>
                <strong>Medium.</strong> Introduces pointing pairs, pointing triples, box line reduction and the first naked and hidden
                pairs.
            </li>
            <li>
                <strong>Hard.</strong> Requires naked and hidden triples and quads, plus your first fish pattern.
            </li>
            <li>
                <strong>Nightmare.</strong> Needs fish patterns and wings on top of every earlier technique.
            </li>
            <li>
                <strong>Hell.</strong> Drawn from a bundled, verified 17-clue corpus — the minimum number of clues a Sudoku can have.
            </li>
        </ul>
        <p>
            Every level is free to play, with no ads and no sign-up. <a href={SITE_PLAY_URL}>Play a puzzle now</a> at any of the six levels,
            or read the full breakdown of clue counts and required techniques on the{' '}
            <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub.
        </p>
        <h2>Getting started</h2>
        <HowTo name="How to start solving a Sudoku puzzle">
            <HowToStep name="Scan for missing units">
                Check every row, column and box for one that already has eight of its nine cells filled, and place the missing digit in the
                empty one.
            </HowToStep>
            <HowToStep name="Cross off candidates cell by cell">
                For each remaining blank cell, rule out every digit already used in its row, column and box. If exactly one digit is left,
                place it.
            </HowToStep>
            <HowToStep name="Look for hidden singles">
                For each unit with several blank cells, check whether a digit that is still missing from the unit only fits in one of them,
                even if that cell has other candidates too.
            </HowToStep>
            <HowToStep name="Write in candidates once the easy cells run out">
                Pencil in every remaining candidate for the blank cells that are left, then work through the technique index in difficulty
                order to keep clearing them.
            </HowToStep>
        </HowTo>
        <h2>How to play Sudoku FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Can a Sudoku have two solutions?</FaqQuestion>
                <FaqAnswer>
                    A well-formed Sudoku never does. If a puzzle has more than one valid completion it is considered broken, because logic
                    alone can no longer point to a single answer.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do you ever have to guess?</FaqQuestion>
                <FaqAnswer>
                    No. Every puzzle Suuudokuuu generates is checked for a unique solution at generation time, so no cell ever requires a
                    guess — and the bundled Hell-difficulty puzzles are additionally cross-checked by two independent solving algorithms, a
                    Dancing Links exact-cover solver and a bitmask solver, before they ship. Any position that looks ambiguous just needs a
                    technique that has not been tried yet.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What is the difference between a clue and a candidate?</FaqQuestion>
                <FaqAnswer>
                    A clue, or given, is a digit printed on the board before you start. A candidate is a digit you are still considering for
                    a blank cell, based on what its row, column and box currently rule out.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do I need pen and paper to solve Sudoku?</FaqQuestion>
                <FaqAnswer>
                    No. Notes mode in an app tracks candidates for you, updates them automatically as you place digits, and lets you undo a
                    mistake without erasing.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What is the fastest way to get better at Sudoku?</FaqQuestion>
                <FaqAnswer>
                    Learn techniques in difficulty order rather than memorising every pattern at once. The{' '}
                    <Link href={techniquesPageMetadata.path}>sudoku techniques index</Link> lists them from full house up to the subset
                    patterns, each with a worked example.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default HowToPlayPage;
