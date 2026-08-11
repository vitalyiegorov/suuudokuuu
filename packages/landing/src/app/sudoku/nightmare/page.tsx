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
import { sudokuDifficultyRatingPageMetadata } from '../../guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../how-to-play/metadata';
import { homePageMetadata } from '../../metadata';
import { finnedSwordfishPageMetadata } from '../../techniques/finned-swordfish/metadata';
import { finnedXWingPageMetadata } from '../../techniques/finned-x-wing/metadata';
import { jellyfishPageMetadata } from '../../techniques/jellyfish/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { sashimiSwordfishPageMetadata } from '../../techniques/sashimi-swordfish/metadata';
import { sashimiXWingPageMetadata } from '../../techniques/sashimi-x-wing/metadata';
import { swordfishPageMetadata } from '../../techniques/swordfish/metadata';
import { wWingPageMetadata } from '../../techniques/w-wing/metadata';
import { xyWingPageMetadata } from '../../techniques/xy-wing/metadata';
import { xyzWingPageMetadata } from '../../techniques/xyz-wing/metadata';
import { hardSudokuPageMetadata } from '../hard/metadata';
import { hellSudokuPageMetadata } from '../hell/metadata';
import { sudokuDifficultiesPageMetadata } from '../metadata';

import { nightmareSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(nightmareSudokuPageMetadata);

const NightmareSudokuPage = () => (
    <main>
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={sudokuDifficultiesPageMetadata.path}>Sudoku difficulties</BreadcrumbListItem>
            <BreadcrumbListItem>Nightmare</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Expert Sudoku Puzzles (Nightmare Level)</h1>
        <p>
            Nightmare is Suuudokuuu’s expert tier — what most other apps would call very hard or expert. A Nightmare board carries just{' '}
            {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues out of 81 cells, and every subset pattern from Hard can run dry with
            cells still blank. Finishing one needs fish patterns beyond the X-Wing —{' '}
            <Link href={swordfishPageMetadata.path}>swordfish</Link>, <Link href={jellyfishPageMetadata.path}>jellyfish</Link> and their
            finned and sashimi variants — plus wing patterns built from bivalue cells: <Link href={xyWingPageMetadata.path}>XY-Wing</Link>,{' '}
            <Link href={xyzWingPageMetadata.path}>XYZ-Wing</Link> and <Link href={wWingPageMetadata.path}>W-Wing</Link>.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play Nightmare Sudoku now
        </a>
        <h2>What makes a puzzle Nightmare</h2>
        <p>
            A swordfish is an X-Wing stretched across three lines instead of two — a digit confined to the same three columns across three
            rows, erased from the rest of those columns. Jellyfish repeats the idea across four lines.{' '}
            <Link href={finnedXWingPageMetadata.path}>Finned</Link> and <Link href={sashimiXWingPageMetadata.path}>sashimi</Link> variants
            (with a <Link href={finnedSwordfishPageMetadata.path}>finned swordfish</Link> and a{' '}
            <Link href={sashimiSwordfishPageMetadata.path}>sashimi swordfish</Link> of their own) relax the base pattern slightly, allowing
            one extra candidate that still supports a smaller, safe elimination once you account for it. Wings work differently: an XY-Wing
            links three bivalue cells so a candidate shared between two of them can be erased from any cell both can see; XYZ-Wing tightens
            that further by giving the pivot cell the shared candidate too, and W-Wing links two matching bivalue cells through a strong
            link on one shared digit. At {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues, a Nightmare puzzle usually needs several
            of these in sequence, and spotting which one applies is most of the difficulty.
        </p>
        <h2>How hard is it, honestly</h2>
        <p>
            No SE (Sudoku Explainer) rating band is published per puzzle yet, and the measured picture is more interesting than a single
            label: at a fixed {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues, some Nightmare boards still fall to singles while
            others need chains, as the generated tables in our{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> show. Qualitatively this is where
            difficulty stops being about speed and becomes about pattern recognition under real uncertainty. Fish and wing patterns are easy
            to describe and genuinely hard to see on a live board; most solvers need to actively hunt for candidate shapes rather than
            notice them in passing.
        </p>
        <h2>Where to go next</h2>
        <p>
            Cleared a few Nightmare boards? <Link href={hellSudokuPageMetadata.path}>Hell Sudoku</Link> is the last tier, built from a
            bundled 17-clue corpus. Step back to <Link href={hardSudokuPageMetadata.path}>Hard Sudoku</Link> if fish and wings still feel
            unreliable. Browse the <Link href={techniquesPageMetadata.path}>technique index</Link>, the{' '}
            <Link href={howToPlayPageMetadata.path}>how to play guide</Link>, every tier on the{' '}
            <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub, or head{' '}
            <Link href={homePageMetadata.path}>home</Link>.
        </p>
        <h2>Nightmare Sudoku FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>How hard is Nightmare sudoku?</FaqQuestion>
                <FaqAnswer>
                    It is Suuudokuuu’s second-hardest tier. Nightmare boards need fish patterns like swordfish and jellyfish plus wing
                    patterns like XY-Wing, on top of every technique the earlier tiers require.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How many clues does a Nightmare sudoku have?</FaqQuestion>
                <FaqAnswer>
                    {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues out of 81 cells, well under a third of the grid.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What is the difference between a swordfish and a jellyfish?</FaqQuestion>
                <FaqAnswer>
                    Only the size: a swordfish confines a digit to three rows and three columns, a jellyfish to four of each. Both erase the
                    digit from every other cell in those columns.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What are wing patterns in sudoku?</FaqQuestion>
                <FaqAnswer>
                    A family of techniques — XY-Wing, XYZ-Wing and W-Wing — that link a small handful of cells sharing exactly two
                    candidates each, proving an elimination wherever those cells overlap.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <DifficultyNavigation next={hellSudokuPageMetadata} previous={hardSudokuPageMetadata} />
    </main>
);

export default NightmareSudokuPage;
