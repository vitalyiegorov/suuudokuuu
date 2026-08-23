import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import { getDifficultyClueCount } from '../../../difficulty/utils/get-difficulty-clue-count.util';
import { SeRatingRange } from '../../../rating/components/se-rating-range/se-rating-range';
import { getTierTechniqueReport } from '../../../rating/utils/get-tier-technique-reports.util';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../../seo/components/breadcrumbs/breadcrumbs';
import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueLink } from '../../../techniques/components/technique-link/technique-link';
import { sudokuDifficultyRatingPageMetadata } from '../../guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../how-to-play/metadata';
import { homePageMetadata } from '../../metadata';
import { printableHardSudokuPageMetadata } from '../../printable/hard/metadata';
import { finnedSwordfishPageMetadata } from '../../techniques/finned-swordfish/metadata';
import { finnedXWingPageMetadata } from '../../techniques/finned-x-wing/metadata';
import { hiddenQuadPageMetadata } from '../../techniques/hidden-quad/metadata';
import { jellyfishPageMetadata } from '../../techniques/jellyfish/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { sashimiXWingPageMetadata } from '../../techniques/sashimi-x-wing/metadata';
import { swordfishPageMetadata } from '../../techniques/swordfish/metadata';
import { wWingPageMetadata } from '../../techniques/w-wing/metadata';
import { xWingPageMetadata } from '../../techniques/x-wing/metadata';
import { xyWingPageMetadata } from '../../techniques/xy-wing/metadata';
import { xyzWingPageMetadata } from '../../techniques/xyz-wing/metadata';
import { mediumSudokuPageMetadata } from '../medium/metadata';
import { sudokuDifficultiesPageMetadata } from '../metadata';
import { nightmareSudokuPageMetadata } from '../nightmare/metadata';

import { hardSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(hardSudokuPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const HardSudokuPage = () => {
    const hardReport = getTierTechniqueReport(DifficultyEnum.Hard);

    return (
        <main>
            <Breadcrumbs>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem path={sudokuDifficultiesPageMetadata.path}>Sudoku difficulties</BreadcrumbListItem>
                <BreadcrumbListItem>Hard</BreadcrumbListItem>
            </Breadcrumbs>
            <h1>Hard Sudoku Puzzles</h1>
            <p>
                Hard is where reasoning stops fitting inside a single box or line. A Hard board carries{' '}
                {getDifficultyClueCount(DifficultyEnum.Hard)} clues out of 81 cells, and it is defined by what it refuses to yield to: every
                board in the tier has been run through a solver equipped with every intersection and every subset up to the{' '}
                <Link href={hiddenQuadPageMetadata.path}>hidden quad</Link>, and kept only because that solver got stuck. What breaks the
                deadlock is a fish — <Link href={xWingPageMetadata.path}>X-Wing</Link>,{' '}
                <Link href={swordfishPageMetadata.path}>swordfish</Link>, <Link href={jellyfishPageMetadata.path}>jellyfish</Link> and their{' '}
                <Link href={finnedXWingPageMetadata.path}>finned</Link> and <Link href={sashimiXWingPageMetadata.path}>sashimi</Link>{' '}
                variants — or a wing: <Link href={xyWingPageMetadata.path}>XY-Wing</Link>,{' '}
                <Link href={xyzWingPageMetadata.path}>XYZ-Wing</Link> and <Link href={wWingPageMetadata.path}>W-Wing</Link>.
            </p>
            <a className="hero__cta" href={SITE_PLAY_URL}>
                Play Hard Sudoku now
            </a>
            <h2>What makes a puzzle Hard</h2>
            <p>
                A fish looks at one digit across several lines at once. The X-Wing is the smallest: a digit confined to the same two columns
                across two rows can be erased from the rest of those columns, because whichever row ends up holding it, the columns are
                already fixed. A <Link href={swordfishPageMetadata.path}>swordfish</Link> stretches the same idea over three lines and a
                jellyfish over four. Finned and sashimi variants relax the base pattern by allowing one extra candidate that still supports
                a smaller, safe elimination once you account for it — and in our sample they fire far more often than the textbook shapes
                do. Wings work differently: an XY-Wing links three bivalue cells so a candidate shared between two of them can be erased
                wherever both can see, XYZ-Wing gives the pivot that candidate too, and W-Wing joins two matching bivalue cells through a
                strong link on one shared digit. Hard is capped at the W-Wing: a board that still will not move after every fish and wing
                has been tried is a Nightmare board, not a Hard one.
            </p>
            <h2>How hard is it, honestly</h2>
            <p>
                Our sample of {hardReport.sampleSize} Hard boards measures SE (Sudoku Explainer) <SeRatingRange report={hardReport} /> —
                squarely in the range the solving community associates with fish and wing patterns, and well below the chain territory above
                7. The most common hardest step is the <TechniqueLink technique={hardReport.typicalHardestTechnique} />, and the hardest
                anything in the sample reached is the <TechniqueLink technique={hardReport.hardestTechniqueReached} />. This is where casual
                solvers start reaching for a hint: fish and wings are easy to describe and genuinely hard to see on a live board. Expect a
                careful, honest solve to take ten minutes or more, and see the{' '}
                <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> for the full per-tier data.
            </p>
            <h2>Where to go next</h2>
            <p>
                Ready to chain eliminations together instead of spotting shapes? Move up to{' '}
                <Link href={nightmareSudokuPageMetadata.path}>Nightmare Sudoku</Link>, or step back to{' '}
                <Link href={mediumSudokuPageMetadata.path}>Medium Sudoku</Link> for an intersections-and-subsets puzzle. Prefer paper?
                Download the <Link href={printableHardSudokuPageMetadata.path}>printable Hard sudoku PDF</Link>. See the{' '}
                <Link href={techniquesPageMetadata.path}>technique index</Link>, the{' '}
                <Link href={howToPlayPageMetadata.path}>how to play guide</Link>, every tier on the{' '}
                <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub, or head{' '}
                <Link href={homePageMetadata.path}>home</Link>.
            </p>
            <h2>Hard Sudoku FAQ</h2>
            <FaqPage>
                <Faq>
                    <FaqQuestion>What techniques do I need for Hard sudoku?</FaqQuestion>
                    <FaqAnswer>
                        Everything Medium needs, plus at least one fish or wing pattern: X-Wing, swordfish, jellyfish, their finned and
                        sashimi variants, XY-Wing, XYZ-Wing or W-Wing. One of those is always required, because a board that does not need
                        one is graded Medium instead.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>How many clues does a Hard sudoku have?</FaqQuestion>
                    <FaqAnswer>
                        {getDifficultyClueCount(DifficultyEnum.Hard)} clues out of 81 cells — only one fewer than Medium, which is exactly
                        why the tier is defined by the techniques it requires rather than by its clue count.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>What is a finned fish in sudoku?</FaqQuestion>
                    <FaqAnswer>
                        An almost-fish: the rows or columns line up as an X-Wing or{' '}
                        <Link href={finnedSwordfishPageMetadata.path}>swordfish</Link> except for one or two extra candidates, the fin. The
                        elimination still holds, but only in the cells that both the fish and the fin can see.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Is Hard sudoku harder than Nightmare?</FaqQuestion>
                    <FaqAnswer>
                        No. Hard tops out at the W-Wing; Nightmare starts where Hard stops and runs up to alternating inference chains. The
                        two tiers are separated by a technique boundary, not by a clue count.
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={nightmareSudokuPageMetadata} previous={mediumSudokuPageMetadata} />
        </main>
    );
};

export default HardSudokuPage;
