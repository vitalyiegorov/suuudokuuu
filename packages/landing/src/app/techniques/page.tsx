import Link from 'next/link';

import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../seo/components/breadcrumbs/breadcrumbs';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { homePageMetadata } from '../metadata';

import { boxLineReductionPageMetadata } from './box-line-reduction/metadata';
import { fullHousePageMetadata } from './full-house/metadata';
import { hiddenPairPageMetadata } from './hidden-pair/metadata';
import { hiddenQuadPageMetadata } from './hidden-quad/metadata';
import { hiddenSinglePageMetadata } from './hidden-single/metadata';
import { hiddenTriplePageMetadata } from './hidden-triple/metadata';
import { techniquesPageMetadata } from './metadata';
import { nakedPairPageMetadata } from './naked-pair/metadata';
import { nakedQuadPageMetadata } from './naked-quad/metadata';
import { nakedSinglePageMetadata } from './naked-single/metadata';
import { nakedTriplePageMetadata } from './naked-triple/metadata';
import { pointingPairPageMetadata } from './pointing-pair/metadata';
import { pointingTriplePageMetadata } from './pointing-triple/metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(techniquesPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const TechniquesPage = () => (
    <main>
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Sudoku techniques</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Sudoku Techniques</h1>
        <p>
            A Sudoku technique is a named pattern of candidates that justifies placing a digit or erasing a candidate without guessing. This
            page lists the techniques in the order a solver should try them, from the single cheapest deduction in the game to the subset
            patterns that unlock most mid-difficulty puzzles.
        </p>
        <p>
            Every technique page here carries a worked example board that was produced by running the solving engine bundled with the
            Suuudokuuu app over a real puzzle position. The highlighted pattern cells, the eliminated candidates and the placement under
            each board are the engine’s own output, so the explanation and the diagram can never drift apart.
        </p>
        <h2>Tier 1 — Singles</h2>
        <p>
            Singles place a digit directly. They need no elimination pattern, they never remove a candidate without also solving a cell, and
            a puzzle solvable with singles alone is what most apps call easy.
        </p>
        <ul className="technique-index">
            <li>
                <Link href={fullHousePageMetadata.path}>Full House</Link> — the last empty cell in a row, column or box takes the one digit
                that unit is still missing.
            </li>
            <li>
                <Link href={nakedSinglePageMetadata.path}>Naked Single</Link> — a cell whose row, column and box between them rule out eight
                digits, leaving one candidate.
            </li>
            <li>
                <Link href={hiddenSinglePageMetadata.path}>Hidden Single</Link> — a digit that fits in only one cell of a unit, even though
                that cell still has other candidates.
            </li>
        </ul>
        <h2>Tier 2 — Intersections</h2>
        <p>
            Intersection techniques work on the overlap between a box and a line. They never place a digit on their own; they remove
            candidates, and those removals usually expose a single on the next pass.
        </p>
        <ul className="technique-index">
            <li>
                <Link href={pointingPairPageMetadata.path}>Pointing Pair</Link> — a digit confined to two cells of a box that share a line
                is erased from the rest of that line.
            </li>
            <li>
                <Link href={pointingTriplePageMetadata.path}>Pointing Triple</Link> — the same deduction with three cells instead of two.
            </li>
            <li>
                <Link href={boxLineReductionPageMetadata.path}>Box Line Reduction</Link> — the mirror image: a digit confined to one box
                along a line is erased from the rest of that box.
            </li>
        </ul>
        <h2>Tier 3 — Subsets</h2>
        <p>
            Subsets reserve a group of digits for a group of cells. Naked subsets are found by looking at cells and counting the digits they
            can hold; hidden subsets are found by looking at digits and counting the cells that can hold them. Both are elimination
            techniques, and both scale from two cells up to four.
        </p>
        <ul className="technique-index">
            <li>
                <Link href={nakedPairPageMetadata.path}>Naked Pair</Link> — two cells in a unit hold the same two candidates and nothing
                else.
            </li>
            <li>
                <Link href={nakedTriplePageMetadata.path}>Naked Triple</Link> — three cells whose candidates together use only three digits.
            </li>
            <li>
                <Link href={nakedQuadPageMetadata.path}>Naked Quad</Link> — four cells whose candidates together use only four digits.
            </li>
            <li>
                <Link href={hiddenPairPageMetadata.path}>Hidden Pair</Link> — two digits that fit in only two cells of a unit.
            </li>
            <li>
                <Link href={hiddenTriplePageMetadata.path}>Hidden Triple</Link> — three digits confined to the same three cells.
            </li>
            <li>
                <Link href={hiddenQuadPageMetadata.path}>Hidden Quad</Link> — four digits confined to the same four cells.
            </li>
        </ul>
        <h2>How to use this list</h2>
        <p>
            Work down the list, not across it. A solver that reaches for a naked quad while an unspotted hidden single is sitting on the
            board is doing far more work than the puzzle asks for, and the same is true of a human. Suuudokuuu applies the techniques in
            exactly the order above and stops at the first one that fires, which is also how the app decides what to show when you ask for a
            hint.
        </p>
        <p>
            Beyond the subsets lie the fish patterns, the wings and the chains — X-Wing, Swordfish, XY-Wing, XY-Chain and friends. They
            follow the same principle of reserving digits for cells, but they reason across two or more units at once rather than inside a
            single one.
        </p>
    </main>
);

export default TechniquesPage;
