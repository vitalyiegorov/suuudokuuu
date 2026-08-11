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
import { fullHousePageMetadata } from '../../techniques/full-house/metadata';
import { hiddenSinglePageMetadata } from '../../techniques/hidden-single/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { nakedSinglePageMetadata } from '../../techniques/naked-single/metadata';
import { mediumSudokuPageMetadata } from '../medium/metadata';
import { sudokuDifficultiesPageMetadata } from '../metadata';
import { newbieSudokuPageMetadata } from '../newbie/metadata';

import { easySudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(easySudokuPageMetadata);

const EasySudokuPage = () => (
    <main>
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={sudokuDifficultiesPageMetadata.path}>Sudoku difficulties</BreadcrumbListItem>
            <BreadcrumbListItem>Easy</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Easy Sudoku Puzzles</h1>
        <p>
            Easy is the first tier where Suuudokuuu expects a genuine, if gentle, solve. An Easy board carries{' '}
            {getDifficultyClueCount(DifficultyEnum.Easy)} clues out of 81 cells, three times as many blanks as Newbie. Full houses and naked
            singles still clear most of the grid, but not all of it: some cells need a{' '}
            <Link href={hiddenSinglePageMetadata.path}>hidden single</Link>, where a digit fits only one cell of a row, column or box even
            though that cell still shows other candidates. That one extra pattern is the entire step up from Newbie to Easy.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play Easy Sudoku now
        </a>
        <h2>What makes a puzzle Easy</h2>
        <p>
            Thirty extra blanks over Newbie is enough that the grid stops filling itself in from{' '}
            <Link href={fullHousePageMetadata.path}>full houses</Link> alone. Once the obvious placements run out, an Easy puzzle always
            leaves at least one cell where hidden single reasoning is the only way forward — check each unit’s missing digits against where
            they can still legally go, rather than reading candidates straight off one cell. Suuudokuuu’s technique engine tries hidden
            single third, right after full house and <Link href={nakedSinglePageMetadata.path}>naked single</Link>, and an Easy-rated puzzle
            never needs to go further than that: no pointing pairs, no subsets, nothing that asks you to hold more than one unit in mind at
            once.
        </p>
        <h2>How hard is it, honestly</h2>
        <p>
            There is no published SE (Sudoku Explainer) rating band for Easy yet — that companion guide is still being written — but on any
            qualitative scale, Easy sits at the bottom alongside Newbie. What changes is scanning time, not the difficulty of any single
            deduction: with three times as many blanks, an Easy solve simply takes longer to work through even though every individual step
            stays trivial. It suits players who have cleared a few Newbie boards and want a puzzle that takes more than a minute.
        </p>
        <h2>Where to go next</h2>
        <p>
            Solving Easy boards without reaching for a hidden single? Step back to{' '}
            <Link href={newbieSudokuPageMetadata.path}>Newbie Sudoku</Link>, or step up to{' '}
            <Link href={mediumSudokuPageMetadata.path}>Medium Sudoku</Link>, where intersections and your first pairs appear. See the full{' '}
            <Link href={techniquesPageMetadata.path}>technique index</Link>, the <Link href={howToPlayPageMetadata.path}>how to play</Link>{' '}
            guide, or every tier on the <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub back{' '}
            <Link href={homePageMetadata.path}>home</Link>.
        </p>
        <h2>Easy Sudoku FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>How many clues does an easy sudoku have?</FaqQuestion>
                <FaqAnswer>
                    {getDifficultyClueCount(DifficultyEnum.Easy)} clues out of 81 cells, leaving 30 blanks to solve with full houses, naked
                    singles and hidden singles.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What is the difference between Newbie and Easy sudoku?</FaqQuestion>
                <FaqAnswer>
                    Easy adds the hidden single to the two techniques Newbie already uses, and starts with far fewer clues, so more of the
                    grid needs that extra pattern to unlock.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do Easy puzzles ever need pencil marks?</FaqQuestion>
                <FaqAnswer>
                    Rarely. Most players can track the handful of candidates a hidden single needs in their head, but writing them down
                    never hurts on a busier row.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How hard is Easy sudoku?</FaqQuestion>
                <FaqAnswer>
                    Easy stays within singles-only logic, so it is still beginner-friendly. The only added skill over Newbie is spotting a
                    digit that fits nowhere else in a unit.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <DifficultyNavigation next={mediumSudokuPageMetadata} previous={newbieSudokuPageMetadata} />
    </main>
);

export default EasySudokuPage;
