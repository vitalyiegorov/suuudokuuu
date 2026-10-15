import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { TechniqueFrequencyTable } from '../../../../rating/components/technique-frequency-table/technique-frequency-table';
import { TierLadderTable } from '../../../../rating/components/tier-ladder-table/tier-ladder-table';
import { RATING_SAMPLE_SIZE, RATING_SAMPLE_TOTAL } from '../../../../rating/constants/rating-sample.constant';
import { TECHNIQUE_LADDER } from '../../../../rating/constants/technique-ladder.constant';
import { formatSeRatingRange } from '../../../../rating/utils/format-se-rating-range.util';
import {
    getTechniqueUsage,
    getTierTechniqueReport,
    getTierTechniqueReports
} from '../../../../rating/utils/get-tier-technique-reports.util';
import { ArticleSchema } from '../../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../../seo/components/faq/faq';
import { PageHeader } from '../../../../seo/components/page-header/page-header';
import { buildAuthorPersonSchema } from '../../../../seo/utils/build-author-person-schema.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { TechniqueSummary } from '../../../../techniques/components/technique-summary/technique-summary';
import { homePageMetadata } from '../../metadata';
import { sudokuTipsPageMetadata } from '../../sudoku-tips/metadata';
import { sudokuDifficultiesPageMetadata } from '../../sudoku/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { sudokuCluesVsDifficultyPageMetadata } from '../sudoku-clues-vs-difficulty/metadata';
import { sudokuDifficultyRatingPageMetadata } from '../sudoku-difficulty-rating/metadata';

import { techniqueFrequencyByDifficultyPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(techniqueFrequencyByDifficultyPageMetadata);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const TechniqueFrequencyByDifficultyPage = () => {
    const reports = getTierTechniqueReports();
    const observedTechniqueCount = TECHNIQUE_LADDER.filter(technique =>
        reports.some(report => getTechniqueUsage(report, technique) > 0)
    ).length;
    const newbieReport = getTierTechniqueReport(DifficultyEnum.Newbie);
    const nightmareReport = getTierTechniqueReport(DifficultyEnum.Nightmare);

    return (
        <main>
            <ArticleSchema author={buildAuthorPersonSchema()} metadata={techniqueFrequencyByDifficultyPageMetadata} />
            <PageHeader metadata={techniqueFrequencyByDifficultyPageMetadata}>
                <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
                <BreadcrumbListItem>Technique frequency by difficulty</BreadcrumbListItem>
            </PageHeader>
            <p>
                Which solving techniques does a Newbie puzzle need, and which does a Nightmare puzzle demand? This page answers with data: a
                fixed sample of {RATING_SAMPLE_TOTAL} rated puzzles, {RATING_SAMPLE_SIZE} from each of the six rated tiers, each solved
                logically by the same technique detectors that grade the boards in the game.
            </p>
            <TechniqueSummary>
                <ul>
                    <li>
                        {observedTechniqueCount} different techniques show up somewhere in the sample, from full houses to forcing chains.
                    </li>
                    <li>
                        The measured SE spread runs from {formatSeRatingRange(newbieReport)} on Newbie to{' '}
                        {formatSeRatingRange(nightmareReport)} on Nightmare.
                    </li>
                    <li>
                        Every number is committed to the repository and checked against the sample by a script, so it can be reproduced.
                    </li>
                </ul>
            </TechniqueSummary>
            <h2>How often each technique appears</h2>
            <p>
                Each cell counts the puzzles, out of {RATING_SAMPLE_SIZE} in that tier, whose logical solve used the technique at least
                once. A dash means none did. Read a row left to right to see where a technique enters the game, and a column top to bottom
                to see what a tier asks of you.
            </p>
            <TechniqueFrequencyTable>
                Puzzles out of {RATING_SAMPLE_SIZE} per tier that required each technique at least once. Every technique name links to its
                guide.
            </TechniqueFrequencyTable>
            <h2>The tiers side by side</h2>
            <TierLadderTable>
                Clues, the guaranteed technique band, the measured SE range and the hardest technique each tier needed, from the same{' '}
                {RATING_SAMPLE_TOTAL} puzzles.
            </TierLadderTable>
            <h2>How to read the data</h2>
            <p>
                A count is a presence, not a total: a puzzle that uses a naked pair five times counts once. Techniques at the top of the
                table appear almost everywhere because every solve starts with singles, while the techniques at the bottom are reserved for
                the tiers whose contract demands them. The sample is frozen in source so every figure is deterministic, and the method is
                described in the <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link>. The{' '}
                <Link href={sudokuCluesVsDifficultyPageMetadata.path}>clues versus difficulty</Link> guide shows why clue count alone does
                not predict the technique mix.
            </p>
            <h2>Using it to plan your practice</h2>
            <p>
                Learn the techniques in the order the tiers need them. Start with the habits on the{' '}
                <Link href={sudokuTipsPageMetadata.path}>sudoku tips</Link> page, pick up each new pattern from the{' '}
                <Link href={techniquesPageMetadata.path}>technique library</Link>, and move up through the{' '}
                <Link href={sudokuDifficultiesPageMetadata.path}>difficulty levels</Link> as the rows in this table stop surprising you.
            </p>
            <FaqPage>
                <FaqHeading>Technique frequency FAQ</FaqHeading>
                <Faq>
                    <FaqQuestion>How was the sample chosen?</FaqQuestion>
                    <FaqAnswer>
                        It is a fixed set of {RATING_SAMPLE_SIZE} puzzles per tier, generated with the game’s own puzzle forge and frozen in
                        the repository. Freezing it keeps every published number identical from build to build.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Why is Infinity not in the table?</FaqQuestion>
                    <FaqAnswer>
                        Infinity puzzles carry independently published ratings above what the technique ladder can finish, so they would put
                        unmeasured numbers into a table that promises measured ones.
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>Does a technique in the table mean a puzzle needs it?</FaqQuestion>
                    <FaqAnswer>
                        It means the logical solve used it. Some puzzles can be finished by more than one route, so use the table as a guide
                        to what you are likely to meet, not as a strict requirement.
                    </FaqAnswer>
                </Faq>
            </FaqPage>
        </main>
    );
};

export default TechniqueFrequencyByDifficultyPage;
