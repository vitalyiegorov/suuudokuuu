import Link from 'next/link';

import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Faq } from '../../seo/components/faq/faq';
import { FaqAnswer } from '../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../seo/components/faq-question/faq-question';
import { HowTo } from '../../seo/components/how-to/how-to';
import { HowToStep } from '../../seo/components/how-to-step/how-to-step';
import { PageHeader } from '../../seo/components/page-header/page-header';
import { SITE_PLAY_URL } from '../../seo/constants/site.constant';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { SolverWorkbench } from '../../solver/components/solver-workbench/solver-workbench';
import { TechniqueSummary } from '../../techniques/components/technique-summary/technique-summary';
import { seventeenClueSudokuPageMetadata } from '../17-clue-sudoku/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../hardest-sudoku-puzzles/metadata';
import { howToPlayPageMetadata } from '../how-to-play/metadata';
import { homePageMetadata } from '../metadata';
import { aicPageMetadata } from '../techniques/aic/metadata';
import { boxLineReductionPageMetadata } from '../techniques/box-line-reduction/metadata';
import { finnedSwordfishPageMetadata } from '../techniques/finned-swordfish/metadata';
import { finnedXWingPageMetadata } from '../techniques/finned-x-wing/metadata';
import { fullHousePageMetadata } from '../techniques/full-house/metadata';
import { hiddenPairPageMetadata } from '../techniques/hidden-pair/metadata';
import { hiddenQuadPageMetadata } from '../techniques/hidden-quad/metadata';
import { hiddenSinglePageMetadata } from '../techniques/hidden-single/metadata';
import { hiddenTriplePageMetadata } from '../techniques/hidden-triple/metadata';
import { jellyfishPageMetadata } from '../techniques/jellyfish/metadata';
import { techniquesPageMetadata } from '../techniques/metadata';
import { nakedPairPageMetadata } from '../techniques/naked-pair/metadata';
import { nakedQuadPageMetadata } from '../techniques/naked-quad/metadata';
import { nakedSinglePageMetadata } from '../techniques/naked-single/metadata';
import { nakedTriplePageMetadata } from '../techniques/naked-triple/metadata';
import { pointingPairPageMetadata } from '../techniques/pointing-pair/metadata';
import { pointingTriplePageMetadata } from '../techniques/pointing-triple/metadata';
import { sashimiSwordfishPageMetadata } from '../techniques/sashimi-swordfish/metadata';
import { sashimiXWingPageMetadata } from '../techniques/sashimi-x-wing/metadata';
import { simpleColoringPageMetadata } from '../techniques/simple-coloring/metadata';
import { swordfishPageMetadata } from '../techniques/swordfish/metadata';
import { wWingPageMetadata } from '../techniques/w-wing/metadata';
import { xChainPageMetadata } from '../techniques/x-chain/metadata';
import { xWingPageMetadata } from '../techniques/x-wing/metadata';
import { xyChainPageMetadata } from '../techniques/xy-chain/metadata';
import { xyWingPageMetadata } from '../techniques/xy-wing/metadata';
import { xyzWingPageMetadata } from '../techniques/xyz-wing/metadata';

import { solverPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(solverPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const SolverPage = () => (
    <main>
        <PageHeader metadata={solverPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Sudoku solver</BreadcrumbListItem>
        </PageHeader>
        <p>
            A sudoku solver is a program that takes an unfinished 9×9 grid and returns the completed one. A step-by-step sudoku solver
            returns something more useful than the answer: the reasoning. It hands back an ordered list of named deductions — Hidden Single
            places 3 in r4c5, Naked Pair removes 7 from r2c1 — so you can see which move you missed, learn the pattern behind it, and finish
            the puzzle yourself instead of copying 50 digits off a screen.
        </p>
        <p>
            This solver runs entirely in your browser. Nothing is uploaded, nothing is stored, and no account is needed. It is the same
            open-source solving engine that powers hints inside the Suuudokuuu game, so every step it names is a step the app could have
            shown you mid-game.
        </p>
        <TechniqueSummary>
            <ul>
                <li>Type the grid cell by cell or paste all 81 characters, then press Solve step by step.</li>
                <li>A uniqueness check runs first and reports honestly when a grid has no solution or more than one.</li>
                <li>Each step names the technique that proves it and links to that technique’s full guide.</li>
                <li>Any step replays on a live board with the pattern cells highlighted and the candidates drawn in.</li>
                <li>Everything runs in your browser: nothing is uploaded, nothing is stored, no account is needed.</li>
            </ul>
        </TechniqueSummary>
        <SolverWorkbench />
        <h2>Why a narrated solve beats a bare answer</h2>
        <p>
            Most sudoku solvers online do exactly one thing: they fill the grid. That answers “what goes here” and nothing else. If you were
            stuck, you are still stuck the next time the same pattern appears, because the solver never told you what the pattern was. The
            filled grid is also unfalsifiable to a learner — you cannot check it, you can only trust it.
        </p>
        <p>
            A narrated solve is checkable. Every step here states the technique, the cells it looked at, and the digit it placed or
            eliminated, and every step links to a guide explaining that technique on a worked example. Open any step and it replays on a
            live board, with the pattern cells highlighted and the candidates drawn in, so you can confirm the deduction with your own eyes
            before you accept it. That is the difference between an answer key and a teacher.
        </p>
        <h2>How this solver checks your puzzle</h2>
        <p>
            Before anything is narrated, the grid you entered is checked for a unique solution — twice, by two independent algorithms that
            share no code:
        </p>
        <ul className="link-list">
            <li>
                <strong>The bitmask solver</strong> is the fast path. It stores each cell’s candidates as bits in a typed array, propagates
                naked singles until nothing changes, then branches on the cell with the fewest remaining candidates.
            </li>
            <li>
                <strong>The Dancing Links solver</strong> is the cross-check. It restates sudoku as an exact-cover problem and solves it
                with Donald Knuth’s Algorithm X over a doubly linked matrix — a completely different search from the bitmask one.
            </li>
        </ul>
        <p>
            Both are asked to count solutions, stopping at two, and the two counts have to agree. Three things can come back. If the count
            is zero, the grid contradicts itself — a digit is repeated in a row, a column or a box — and the solver says so instead of
            guessing at what you meant. If the count is two or more, the puzzle is not a proper sudoku: it has multiple valid completions,
            there is no single answer to narrate, and any solver that quietly returns one of them is hiding the problem from you. Only a
            count of exactly one gets a walkthrough. If the two solvers ever disagree, that is reported too — it would be a bug in
            Suuudokuuu, not in your puzzle.
        </p>
        <h2>How the step-by-step walkthrough is produced</h2>
        <p>
            Once the puzzle is verified, the solving engine is run over it one deduction at a time. It tries the techniques in a fixed
            order, cheapest first, and stops at the first one that fires — the same order and the same code the game uses when you ask for a
            hint. That is why the walkthrough reads like a human solve rather than a machine dump: a Full House is preferred over a Hidden
            Single, a Hidden Single over a Pointing Pair, and a Naked Quad is never invoked while an easier move is still on the board.
        </p>
        <p>
            One honest limit is worth stating up front. The engine reads candidates off the board on every step instead of carrying your
            pencil marks forward, so a chain of eliminations that only pays off several moves later cannot be threaded together. On puzzles
            that need that — the genuinely <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest sudoku puzzles</Link> and many{' '}
            <Link href={seventeenClueSudokuPageMetadata.path}>17-clue grids</Link> — the narration stops early and says how many cells it
            could not prove, rather than filling them in from an answer it already has and pretending it reasoned its way there. The
            verified completed grid is still shown underneath.
        </p>
        <h2>How to use the solver</h2>
        <HowTo name="How to solve a sudoku step by step">
            <HowToStep name="Enter your puzzle">
                Click a cell and type a digit, or use the on-screen pad. Arrow keys move around the grid and Backspace clears a cell. If you
                already have the puzzle as text, paste all 81 characters into the box below the grid — digits for the givens, dots or zeros
                for the blanks.
            </HowToStep>
            <HowToStep name="Solve step by step">
                Press Solve step by step. The uniqueness check runs first and reports honestly if the grid has no solution or more than one.
            </HowToStep>
            <HowToStep name="Read the steps">
                Each numbered step names the technique that proves it and links to a full guide for that technique. Work down the list until
                you reach the move you missed.
            </HowToStep>
            <HowToStep name="Replay a step on the board">
                Open any step to see it on a live board: the pattern cells are highlighted, the candidates are drawn in, and the
                eliminations and the placement are played back in order so you can verify the deduction yourself.
            </HowToStep>
        </HowTo>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play Sudoku now
        </a>
        <h2>Techniques the solver can explain</h2>
        <p>
            Every technique the walkthrough can name has its own guide, with a worked example board generated by this same engine. The{' '}
            <Link href={techniquesPageMetadata.path}>technique index</Link> is the hub for all of them and lists them in the order the
            solver tries them; the four tiers below are how that order is grouped.
        </p>
        <ul className="technique-index">
            <li>
                <strong>Tier 1 — Singles</strong> place a digit outright and carry most easy puzzles on their own:{' '}
                <Link href={fullHousePageMetadata.path}>Full House</Link>, <Link href={nakedSinglePageMetadata.path}>Naked Single</Link> and{' '}
                <Link href={hiddenSinglePageMetadata.path}>Hidden Single</Link>.
            </li>
            <li>
                <strong>Tier 2 — Intersections</strong> work on the overlap between a box and a line and only ever remove candidates:{' '}
                <Link href={pointingPairPageMetadata.path}>Pointing Pair</Link>,{' '}
                <Link href={pointingTriplePageMetadata.path}>Pointing Triple</Link> and{' '}
                <Link href={boxLineReductionPageMetadata.path}>Box Line Reduction</Link>.
            </li>
            <li>
                <strong>Tier 3 — Subsets</strong> reserve a group of digits for a group of cells:{' '}
                <Link href={nakedPairPageMetadata.path}>Naked Pair</Link>, <Link href={nakedTriplePageMetadata.path}>Naked Triple</Link>,{' '}
                <Link href={nakedQuadPageMetadata.path}>Naked Quad</Link>, <Link href={hiddenPairPageMetadata.path}>Hidden Pair</Link>,{' '}
                <Link href={hiddenTriplePageMetadata.path}>Hidden Triple</Link> and{' '}
                <Link href={hiddenQuadPageMetadata.path}>Hidden Quad</Link>.
            </li>
            <li>
                <strong>Tier 4 — Fish, wings and chains</strong> reason across several units or along a path of cells:{' '}
                <Link href={xWingPageMetadata.path}>X-Wing</Link>, <Link href={swordfishPageMetadata.path}>Swordfish</Link>,{' '}
                <Link href={jellyfishPageMetadata.path}>Jellyfish</Link>, <Link href={finnedXWingPageMetadata.path}>Finned X-Wing</Link>,{' '}
                <Link href={finnedSwordfishPageMetadata.path}>Finned Swordfish</Link>,{' '}
                <Link href={sashimiXWingPageMetadata.path}>Sashimi X-Wing</Link>,{' '}
                <Link href={sashimiSwordfishPageMetadata.path}>Sashimi Swordfish</Link>, <Link href={xyWingPageMetadata.path}>XY-Wing</Link>
                , <Link href={xyzWingPageMetadata.path}>XYZ-Wing</Link>, <Link href={wWingPageMetadata.path}>W-Wing</Link>,{' '}
                <Link href={xChainPageMetadata.path}>X-Chain</Link>, <Link href={xyChainPageMetadata.path}>XY-Chain</Link>,{' '}
                <Link href={simpleColoringPageMetadata.path}>Simple Coloring</Link> and <Link href={aicPageMetadata.path}>AIC</Link>.
            </li>
        </ul>
        <p>
            Never solved a sudoku before? The <Link href={howToPlayPageMetadata.path}>how to play guide</Link> covers the three rules and
            your first moves before any of the patterns above become useful.
        </p>
        <h2>Sudoku solver FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Can this solver solve any sudoku?</FaqQuestion>
                <FaqAnswer>
                    It can complete any sudoku that has exactly one solution — the bitmask and Dancing Links solvers are exhaustive, so the
                    finished grid is always found. The narrated walkthrough is more modest: it covers every step the technique engine can
                    prove from the board alone, and on puzzles that need long chained eliminations it stops early and tells you how many
                    cells it could not justify rather than guessing.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What if my puzzle has two solutions?</FaqQuestion>
                <FaqAnswer>
                    The solver says so and refuses to narrate. A puzzle with more than one valid completion is not a proper sudoku: there is
                    no single correct answer, so any step-by-step explanation would be fiction. Usually it means a given was mistyped or
                    left out — add the missing digits and solve again.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does it show the steps?</FaqQuestion>
                <FaqAnswer>
                    Yes. Every step names the technique that proves it, the cells involved and the digit placed or eliminated, and links to
                    a guide for that technique. Opening a step replays it on a live board with the pattern cells highlighted and the
                    candidates shown, so you can check the deduction instead of taking it on trust.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is the sudoku solver free?</FaqQuestion>
                <FaqAnswer>
                    Yes. It is free, open source, ad-free and requires no account. It runs entirely in your browser, so the puzzle you enter
                    never leaves your device.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default SolverPage;
