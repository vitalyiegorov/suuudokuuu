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
import { seventeenClueSudokuPageMetadata } from '../../17-clue-sudoku/metadata';
import { sudokuCluesVsDifficultyPageMetadata } from '../../guides/sudoku-clues-vs-difficulty/metadata';
import { sudokuDifficultyRatingPageMetadata } from '../../guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../how-to-play/metadata';
import { homePageMetadata } from '../../metadata';
import { printableHellSudokuPageMetadata } from '../../printable/hell/metadata';
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

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const HellSudokuPage = () => {
    const hellReport = getTierTechniqueReport(DifficultyEnum.Hell);
    const nightmareReport = getTierTechniqueReport(DifficultyEnum.Nightmare);

    return (
        <main>
            <PageHeader metadata={hellSudokuPageMetadata}>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem path={sudokuDifficultiesPageMetadata.path}>Sudoku difficulties</BreadcrumbListItem>
                <BreadcrumbListItem>Hell</BreadcrumbListItem>
            </PageHeader>
            <p>
                Hell is Suuudokuuu’s hardest tier — what most competitors call evil or extreme. A Hell board carries just{' '}
                {getDifficultyClueCount(DifficultyEnum.Hell)} clues out of 81 cells, the minimum number of clues a sudoku can have and still
                keep a unique solution. Unlike every other tier, Hell is not generated to a technique band: it is drawn from a bundled
                corpus of real minimum-clue puzzles, verified by two independent solvers and filtered by SE rating before it ships. In
                practice that means chains and coloring — <Link href={xChainPageMetadata.path}>X-Chain</Link>,{' '}
                <Link href={xyChainPageMetadata.path}>XY-Chain</Link>, <Link href={simpleColoringPageMetadata.path}>simple coloring</Link>{' '}
                and <Link href={aicPageMetadata.path}>AIC</Link>, the technique that generalises all three.
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        Hell boards carry {getDifficultyClueCount(DifficultyEnum.Hell)} clues, the proven minimum for a unique-solution
                        sudoku, drawn from a bundled and independently verified 17-clue corpus rather than generated fresh.
                    </li>
                    <li>Chain and coloring techniques: X-Chain, XY-Chain, simple coloring and AIC.</li>
                    <li>
                        Our sample of {hellReport.sampleSize} Hell boards measures SE <SeRatingRange report={hellReport} />.
                    </li>
                    <li>Hardness here comes from the SE rating filter applied to the corpus, not from the clue count.</li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={SITE_PLAY_URL}>
                Play Hell Sudoku now
            </a>
            <h2>What makes a puzzle Hell</h2>
            <p>
                A chain follows an alternating sequence of strong and weak links, starting from a candidate and working outward until it
                proves an elimination or a placement no matter which branch turns out to be true. X-Chain works on a single digit; XY-Chain
                follows a path of bivalue cells instead. Simple coloring assigns two alternating colours to a network of strong links on one
                digit and clears any candidate that sees both colours, and AIC generalises the whole family, mixing digits and cell types
                along one continuous chain. Seventeen clues is not an arbitrary number: it is the smallest clue count mathematically proven
                to still guarantee a unique solution, which is why the corpus behind this tier is fixed and verified rather than generated
                fresh for every puzzle.
            </p>
            <h2>How hard is it, honestly</h2>
            <p>
                Our sample of {hellReport.sampleSize} Hell boards measures SE (Sudoku Explainer) <SeRatingRange report={hellReport} />, with
                the <TechniqueLink technique={hellReport.typicalHardestTechnique} /> as the most common hardest step and the{' '}
                <TechniqueLink technique={hellReport.hardestTechniqueReached} /> as the hardest step anything in the sample reached. Be
                careful about what the clue count is doing here, though: the same sample puts{' '}
                <Link href={nightmareSudokuPageMetadata.path}>Nightmare</Link> at SE <SeRatingRange report={nightmareReport} /> with{' '}
                {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues, which reaches nearly as high while starting with more givens.
                Seventeen clues makes a puzzle rare and hard to construct; what makes these particular boards hard is the rating filter
                applied to the corpus, not the number of givens. Our{' '}
                <Link href={sudokuCluesVsDifficultyPageMetadata.path}>clues versus difficulty guide</Link> takes that argument apart
                properly, and the <Link href={sudokuDifficultyRatingPageMetadata.path}>rating guide</Link> publishes the per-tier tables.
            </p>
            <h2>Where to go next</h2>
            <p>
                Not ready for chains yet? Step back to <Link href={nightmareSudokuPageMetadata.path}>Nightmare Sudoku</Link>, which asks for
                the same reasoning with more of the grid already filled in. Prefer paper? Download the{' '}
                <Link href={printableHellSudokuPageMetadata.path}>printable Hell sudoku PDF</Link>. Browse the{' '}
                <Link href={techniquesPageMetadata.path}>technique index</Link>, especially X-Chain, XY-Chain, Simple Coloring and AIC, the{' '}
                <Link href={howToPlayPageMetadata.path}>how to play guide</Link>, the{' '}
                <Link href={seventeenClueSudokuPageMetadata.path}>17-clue sudoku guide</Link>, every tier on the{' '}
                <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub, or head{' '}
                <Link href={homePageMetadata.path}>home</Link>.
            </p>
            <FaqPage>
                <FaqHeading>Hell Sudoku FAQ</FaqHeading>
                <Faq>
                    <FaqQuestion>What techniques do I need for Hell level?</FaqQuestion>
                    <FaqAnswer>
                        Chains and coloring: X-Chain, XY-Chain, Simple Coloring and AIC, layered on top of every fish, wing and subset
                        technique the earlier tiers already require. A minority of boards in our sample also needed a forcing chain.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>How many clues does a Hell sudoku have?</FaqQuestion>
                    <FaqAnswer>
                        {getDifficultyClueCount(DifficultyEnum.Hell)} clues, the proven minimum for a sudoku with a unique solution.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Is Hell harder than Nightmare?</FaqQuestion>
                    <FaqAnswer>
                        Only slightly, and not because of the clue count. Our sample measures Hell at SE{' '}
                        <SeRatingRange report={hellReport} /> and Nightmare at SE <SeRatingRange report={nightmareReport} /> — Hell has the
                        higher floor, but the two tiers reach almost the same ceiling.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Why does Hell use a fixed puzzle corpus instead of generating puzzles?</FaqQuestion>
                    <FaqAnswer>
                        17-clue puzzles are rare and expensive to search for on demand, so Suuudokuuu ships a bundled corpus that has
                        already been checked by a Dancing Links exact-cover solver and a bitmask solver, rated, and filtered by that rating
                        before it is packed.
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation previous={nightmareSudokuPageMetadata} />
        </main>
    );
};

export default HellSudokuPage;
