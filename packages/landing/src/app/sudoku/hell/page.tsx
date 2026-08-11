import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import { getDifficultyClueCount } from '../../../difficulty/utils/get-difficulty-clue-count.util';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../../seo/components/breadcrumbs/breadcrumbs';
import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { howToPlayPageMetadata } from '../../how-to-play/metadata';
import { homePageMetadata } from '../../metadata';
import { aicPageMetadata } from '../../techniques/aic/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { simpleColoringPageMetadata } from '../../techniques/simple-coloring/metadata';
import { xChainPageMetadata } from '../../techniques/x-chain/metadata';
import { xyChainPageMetadata } from '../../techniques/xy-chain/metadata';
import { sudokuDifficultiesPageMetadata } from '../metadata';
import { nightmareSudokuPageMetadata } from '../nightmare/metadata';

import { hellSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(hellSudokuPageMetadata);

const HellSudokuPage = () => (
    <main>
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={sudokuDifficultiesPageMetadata.path}>Sudoku difficulties</BreadcrumbListItem>
            <BreadcrumbListItem>Hell</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Evil Sudoku Puzzles (Hell Level)</h1>
        <p>
            Hell is Suuudokuuu’s hardest tier — what most competitors call evil or extreme. A Hell board carries just{' '}
            {getDifficultyClueCount(DifficultyEnum.Hell)} clues out of 81 cells, the minimum number of clues a Sudoku can have and still
            keep a unique solution. Fish patterns and wings from Nightmare are not guaranteed to be enough; Hell puzzles are solved with
            chains and coloring: <Link href={xChainPageMetadata.path}>X-Chain</Link>, <Link href={xyChainPageMetadata.path}>XY-Chain</Link>,{' '}
            <Link href={simpleColoringPageMetadata.path}>Simple Coloring</Link> and <Link href={aicPageMetadata.path}>AIC</Link>{' '}
            (alternating inference chain), the technique that generalises all three into one. Rather than generating 17-clue puzzles on
            demand, Suuudokuuu draws Hell puzzles from a bundled, pre-verified 17-clue corpus, checked by two independent solving algorithms
            before it ever ships.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play Hell Sudoku now
        </a>
        <h2>What makes a puzzle Hell</h2>
        <p>
            A chain follows an alternating sequence of strong and weak links, starting from a candidate and working outward until it proves
            an elimination or a placement no matter which branch turns out to be true. X-Chain works on a single digit; XY-Chain follows a
            path of bivalue cells instead. Simple Coloring assigns two alternating colors to a network of strong links on one digit and
            clears any candidate that sees both colors, and AIC generalises the whole family, mixing digits and cell types along one
            continuous chain. Seventeen clues is not an arbitrary number: it is the smallest clue count mathematically proven to still
            guarantee a unique solution, which is why the corpus behind this tier is fixed and verified rather than generated fresh for
            every puzzle.
        </p>
        <h2>How hard is it, honestly</h2>
        <p>
            No SE (Sudoku Explainer) rating band is published for Hell yet — that companion guide is still being written — but qualitatively
            this sits at the ceiling of what human solvers attempt without brute-force search. Chains require holding an entire path of
            implications in mind at once, and a Hell puzzle can need several chains before it yields. Treat a completed Hell board as a real
            achievement, not a speed run.
        </p>
        <h2>Where to go next</h2>
        <p>
            Not ready for chains yet? Step back to <Link href={nightmareSudokuPageMetadata.path}>Nightmare Sudoku</Link> for fish and wings
            without the chain-length reasoning. Browse the <Link href={techniquesPageMetadata.path}>technique index</Link>, especially
            X-Chain, XY-Chain, Simple Coloring and AIC, the <Link href={howToPlayPageMetadata.path}>how to play guide</Link>, every tier on
            the <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub, or head{' '}
            <Link href={homePageMetadata.path}>home</Link>.
        </p>
        <h2>Hell Sudoku FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>What techniques do I need for Hell level?</FaqQuestion>
                <FaqAnswer>
                    Chains and coloring: X-Chain, XY-Chain, Simple Coloring and AIC, layered on top of every fish, wing and subset technique
                    the earlier tiers already require.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How many clues does a Hell sudoku have?</FaqQuestion>
                <FaqAnswer>
                    {getDifficultyClueCount(DifficultyEnum.Hell)} clues, the proven minimum for a Sudoku with a unique solution.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why does Hell use a fixed puzzle corpus instead of generating puzzles?</FaqQuestion>
                <FaqAnswer>
                    17-clue puzzles are rare and expensive to generate and verify on demand, so Suuudokuuu ships a bundled corpus that has
                    already been checked by a Dancing Links exact-cover solver and a bitmask solver, and draws Hell puzzles from it.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What is an AIC in sudoku?</FaqQuestion>
                <FaqAnswer>
                    An alternating inference chain — a sequence of alternating strong and weak links across candidates that generalises
                    X-Chains, XY-Chains and coloring into a single, more flexible technique.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <DifficultyNavigation previous={nightmareSudokuPageMetadata} />
    </main>
);

export default HellSudokuPage;
