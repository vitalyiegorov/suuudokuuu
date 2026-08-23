import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import { getDifficultyClueCount } from '../../../difficulty/utils/get-difficulty-clue-count.util';
import { SeRatingRange } from '../../../rating/components/se-rating-range/se-rating-range';
import { getTierTechniqueReport } from '../../../rating/utils/get-tier-technique-reports.util';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueLink } from '../../../techniques/components/technique-link/technique-link';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { sudokuDifficultyRatingPageMetadata } from '../../guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../how-to-play/metadata';
import { homePageMetadata } from '../../metadata';
import { printableMediumSudokuPageMetadata } from '../../printable/medium/metadata';
import { boxLineReductionPageMetadata } from '../../techniques/box-line-reduction/metadata';
import { hiddenPairPageMetadata } from '../../techniques/hidden-pair/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { nakedPairPageMetadata } from '../../techniques/naked-pair/metadata';
import { pointingPairPageMetadata } from '../../techniques/pointing-pair/metadata';
import { pointingTriplePageMetadata } from '../../techniques/pointing-triple/metadata';
import { easySudokuPageMetadata } from '../easy/metadata';
import { hardSudokuPageMetadata } from '../hard/metadata';
import { sudokuDifficultiesPageMetadata } from '../metadata';

import { mediumSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(mediumSudokuPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const MediumSudokuPage = () => {
    const mediumReport = getTierTechniqueReport(DifficultyEnum.Medium);

    return (
        <main>
            <PageHeader metadata={mediumSudokuPageMetadata}>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem path={sudokuDifficultiesPageMetadata.path}>Sudoku difficulties</BreadcrumbListItem>
                <BreadcrumbListItem>Medium</BreadcrumbListItem>
            </PageHeader>
            <p>
                Medium is where Suuudokuuu starts asking for pencil marks. A Medium board carries{' '}
                {getDifficultyClueCount(DifficultyEnum.Medium)} clues out of 81 cells, and singles alone provably never finish it: every
                board in the tier has been checked against a singles-only solver and rejected if that solver got through. Once full houses
                and singles run out, the puzzle stalls until you spot an intersection — a digit confined to where a box and a line overlap —
                or a pair locked together. <Link href={pointingPairPageMetadata.path}>Pointing pairs</Link>,{' '}
                <Link href={pointingTriplePageMetadata.path}>pointing triples</Link> and{' '}
                <Link href={boxLineReductionPageMetadata.path}>box line reduction</Link> cover the intersections;{' '}
                <Link href={nakedPairPageMetadata.path}>naked pairs</Link> and <Link href={hiddenPairPageMetadata.path}>hidden pairs</Link>{' '}
                cover the smallest subset pattern.
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        Medium boards carry {getDifficultyClueCount(DifficultyEnum.Medium)} clues and are guaranteed to stall on singles and
                        yield to an intersection or a subset.
                    </li>
                    <li>Intersections: pointing pair, pointing triple, box line reduction. Subsets: naked pair, hidden pair.</li>
                    <li>
                        Our sample of {mediumReport.sampleSize} Medium boards measures SE <SeRatingRange report={mediumReport} />.
                    </li>
                    <li>Nothing in the tier ever needs a fish, a wing or a chain — a board that does is promoted to Hard instead.</li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={SITE_PLAY_URL}>
                Play Medium Sudoku now
            </a>
            <h2>What makes a puzzle Medium</h2>
            <p>
                An intersection technique works on the overlap between one box and one row or column. A pointing pair or pointing triple
                finds a digit confined to two or three cells of a box that all share a line, and erases it from the rest of that line; box
                line reduction is the mirror image, working from a line back into a box. Naked and hidden pairs are the entry point to
                subset reasoning: two cells that share exactly two candidates, or two digits that fit in exactly two cells of a unit, either
                way locking those two cells away from everything else in it. None of these place a digit outright — they only eliminate
                candidates — but at {getDifficultyClueCount(DifficultyEnum.Medium)} clues a Medium puzzle always has at least one waiting,
                and it is usually enough to unlock a fresh naked single a move or two later. The tier is capped at the other end too:
                nothing in it ever needs a fish, a wing or a chain, because a board that does is promoted to Hard instead.
            </p>
            <h2>How hard is it, honestly</h2>
            <p>
                Our sample of {mediumReport.sampleSize} Medium boards measures SE <SeRatingRange report={mediumReport} />, and{' '}
                {mediumReport.singlesOnlyPuzzleCount} of {mediumReport.sampleSize} finished on singles alone — this is the first tier where
                that number is zero by construction. The most common hardest step in the sample is the{' '}
                <TechniqueLink technique={mediumReport.typicalHardestTechnique} />, and the hardest anything reached is the{' '}
                <TechniqueLink technique={mediumReport.hardestTechniqueReached} />. Players who read pencil marks fluently clear a Medium
                board noticeably faster than players relying on mental candidate tracking, who will find this the first tier that genuinely
                rewards writing candidates down. The full per-tier data sits in our{' '}
                <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link>.
            </p>
            <h2>Where to go next</h2>
            <p>
                Comfortable spotting intersections and subsets? Move up to <Link href={hardSudokuPageMetadata.path}>Hard Sudoku</Link>,
                where a fish or a wing is always required, or drop back to <Link href={easySudokuPageMetadata.path}>Easy Sudoku</Link> to
                revisit singles. Prefer paper? Download the{' '}
                <Link href={printableMediumSudokuPageMetadata.path}>printable Medium sudoku booklet</Link>. Browse the{' '}
                <Link href={techniquesPageMetadata.path}>technique index</Link>, the{' '}
                <Link href={howToPlayPageMetadata.path}>how to play guide</Link>, every tier on the{' '}
                <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub, or head{' '}
                <Link href={homePageMetadata.path}>home</Link>.
            </p>
            <FaqPage>
                <FaqHeading>Medium Sudoku FAQ</FaqHeading>
                <Faq>
                    <FaqQuestion>What techniques do I need for Medium sudoku?</FaqQuestion>
                    <FaqAnswer>
                        Full houses and singles as a baseline, plus pointing pairs, pointing triples, box line reduction and the naked or
                        hidden subsets up to quads whenever singles run dry. At least one of those is always required, and nothing harder
                        ever is.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>How many clues does a Medium sudoku have?</FaqQuestion>
                    <FaqAnswer>
                        {getDifficultyClueCount(DifficultyEnum.Medium)} clues out of 81 cells, a third of the grid filled in before you
                        start.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>What is a pointing pair?</FaqQuestion>
                    <FaqAnswer>
                        A digit confined to two cells of one box that also share a row or column. It can then be erased from the rest of
                        that row or column, since one of those two cells must hold it.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Is Medium sudoku hard?</FaqQuestion>
                    <FaqAnswer>
                        It is a real step up from Easy, but every technique it needs still works inside a single box or line at a time — the
                        longer fish and chain patterns only start at Hard and beyond.
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={hardSudokuPageMetadata} previous={easySudokuPageMetadata} />
        </main>
    );
};

export default MediumSudokuPage;
