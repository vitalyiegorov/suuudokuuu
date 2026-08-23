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
import { printableNightmareSudokuPageMetadata } from '../../printable/nightmare/metadata';
import { aicPageMetadata } from '../../techniques/aic/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { simpleColoringPageMetadata } from '../../techniques/simple-coloring/metadata';
import { wWingPageMetadata } from '../../techniques/w-wing/metadata';
import { xChainPageMetadata } from '../../techniques/x-chain/metadata';
import { xyChainPageMetadata } from '../../techniques/xy-chain/metadata';
import { hardSudokuPageMetadata } from '../hard/metadata';
import { hellSudokuPageMetadata } from '../hell/metadata';
import { sudokuDifficultiesPageMetadata } from '../metadata';

import { nightmareSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(nightmareSudokuPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const NightmareSudokuPage = () => {
    const nightmareReport = getTierTechniqueReport(DifficultyEnum.Nightmare);

    return (
        <main>
            <PageHeader metadata={nightmareSudokuPageMetadata}>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem path={sudokuDifficultiesPageMetadata.path}>Sudoku difficulties</BreadcrumbListItem>
                <BreadcrumbListItem>Nightmare</BreadcrumbListItem>
            </PageHeader>
            <p>
                Nightmare is Suuudokuuu’s expert tier — what most other apps would call very hard or expert. A Nightmare board carries just{' '}
                {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues out of 81 cells, and it is the tier where bounded patterns stop
                being enough: every board here has been checked against a solver that already knows every fish and every wing up to the{' '}
                <Link href={wWingPageMetadata.path}>W-Wing</Link>, and is only labelled Nightmare because that solver stalled. Finishing one
                needs chain reasoning — <Link href={xChainPageMetadata.path}>X-Chain</Link>,{' '}
                <Link href={xyChainPageMetadata.path}>XY-Chain</Link>, <Link href={simpleColoringPageMetadata.path}>simple coloring</Link>{' '}
                and <Link href={aicPageMetadata.path}>AIC</Link>, the alternating inference chain that generalises the other three.
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        Nightmare boards carry {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues and are guaranteed to need at least
                        one chain or coloring technique beyond every fish and wing.
                    </li>
                    <li>Chain and coloring techniques: X-Chain, XY-Chain, simple coloring and AIC.</li>
                    <li>
                        Our sample of {nightmareReport.sampleSize} Nightmare boards measures SE <SeRatingRange report={nightmareReport} />.
                    </li>
                    <li>Nightmare is capped at AIC — a board resisting that is beyond what the generated tiers hand you.</li>
                </ul>
            </TechniqueSummary>
            <a className="hero__cta" href={SITE_PLAY_URL}>
                Play Nightmare Sudoku now
            </a>
            <h2>What makes a puzzle Nightmare</h2>
            <p>
                A chain follows an alternating sequence of strong and weak links between candidates, starting from one end and reasoning
                outward until the two ends prove an elimination no matter which of them turns out to be true. X-Chain does this with a
                single digit; XY-Chain walks a path of bivalue cells instead, changing digit at every step. Simple coloring assigns two
                alternating colours to a network of strong links on one digit and clears any candidate that can see both colours. AIC folds
                all of them into one technique, mixing digits and link types along a single continuous chain. The difference from a fish or
                a wing is not subtlety but shape: a wing is a fixed arrangement of three or four cells you learn to recognise, while a chain
                has no fixed size and has to be built move by move. Nightmare is capped at AIC — anything that still resists is beyond what
                the generated tiers will hand you.
            </p>
            <h2>How hard is it, honestly</h2>
            <p>
                Our sample of {nightmareReport.sampleSize} Nightmare boards measures SE (Sudoku Explainer){' '}
                <SeRatingRange report={nightmareReport} />, with the <TechniqueLink technique={nightmareReport.typicalHardestTechnique} />{' '}
                as the most common hardest step. That upper end sits in the same territory as our 17-clue{' '}
                <Link href={hellSudokuPageMetadata.path}>Hell tier</Link>, which is the clearest evidence on the site that clue count and
                difficulty are separate facts: Nightmare hands you eight more givens and asks for the same reasoning. The measured tables
                live in our <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link>. Qualitatively, this
                is where difficulty stops being about speed and becomes about holding an entire line of implication in your head without
                losing track of it.
            </p>
            <h2>Where to go next</h2>
            <p>
                Cleared a few Nightmare boards? <Link href={hellSudokuPageMetadata.path}>Hell Sudoku</Link> is the last tier, built from a
                bundled 17-clue corpus. Step back to <Link href={hardSudokuPageMetadata.path}>Hard Sudoku</Link> if fish and wings still
                feel unreliable. Prefer paper? Download the{' '}
                <Link href={printableNightmareSudokuPageMetadata.path}>printable Nightmare sudoku booklet</Link>. Browse the{' '}
                <Link href={techniquesPageMetadata.path}>technique index</Link>, the{' '}
                <Link href={howToPlayPageMetadata.path}>how to play guide</Link>, every tier on the{' '}
                <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub, or head{' '}
                <Link href={homePageMetadata.path}>home</Link>.
            </p>
            <FaqPage>
                <FaqHeading>Nightmare Sudoku FAQ</FaqHeading>
                <Faq>
                    <FaqQuestion>How hard is Nightmare sudoku?</FaqQuestion>
                    <FaqAnswer>
                        It is Suuudokuuu’s hardest generated tier, measured at SE <SeRatingRange report={nightmareReport} /> across a sample
                        of {nightmareReport.sampleSize} boards. Every one of them needs chain or coloring logic on top of the fish and wing
                        patterns Hard already requires.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>How many clues does a Nightmare sudoku have?</FaqQuestion>
                    <FaqAnswer>
                        {getDifficultyClueCount(DifficultyEnum.Nightmare)} clues out of 81 cells, well under a third of the grid.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>What is the difference between a wing and a chain?</FaqQuestion>
                    <FaqAnswer>
                        Size and shape. A wing is a fixed pattern of three or four cells you learn to recognise at a glance; a chain is
                        built link by link and can run to any length, which is why chains sit a full band above wings on the SE scale.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Do Nightmare puzzles ever need guessing?</FaqQuestion>
                    <FaqAnswer>
                        No. Every board in the tier is verified solvable by the technique ladder up to AIC before it ships, so a completed
                        chain always exists — finding it is the work.
                    </FaqAnswer>
                </Faq>
            </FaqPage>
            <DifficultyNavigation next={hellSudokuPageMetadata} previous={hardSudokuPageMetadata} />
        </main>
    );
};

export default NightmareSudokuPage;
