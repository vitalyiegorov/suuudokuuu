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
import { howToPlayPageMetadata } from '../../how-to-play/metadata';
import { homePageMetadata } from '../../metadata';
import { printableEasySudokuPageMetadata } from '../../printable/easy/metadata';
import { sudokuForSeniorsPageMetadata } from '../../sudoku-for-seniors/metadata';
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

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const EasySudokuPage = () => {
    const easyReport = getTierTechniqueReport(DifficultyEnum.Easy);

    return (
        <main>
            <PageHeader metadata={easySudokuPageMetadata}>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem path={sudokuDifficultiesPageMetadata.path}>Sudoku difficulties</BreadcrumbListItem>
                <BreadcrumbListItem>Easy</BreadcrumbListItem>
            </PageHeader>
            <p>
                Easy is the first tier where Suuudokuuu expects a genuine, if gentle, solve. An Easy board carries{' '}
                {getDifficultyClueCount(DifficultyEnum.Easy)} clues out of 81 cells, a handful fewer than Newbie. Full houses and naked
                singles still clear most of the grid, but never all of it: at least one cell always needs a{' '}
                <Link href={hiddenSinglePageMetadata.path}>hidden single</Link>, where a digit fits only one cell of a row, column or box
                even though that cell still shows other candidates. That one extra pattern is the entire step up from Newbie to Easy, and it
                is a guarantee rather than a tendency: a board that a full-house-and-naked-single solver can finish is rejected as too easy
                for the tier, and a board that needs anything past the hidden single is rejected as too hard.
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        Easy boards carry {getDifficultyClueCount(DifficultyEnum.Easy)} clues and are guaranteed to need at least one hidden
                        single and nothing harder.
                    </li>
                    <li>Full houses and naked singles still clear most of the grid; the hidden single is the one addition over Newbie.</li>
                    <li>
                        Our sample of {easyReport.sampleSize} Easy boards measures SE <SeRatingRange report={easyReport} />.
                    </li>
                    <li>A board that a full-house-and-naked-single solver can finish is rejected as too easy for the tier.</li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={SITE_PLAY_URL}>
                Play Easy Sudoku now
            </a>
            <h2>What makes a puzzle Easy</h2>
            <p>
                Those extra blanks over Newbie are enough that the grid stops filling itself in from{' '}
                <Link href={fullHousePageMetadata.path}>full houses</Link> alone. Once the obvious placements run out, an Easy puzzle always
                leaves at least one cell where hidden single reasoning is the only way forward — check each unit’s missing digits against
                where they can still legally go, rather than reading candidates straight off one cell. Suuudokuuu’s technique engine tries
                hidden single third, right after full house and <Link href={nakedSinglePageMetadata.path}>naked single</Link>, and an
                Easy-rated puzzle never needs to go further than that: no pointing pairs, no subsets, nothing that asks you to hold more
                than one unit in mind at once. The gap between the tiers is small on purpose — it is exactly one technique wide.
            </p>
            <h2>How hard is it, honestly</h2>
            <p>
                Easy sits at the bottom of the SE (Sudoku Explainer) scale alongside Newbie: our sample of {easyReport.sampleSize} boards
                measures SE <SeRatingRange report={easyReport} />. The two tiers share a range because SE prices a hidden single at 1.5,
                below a naked single at 2.3 — so the technique that defines Easy is, by that scale, cheaper than the one that defines
                Newbie. What genuinely changes is where you have to look: a naked single is read off one cell, a hidden single off a whole
                unit. It suits players who have cleared a few Newbie boards and want a puzzle that takes noticeably longer to finish.
            </p>
            <h2>Where to go next</h2>
            <p>
                Solving Easy boards without reaching for a hidden single? Step back to{' '}
                <Link href={newbieSudokuPageMetadata.path}>Newbie Sudoku</Link>, or step up to{' '}
                <Link href={mediumSudokuPageMetadata.path}>Medium Sudoku</Link>, where intersections and your first pairs appear. Prefer
                paper? Download the <Link href={printableEasySudokuPageMetadata.path}>printable Easy sudoku booklet</Link>, or see the{' '}
                <Link href={sudokuForSeniorsPageMetadata.path}>sudoku for seniors</Link> guide for large-print and comfort options. See the
                full <Link href={techniquesPageMetadata.path}>technique index</Link>, the{' '}
                <Link href={howToPlayPageMetadata.path}>how to play</Link> guide, or every tier on the{' '}
                <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub back{' '}
                <Link href={homePageMetadata.path}>home</Link>.
            </p>
            <h2>Easy Sudoku FAQ</h2>
            <FaqPage>
                <Faq>
                    <FaqQuestion>How many clues does an easy sudoku have?</FaqQuestion>
                    <FaqAnswer>
                        {getDifficultyClueCount(DifficultyEnum.Easy)} clues out of 81 cells, solved start to finish with full houses, naked
                        singles and hidden singles.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>What is the difference between Newbie and Easy sudoku?</FaqQuestion>
                    <FaqAnswer>
                        Exactly one technique. Every Newbie board can be finished with full houses and naked singles; every Easy board
                        provably cannot, and needs at least one hidden single to break the deadlock.
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
                        Easy stays within singles-only logic, so it is still beginner-friendly. The only added skill over Newbie is spotting
                        a digit that fits nowhere else in a unit.
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={mediumSudokuPageMetadata} previous={newbieSudokuPageMetadata} />
        </main>
    );
};

export default EasySudokuPage;
