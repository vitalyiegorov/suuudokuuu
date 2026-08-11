import Link from 'next/link';

import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../seo/components/breadcrumbs/breadcrumbs';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { howToPlayPageMetadata } from '../how-to-play/metadata';
import { homePageMetadata } from '../metadata';
import { boxLineReductionPageMetadata } from '../techniques/box-line-reduction/metadata';
import { fullHousePageMetadata } from '../techniques/full-house/metadata';
import { hiddenPairPageMetadata } from '../techniques/hidden-pair/metadata';
import { hiddenQuadPageMetadata } from '../techniques/hidden-quad/metadata';
import { hiddenSinglePageMetadata } from '../techniques/hidden-single/metadata';
import { hiddenTriplePageMetadata } from '../techniques/hidden-triple/metadata';
import { techniquesPageMetadata } from '../techniques/metadata';
import { nakedPairPageMetadata } from '../techniques/naked-pair/metadata';
import { nakedQuadPageMetadata } from '../techniques/naked-quad/metadata';
import { nakedSinglePageMetadata } from '../techniques/naked-single/metadata';
import { nakedTriplePageMetadata } from '../techniques/naked-triple/metadata';
import { pointingPairPageMetadata } from '../techniques/pointing-pair/metadata';
import { pointingTriplePageMetadata } from '../techniques/pointing-triple/metadata';

import { glossaryPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(glossaryPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const GlossaryPage = () => (
    <main>
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Glossary</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Sudoku Glossary</h1>
        <p>
            A glossary entry for every term used across the Suuudokuuu guides: the core vocabulary of the grid, plus all 26 solving
            techniques the app detects, from the simplest full house to a full alternating inference chain. Anything unfamiliar in the{' '}
            <Link href={howToPlayPageMetadata.path}>how to play guide</Link> or the{' '}
            <Link href={techniquesPageMetadata.path}>technique index</Link> should be defined here.
        </p>
        <h2>Core vocabulary</h2>
        <dl className="glossary-list">
            <div className="glossary-entry">
                <dt id="cell">Cell</dt>
                <dd>
                    One of the 81 positions in the grid. A cell holds either a single filled digit or, while blank, a set of candidates.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="row">Row</dt>
                <dd>One of the nine horizontal lines of nine cells. Every row must contain the digits 1 to 9 exactly once.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="column">Column</dt>
                <dd>One of the nine vertical lines of nine cells. Every column must contain the digits 1 to 9 exactly once.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="box">Box (unit)</dt>
                <dd>
                    One of the nine 3×3 blocks of cells, each of which must also contain the digits 1 to 9 exactly once. Unit is the general
                    term for any row, column or box.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="candidate">Candidate (pencil mark)</dt>
                <dd>
                    A digit a blank cell could still legally hold, based on what its row, column and box already contain. Most solvers write
                    candidates as small numbers in the corner of the cell while working through a puzzle.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="given">Given (clue)</dt>
                <dd>
                    A digit printed on the board before solving starts. The set of givens is what makes one puzzle different from another.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="naked-hidden">Naked / hidden</dt>
                <dd>
                    Two ways a pattern can appear. Naked patterns are visible directly in a cell’s own candidate list; hidden patterns are
                    only visible by checking, unit by unit, where a digit is still allowed to go.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="elimination">Elimination</dt>
                <dd>
                    Removing a candidate from a cell because a technique has proven it cannot be the answer there, without placing a digit.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="unique-solution">Unique solution</dt>
                <dd>
                    The property every well-formed Sudoku has: exactly one completed grid satisfies all three rules given the starting
                    clues.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="minimal-puzzle">Minimal puzzle (17-clue)</dt>
                <dd>
                    A puzzle with the fewest clues that still has a unique solution. Seventeen is the proven minimum clue count for a
                    standard 9×9 Sudoku, which is why Suuudokuuu’s Hell difficulty draws from a bundled 17-clue corpus.
                </dd>
            </div>
        </dl>
        <h2>Solving techniques</h2>
        <p>
            Techniques are listed in the difficulty order Suuudokuuu applies them. The twelve simplest have their own guide with a worked
            example board; the rest are defined here and will get their own guides as the technique library grows.
        </p>
        <dl className="glossary-list">
            <div className="glossary-entry">
                <dt id="full-house">
                    <Link href={fullHousePageMetadata.path}>Full House</Link>
                </dt>
                <dd>The last empty cell in a row, column or box. It must take the one digit that unit is still missing.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="naked-single">
                    <Link href={nakedSinglePageMetadata.path}>Naked Single</Link>
                </dt>
                <dd>A cell whose row, column and box between them eliminate every candidate but one.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="hidden-single">
                    <Link href={hiddenSinglePageMetadata.path}>Hidden Single</Link>
                </dt>
                <dd>A digit that fits in only one cell of a unit, even though that cell still carries other candidates.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="pointing-pair">
                    <Link href={pointingPairPageMetadata.path}>Pointing Pair</Link>
                </dt>
                <dd>
                    A digit confined to two cells of a box that also share a row or column, so it can be erased from the rest of that line.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="pointing-triple">
                    <Link href={pointingTriplePageMetadata.path}>Pointing Triple</Link>
                </dt>
                <dd>The same pattern as a pointing pair, with three cells confined to a box-line intersection instead of two.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="box-line-reduction">
                    <Link href={boxLineReductionPageMetadata.path}>Box Line Reduction</Link>
                </dt>
                <dd>The mirror of a pointing pair: a digit confined to one box along a line is erased from the rest of that box.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="naked-pair">
                    <Link href={nakedPairPageMetadata.path}>Naked Pair</Link>
                </dt>
                <dd>
                    Two cells in a unit that share the same two candidates and nothing else, so both digits can be erased elsewhere in the
                    unit.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="naked-triple">
                    <Link href={nakedTriplePageMetadata.path}>Naked Triple</Link>
                </dt>
                <dd>Three cells in a unit whose candidates together use only three digits.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="naked-quad">
                    <Link href={nakedQuadPageMetadata.path}>Naked Quad</Link>
                </dt>
                <dd>Four cells in a unit whose candidates together use only four digits.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="hidden-pair">
                    <Link href={hiddenPairPageMetadata.path}>Hidden Pair</Link>
                </dt>
                <dd>Two digits that fit in only two cells of a unit, which reserves those cells for the pair.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="hidden-triple">
                    <Link href={hiddenTriplePageMetadata.path}>Hidden Triple</Link>
                </dt>
                <dd>Three digits confined between them to the same three cells of a unit.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="hidden-quad">
                    <Link href={hiddenQuadPageMetadata.path}>Hidden Quad</Link>
                </dt>
                <dd>Four digits confined between them to the same four cells of a unit.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="x-wing">X-Wing</dt>
                <dd>
                    A fish pattern where a digit is confined to the same two columns across two rows, or the same two rows across two
                    columns, letting it be eliminated from the rest of those lines.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="swordfish">Swordfish</dt>
                <dd>The three-line version of an X-Wing, using three rows and three columns instead of two.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="jellyfish">Jellyfish</dt>
                <dd>The four-line version of the same fish pattern, using four rows and four columns.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="finned-x-wing">Finned X-Wing</dt>
                <dd>
                    An X-Wing with one or two extra candidates, called fins, that still supports a smaller set of eliminations near the fin.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="finned-swordfish">Finned Swordfish</dt>
                <dd>A Swordfish pattern with fins, the three-line counterpart to a finned X-Wing.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="sashimi-x-wing">Sashimi X-Wing</dt>
                <dd>A finned X-Wing where removing the fin cell’s own candidate entirely still leaves a valid, smaller X-Wing behind.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="sashimi-swordfish">Sashimi Swordfish</dt>
                <dd>The same sashimi pattern applied to a Swordfish instead of an X-Wing.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="xy-wing">XY-Wing</dt>
                <dd>
                    Three cells with two candidates each, arranged so that whichever digit the pivot cell turns out to hold, a shared
                    candidate can be eliminated from any cell that sees both of the other two.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="xyz-wing">XYZ-Wing</dt>
                <dd>An XY-Wing where the pivot cell also carries the shared third candidate, which tightens the elimination further.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="w-wing">W-Wing</dt>
                <dd>
                    Two cells holding the same pair of candidates, connected by a strong link on one of those digits, that let the other
                    digit be eliminated from cells both of them see.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="x-chain">X-Chain</dt>
                <dd>
                    A chain of strong and weak links on a single digit connecting two cells, proving one of the chain’s endpoints must hold
                    it.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="xy-chain">XY-Chain</dt>
                <dd>
                    A chain of cells with exactly two candidates each, linked so the chain’s two endpoints force an elimination wherever
                    they overlap.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="simple-coloring">Simple Coloring</dt>
                <dd>
                    A technique that assigns two alternating colors to a chain of strong links on one digit, then eliminates candidates that
                    see cells of both colors.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="aic">AIC (Alternating Inference Chain)</dt>
                <dd>
                    A chain of alternating strong and weak links across candidates that generalises X-Chains, XY-Chains and coloring into
                    one framework.
                </dd>
            </div>
        </dl>
        <p>
            Ready to put a term into practice? <Link href={howToPlayPageMetadata.path}>Learn how to play</Link> or browse the full{' '}
            <Link href={techniquesPageMetadata.path}>technique index</Link>.
        </p>
    </main>
);

export default GlossaryPage;
