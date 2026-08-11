import Link from 'next/link';

import { PuzzleBoard } from '../../puzzle/components/puzzle-board/puzzle-board';
import { ArticleSchema } from '../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../seo/components/breadcrumbs/breadcrumbs';
import { Faq } from '../../seo/components/faq/faq';
import { FaqAnswer } from '../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../seo/components/faq-question/faq-question';
import { SITE_PLAY_URL } from '../../seo/constants/site.constant';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { seventeenClueSudokuPageMetadata } from '../17-clue-sudoku/metadata';
import { homePageMetadata } from '../metadata';
import { hellSudokuPageMetadata } from '../sudoku/hell/metadata';
import { aicPageMetadata } from '../techniques/aic/metadata';
import { techniquesPageMetadata } from '../techniques/metadata';
import { xChainPageMetadata } from '../techniques/x-chain/metadata';

import { hardestSudokuPuzzlesPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(hardestSudokuPuzzlesPageMetadata);

const AI_ESCARGOT_GIVENS = '100007090030020008009600500005300900010080002600004000300000010040000007007000300';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const HardestSudokuPuzzlesPage = () => (
    <main>
        <ArticleSchema
            dateModified={hardestSudokuPuzzlesPageMetadata.updatedAt}
            datePublished={hardestSudokuPuzzlesPageMetadata.publishedAt}
            description={hardestSudokuPuzzlesPageMetadata.metaDescription}
            headline={hardestSudokuPuzzlesPageMetadata.title}
            path={hardestSudokuPuzzlesPageMetadata.path}
        />
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Hardest sudoku puzzles</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>The Hardest Sudoku Puzzles in the World</h1>
        <p>
            The hardest sudoku puzzles in the world are not the ones with the fewest clues. They are a small set of hand-crafted or
            computer-searched grids built specifically to defeat every named human solving technique, leaving only long forcing chains and
            speculative trial branches to close them out. Clue count decides how much a puzzle gives you up front; it says almost nothing
            about how far you have to reason once the easy placements run out, and every puzzle on this page proves it.
        </p>
        <p>
            Researchers rate that reasoning depth with SE (Sudoku Explainer), a community-standard 1.0–12.0 scale that scores a puzzle by
            the hardest technique its optimal solve path requires. Suuudokuuu does not publish its own SE ratings yet — a full rating guide
            is on the way — so the figures below are the values independent solvers and researchers commonly cite for each puzzle.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play Sudoku now
        </a>
        <h2>Four puzzles that defined “hardest”</h2>
        <h3>AI Escargot (2006)</h3>
        <p>
            Finnish mathematician Arto Inkala published AI Escargot in late 2006 and called it the world’s hardest sudoku. The 23 givens
            trace a spiral across the grid, which is where the name comes from — “escargot” is French for snail. Rated at roughly SE 10.6,
            it needs chains and forcing logic well beyond the fish and wing patterns that finish most “expert” puzzles, and it remains the
            puzzle most people mean when they first ask about the hardest sudoku ever made.
        </p>
        <PuzzleBoard givens={AI_ESCARGOT_GIVENS}>Arto Inkala’s AI Escargot (2006), 23 givens, commonly rated around SE 10.6.</PuzzleBoard>
        <h3>Platinum Blonde</h3>
        <p>
            Platinum Blonde is a computer-generated puzzle built specifically to push the SE scale, commonly cited at roughly SE 10.9. Its
            givens sit almost entirely in one half of the grid, so the opening moves look deceptively open — the difficulty only shows up
            once ordinary subset and fish techniques run out and the solve has to fall back on chains and coloring nets that span the whole
            board at once.
        </p>
        <h3>Inkala’s Everest (2010)</h3>
        <p>
            Arto Inkala followed AI Escargot with a second puzzle in 2010, again promoted as the world’s hardest sudoku. The solving
            community nicknamed it “Everest,” and independent raters place it at roughly SE 11.9 — noticeably higher than AI Escargot, and
            high enough that different SE implementations disagree by several tenths depending on which chain types they model.
        </p>
        <h3>Golden Nugget</h3>
        <p>
            Golden Nugget is another hand-crafted extreme puzzle from the online sudoku-solving community, built the same way as Platinum
            Blonde: by search, for maximum resistance to logical solving. Different raters place it in the same SE 11 territory as Everest,
            though — as with every puzzle at this end of the scale — the exact figure moves depending on which rater produced it.
        </p>
        <h2>Why these puzzles defeat human solvers</h2>
        <p>
            Every technique on Suuudokuuu’s <Link href={techniquesPageMetadata.path}>technique index</Link>, up through{' '}
            <Link href={aicPageMetadata.path}>AIC</Link> and <Link href={xChainPageMetadata.path}>X-Chain</Link>, justifies one placement or
            one elimination by reasoning about a fixed, bounded pattern of candidates. The puzzles above are built so that no such bounded
            pattern ever fires. Solving them means building a forcing chain or a forcing net — following the consequences of a single guess,
            sometimes for dozens of steps, until the only way forward is a contradiction that rules the guess out. That is qualitatively
            different work from spotting an X-Wing: it is closer to a proof by exhaustive case analysis than to pattern recognition, which
            is exactly why the SE scale keeps climbing past 10.0 for puzzles that a fish-and-wing solver simply cannot touch.
        </p>
        <h2>Play the hardest tier Suuudokuuu has today</h2>
        <p>
            Suuudokuuu does not yet serve these exact record puzzles — that is on the roadmap. What it serves today is{' '}
            <Link href={hellSudokuPageMetadata.path}>Hell tier</Link>, drawn from a bundled, verified 17-clue corpus and solved with chains
            and coloring rather than a blank-cell-count guess. Seventeen clues is a different fact about a puzzle than “hardest,” and the
            two get confused constantly — see the <Link href={seventeenClueSudokuPageMetadata.path}>17-clue sudoku guide</Link> for why
            minimal and hard are not the same property.
        </p>
        <h2>Hardest Sudoku FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>What is the hardest sudoku puzzle ever?</FaqQuestion>
                <FaqAnswer>
                    There is no single agreed answer, because different SE raters score forcing chains differently. AI Escargot (2006) was
                    the first puzzle widely publicized as the hardest; independent raters now place Arto Inkala’s 2010 puzzle, nicknamed
                    “Everest,” and computer-generated puzzles like Platinum Blonde and Golden Nugget higher on the SE scale.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What is a Sudoku Explainer (SE) rating?</FaqQuestion>
                <FaqAnswer>
                    A 1.0–12.0 difficulty score that rates a puzzle by the hardest named technique its optimal solve path requires. Simple
                    singles sit near 1.5; fish and wing patterns sit in the 3–4 range; forcing chains and nets push a puzzle past SE 8.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Are 17-clue sudokus the hardest?</FaqQuestion>
                <FaqAnswer>
                    No. Clue count and logical difficulty are independent facts about a puzzle. Most 17-clue puzzles solve with ordinary
                    techniques; AI Escargot has 23 givens and is far harder than the typical 17-clue grid. Read the{' '}
                    <Link href={seventeenClueSudokuPageMetadata.path}>17-clue sudoku guide</Link> for the full explanation.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I play a hardest-tier sudoku on Suuudokuuu?</FaqQuestion>
                <FaqAnswer>
                    Today, <Link href={hellSudokuPageMetadata.path}>Hell tier</Link> is Suuudokuuu’s hardest, serving verified 17-clue
                    puzzles solved with chains, coloring and AIC. A future tier hosting curated record puzzles like the ones on this page is
                    on the roadmap.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default HardestSudokuPuzzlesPage;
