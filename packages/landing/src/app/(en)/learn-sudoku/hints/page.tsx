import Link from 'next/link';

import { HintDemo } from '../../../../learn/components/hint-demo/hint-demo';
import { ArticleSchema } from '../../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../../seo/components/faq/faq';
import { PageHeader } from '../../../../seo/components/page-header/page-header';
import { SITE_NAME, SITE_PLAY_URL } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { TechniqueSummary } from '../../../../techniques/components/technique-summary/technique-summary';
import { homePageMetadata } from '../../metadata';
import { solverPageMetadata } from '../../solver/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { learnSudokuPageMetadata } from '../metadata';
import { sudokuReplayPageMetadata } from '../replay/metadata';

import { sudokuHintsDemoPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(sudokuHintsDemoPageMetadata);

const SudokuHintsDemoPage = () => (
    <main>
        <ArticleSchema metadata={sudokuHintsDemoPageMetadata} />
        <PageHeader metadata={sudokuHintsDemoPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={learnSudokuPageMetadata.path}>Learn sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Sudoku hints explained</BreadcrumbListItem>
        </PageHeader>
        <p>
            A good hint teaches the move instead of handing it over. The board below runs the same hint stepper as the {SITE_NAME} app, on a
            real puzzle in your browser: ask for a hint, then step through it one level at a time.
        </p>
        <TechniqueSummary>
            <ul>
                <li>Level one names the technique and the row, column or box to look in.</li>
                <li>Level two highlights the pattern cells on the board.</li>
                <li>Level three walks through the reasoning step by step, ending on the digit to place.</li>
            </ul>
        </TechniqueSummary>
        <h2>Try the hint stepper</h2>
        <HintDemo>
            Press the button to turn this board into a live one, then ask for a hint. Placements you make yourself work too.
        </HintDemo>
        <h2>How the hint levels work</h2>
        <p>
            Each hint starts as light as possible. In the app a hint has up to four levels: the technique and region, the pattern cells, the
            full walkthrough, and placing the digit. Each level is charged against your score only when you reveal it, so you pay for
            exactly as much help as you used, and a nudge costs less than the whole answer. This demo keeps the first three levels and lets
            you apply the result to the board.
        </p>
        <h2>Why the hints name techniques</h2>
        <p>
            The hint comes from the same detector that powers the <Link href={techniquesPageMetadata.path}>technique guides</Link>, so the
            name it gives is one you can look up and practice. Over time you stop needing the second and third level, because you recognise
            the pattern from the first. For a puzzle that is not from the game, the{' '}
            <Link href={solverPageMetadata.path}>step-by-step solver</Link> narrates every move the same way.
        </p>
        <h2>After the hint</h2>
        <p>
            Once a puzzle is finished you can replay it and see which moves came from hints. See{' '}
            <Link href={sudokuReplayPageMetadata.path}>review your solve</Link>.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play {SITE_NAME} now
        </a>
        <FaqPage>
            <FaqHeading>Sudoku hints FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Does a hint just fill in the answer?</FaqQuestion>
                <FaqAnswer>
                    No. It starts with the technique and region, then the pattern, then a walkthrough. You decide how many levels to open.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does asking for a hint cost points?</FaqQuestion>
                <FaqAnswer>
                    Yes. In the app each hint level is charged when you reveal it, and closing a hint keeps only the levels you saw.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Are hints available on the hardest puzzles?</FaqQuestion>
                <FaqAnswer>
                    Yes. A setting called hints on the hardest puzzles offers them on Nightmare, Hell and Infinity as well, and it is on by
                    default.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default SudokuHintsDemoPage;
