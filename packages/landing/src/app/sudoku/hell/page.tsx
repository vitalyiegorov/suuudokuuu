import { DifficultyEnum } from '@suuudokuuu/generator';
import { HELL_CORPUS_MAXIMUM_GIVEN_COUNT, HELL_CORPUS_MINIMUM_GIVEN_COUNT, hellCorpusSize } from '@suuudokuuu/hell-corpus';
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
                Hell is Suuudokuuu’s hardest tier — what most competitors call evil or extreme. A Hell board is defined by the reasoning it
                demands, not by how few clues it starts with: no Hell board can be finished with any technique Nightmare allows, so every
                one needs a forcing chain. Unlike the generated tiers, Hell is drawn from a bundled corpus of published hard puzzles,
                verified by two independent solvers before it ships, and every board still solves on our technique ladder without guessing.
                Expect to use every chain and coloring pattern first — <Link href={xChainPageMetadata.path}>X-Chain</Link>,{' '}
                <Link href={xyChainPageMetadata.path}>XY-Chain</Link>, <Link href={simpleColoringPageMetadata.path}>simple coloring</Link>{' '}
                and <Link href={aicPageMetadata.path}>AIC</Link> — before a forcing chain breaks the deadlock.
            </p>
            <TechniqueSummary>
                <ul>
                    <li>Every Hell board needs a forcing chain: none can be solved with the techniques Nightmare allows, up to AIC.</li>
                    <li>
                        {hellCorpusSize} verified puzzles with {HELL_CORPUS_MINIMUM_GIVEN_COUNT} to {HELL_CORPUS_MAXIMUM_GIVEN_COUNT} clues,
                        drawn from the tdoku 17-clue catalog and the magictour top1465 list rather than generated fresh.
                    </li>
                    <li>
                        Our sample of {hellReport.sampleSize} Hell boards measures SE <SeRatingRange report={hellReport} />.
                    </li>
                    <li>Hardness here comes from the technique each board requires, not from the clue count.</li>
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
                along one continuous chain. Hell starts where all of that runs out. A forcing chain assumes a candidate, a cell’s
                possibilities or a house’s placements, follows every consequence, and keeps only what holds in every branch. A board makes
                the Hell corpus only if its hardest step on the rating-optimal path is a forcing chain, and only if our ladder can still
                finish it, so no Hell board ever asks you to guess.
            </p>
            <h2>How hard is it, honestly</h2>
            <p>
                Our sample of {hellReport.sampleSize} Hell boards measures SE (Sudoku Explainer) <SeRatingRange report={hellReport} />, with
                the <TechniqueLink technique={hellReport.typicalHardestTechnique} /> as the most common hardest step and the{' '}
                <TechniqueLink technique={hellReport.hardestTechniqueReached} /> as the hardest step anything in the sample reached. Be
                careful not to read the clue count as the cause: the same sample puts{' '}
                <Link href={nightmareSudokuPageMetadata.path}>Nightmare</Link> at SE <SeRatingRange report={nightmareReport} /> with{' '}
                {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues, and some Hell boards start with more givens than that. This tier
                used to be built from 17-clue puzzles alone, and it rated no harder than Nightmare; selecting on the required technique
                instead is what separates the two. Our{' '}
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
                        A forcing chain, on every board, layered on top of the chains, coloring, fish, wings and subsets the earlier tiers
                        already require. X-Chain, XY-Chain, Simple Coloring and AIC will carry you far, but never all the way through.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>How many clues does a Hell sudoku have?</FaqQuestion>
                    <FaqAnswer>
                        Anywhere from {HELL_CORPUS_MINIMUM_GIVEN_COUNT} to {HELL_CORPUS_MAXIMUM_GIVEN_COUNT}. Hell does not use clue count
                        to choose its puzzles; a board qualifies by needing a forcing chain, whatever its number of givens.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Is Hell harder than Nightmare?</FaqQuestion>
                    <FaqAnswer>
                        Yes, by construction. Nightmare stops at AIC, and no Hell board can be solved with anything Nightmare allows. Our
                        sample measures Hell at SE <SeRatingRange report={hellReport} /> and Nightmare at SE{' '}
                        <SeRatingRange report={nightmareReport} />.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Why does Hell use a fixed puzzle corpus instead of generating puzzles?</FaqQuestion>
                    <FaqAnswer>
                        Boards that need a forcing chain are rare and expensive to search for on demand, so Suuudokuuu ships a bundled
                        corpus that has already been checked by a Dancing Links exact-cover solver and a bitmask solver, rated, and filtered
                        to forcing-chain boards before it is packed.
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation previous={nightmareSudokuPageMetadata} />
        </main>
    );
};

export default HellSudokuPage;
