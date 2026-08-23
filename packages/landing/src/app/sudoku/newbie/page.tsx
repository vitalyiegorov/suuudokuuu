import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import { getDifficultyClueCount } from '../../../difficulty/utils/get-difficulty-clue-count.util';
import { SeRatingRange } from '../../../rating/components/se-rating-range/se-rating-range';
import { getTierTechniqueReport } from '../../../rating/utils/get-tier-technique-reports.util';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { sudokuDifficultyRatingPageMetadata } from '../../guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../how-to-play/metadata';
import { homePageMetadata } from '../../metadata';
import { printableNewbieSudokuPageMetadata } from '../../printable/newbie/metadata';
import { sudokuForSeniorsPageMetadata } from '../../sudoku-for-seniors/metadata';
import { fullHousePageMetadata } from '../../techniques/full-house/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { nakedSinglePageMetadata } from '../../techniques/naked-single/metadata';
import { easySudokuPageMetadata } from '../easy/metadata';
import { sudokuDifficultiesPageMetadata } from '../metadata';

import { newbieSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(newbieSudokuPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const NewbieSudokuPage = () => {
    const newbieReport = getTierTechniqueReport(DifficultyEnum.Newbie);

    return (
        <main>
            <PageHeader metadata={newbieSudokuPageMetadata}>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem path={sudokuDifficultiesPageMetadata.path}>Sudoku difficulties</BreadcrumbListItem>
                <BreadcrumbListItem>Newbie</BreadcrumbListItem>
            </PageHeader>
            <p>
                Newbie is Suuudokuuu’s beginner tier, the gentlest possible introduction to the grid. A Newbie board starts with{' '}
                {getDifficultyClueCount(DifficultyEnum.Newbie)} of the 81 cells already filled. Every remaining cell can be found with the
                two simplest deductions in the game: a <Link href={fullHousePageMetadata.path}>full house</Link>, where a unit is down to
                its last empty cell, and a <Link href={nakedSinglePageMetadata.path}>naked single</Link>, where a cell’s row, column and box
                between them already account for eight of the nine digits. That is not a description of a typical Newbie board — it is the
                rule the generator enforces: a candidate board is only accepted as Newbie once a solver restricted to full houses and naked
                singles has finished it. No pencil marks, no elimination logic and no guessing are ever required.
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        Newbie boards carry {getDifficultyClueCount(DifficultyEnum.Newbie)} clues and are guaranteed to finish with full
                        houses and naked singles alone.
                    </li>
                    <li>No pencil marks, no elimination logic and no guessing are ever required.</li>
                    <li>
                        Our sample of {newbieReport.sampleSize} Newbie boards measures SE <SeRatingRange report={newbieReport} />.
                    </li>
                    <li>A board that needs a hidden single or anything harder is rejected and regenerated, never labelled Newbie.</li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={SITE_PLAY_URL}>
                Play Newbie Sudoku now
            </a>
            <h2>What makes a puzzle Newbie</h2>
            <p>
                Full House and Naked Single are the first two strategies Suuudokuuu’s solving engine tries on every board at every
                difficulty, because they are the cheapest deductions to verify. What sets Newbie apart is that the tier is defined as the
                boards that never need anything else. Strip more digits and a solver eventually stalls without hidden singles, intersections
                or subsets, and the generator throws those boards back rather than labelling them Newbie. If you can read a row and name the
                one digit missing from it, you already have every skill a Newbie puzzle asks for.
            </p>
            <h2>How hard is it, honestly</h2>
            <p>
                Every Newbie board is rated on the SE (Sudoku Explainer) scale the moment it is created. Our published sample of{' '}
                {newbieReport.sampleSize} Newbie boards measures SE <SeRatingRange report={newbieReport} /> — the very bottom of a scale
                that runs to 12, and below what most SE-based charts even bother to name. Newbie exists to teach the row-column-box overlap
                that every later technique builds on, not to test it. The measured range for this tier and every other is published in our{' '}
                <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link>. Treat a fast, mistake-free
                Newbie solve as confirmation you’re ready for Easy, not as a benchmark worth chasing for its own sake.
            </p>
            <h2>Where to go next</h2>
            <p>
                Ready for a puzzle that needs one more idea? Move up to <Link href={easySudokuPageMetadata.path}>Easy Sudoku</Link>, which
                adds the hidden single on top of everything here. Prefer paper? Download the{' '}
                <Link href={printableNewbieSudokuPageMetadata.path}>printable Newbie sudoku booklet</Link>, or see the{' '}
                <Link href={sudokuForSeniorsPageMetadata.path}>sudoku for seniors</Link> guide for large-print and comfort options. Browse
                the full <Link href={techniquesPageMetadata.path}>technique index</Link> or the{' '}
                <Link href={howToPlayPageMetadata.path}>how to play guide</Link>, or head back{' '}
                <Link href={homePageMetadata.path}>home</Link> and see all six tiers on the{' '}
                <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub.
            </p>
            <h2>Newbie Sudoku FAQ</h2>
            <FaqPage>
                <Faq>
                    <FaqQuestion>How hard is Newbie sudoku?</FaqQuestion>
                    <FaqAnswer>
                        It is the easiest tier Suuudokuuu offers, and the generator guarantees it: a board only ships as Newbie once a
                        solver limited to full houses and naked singles has finished it. Our sample measures SE{' '}
                        <SeRatingRange report={newbieReport} />, with no candidate tracking and no risk of a forced guess.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>How many clues does a Newbie puzzle have?</FaqQuestion>
                    <FaqAnswer>
                        {getDifficultyClueCount(DifficultyEnum.Newbie)} clues out of 81 cells, and every blank is reachable with a full
                        house or a naked single.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>What is the easiest Sudoku difficulty?</FaqQuestion>
                    <FaqAnswer>
                        Newbie is the easiest of Suuudokuuu’s six tiers, followed by Easy, Medium, Hard, Nightmare and Hell in increasing
                        order of technique demand.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Do I need pencil marks for Newbie puzzles?</FaqQuestion>
                    <FaqAnswer>
                        No. Both techniques a Newbie puzzle requires can be read straight off the board, which is exactly why they are the
                        fastest deductions in the game.
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={easySudokuPageMetadata} />
        </main>
    );
};

export default NewbieSudokuPage;
