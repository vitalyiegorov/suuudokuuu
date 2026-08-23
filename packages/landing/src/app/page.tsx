import Link from 'next/link';

import { Faq } from '../seo/components/faq/faq';
import { FaqAnswer } from '../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../seo/components/faq-question/faq-question';
import { JsonLd } from '../seo/components/json-ld/json-ld';
import { SoftwareApplicationFeature } from '../seo/components/software-application-feature/software-application-feature';
import { SoftwareApplicationSchema } from '../seo/components/software-application-schema/software-application-schema';
import { SCHEMA_CONTEXT } from '../seo/constants/schema.constant';
import { DEFAULT_LOCALE, SITE_DESCRIPTION, SITE_NAME, SITE_PLAY_URL } from '../seo/constants/site.constant';
import { buildLocaleUrl } from '../seo/utils/build-locale-url.util';
import { buildPageMetadata } from '../seo/utils/build-page-metadata.util';

import { glossaryPageMetadata } from './glossary/metadata';
import { hardestSudokuPuzzlesPageMetadata } from './hardest-sudoku-puzzles/metadata';
import { howToPlayPageMetadata } from './how-to-play/metadata';
import { homePageMetadata } from './metadata';
import { solverPageMetadata } from './solver/metadata';
import { sudokuDifficultiesPageMetadata } from './sudoku/metadata';
import { fullHousePageMetadata } from './techniques/full-house/metadata';
import { hiddenSinglePageMetadata } from './techniques/hidden-single/metadata';
import { techniquesPageMetadata } from './techniques/metadata';
import { nakedSinglePageMetadata } from './techniques/naked-single/metadata';
import { whySuuudokuuuPageMetadata } from './why-suuudokuuu/metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(homePageMetadata);

const webSiteSchema = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: buildLocaleUrl(DEFAULT_LOCALE, homePageMetadata.path),
    inLanguage: DEFAULT_LOCALE,
    datePublished: homePageMetadata.publishedAt,
    dateModified: homePageMetadata.updatedAt
};

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const HomePage = () => (
    <main>
        <JsonLd data={webSiteSchema} />
        <p className="hero__eyebrow">Free, open-source, no ads</p>
        <h1>Play Free Online Sudoku</h1>
        <p>
            Free online sudoku means playing the classic 9×9 number puzzle in a browser or app with no purchase, install limit or paywall,
            and {SITE_NAME} is a free, open-source implementation of it — six difficulty levels from Newbie to Hell, technique-explaining
            guides, no ads and no tracking. Solve on the web or install the app, then keep the same streaks and stats everywhere. See{' '}
            <Link href={whySuuudokuuuPageMetadata.path}>why {SITE_NAME} is built this way</Link> for the full, verifiable case.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play now
        </a>
        <h2>Why players stay</h2>
        <SoftwareApplicationSchema description={SITE_DESCRIPTION} name={SITE_NAME} path={homePageMetadata.path}>
            <SoftwareApplicationFeature>
                Six difficulty levels from Newbie through Hell, including a bundled 17-clue Hell corpus
            </SoftwareApplicationFeature>
            <SoftwareApplicationFeature>
                Technique-aware hints that name the exact solving pattern, not just the next digit
            </SoftwareApplicationFeature>
            <SoftwareApplicationFeature>
                Every puzzle guaranteed to have exactly one solution, no guessing required
            </SoftwareApplicationFeature>
            <SoftwareApplicationFeature>No ads, no account and no tracking, on the web or in the app</SoftwareApplicationFeature>
            <SoftwareApplicationFeature>Works fully offline once installed, on iOS, Android and the web</SoftwareApplicationFeature>
            <SoftwareApplicationFeature>Shareable puzzle links and full game replays for any solve</SoftwareApplicationFeature>
        </SoftwareApplicationSchema>
        <h2>Learn to solve</h2>
        <p>
            Every technique {SITE_NAME} uses to generate hints is documented with a worked example board pulled straight from the solving
            engine. Start with the <Link href={techniquesPageMetadata.path}>full technique index</Link>, or jump into one of the first
            patterns most players learn.
        </p>
        <ul className="link-list">
            <li>
                <Link href={fullHousePageMetadata.path}>Full House</Link> — the simplest possible move, filling the last empty cell in a
                unit.
            </li>
            <li>
                <Link href={nakedSinglePageMetadata.path}>Naked Single</Link> — a cell left with exactly one candidate.
            </li>
            <li>
                <Link href={hiddenSinglePageMetadata.path}>Hidden Single</Link> — a digit that only fits in one cell of a unit.
            </li>
        </ul>
        <h2>Stuck on a puzzle?</h2>
        <p>
            Type or paste the grid into the <Link href={solverPageMetadata.path}>step-by-step sudoku solver</Link> and it will name every
            move — Hidden Single, Naked Pair, X-Wing — instead of just filling the board in. It checks that your puzzle has exactly one
            solution first, and it runs entirely in your browser.
        </p>
        <h2>New to Sudoku?</h2>
        <p>
            Read the <Link href={howToPlayPageMetadata.path}>how to play guide</Link> for the three rules and a walkthrough of your first
            moves, or look up any term in the <Link href={glossaryPageMetadata.path}>sudoku glossary</Link>, which defines every technique
            and every piece of vocabulary the guides use.
        </p>
        <h2>Difficulty guides</h2>
        <p>
            Every tier from Newbie to Hell now has its own guide, breaking down exactly what separates one level from the next — clue
            counts, required techniques and an honest read on how hard each one really is. Start on the{' '}
            <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link> hub, or see how it compares to the{' '}
            <Link href={hardestSudokuPuzzlesPageMetadata.path}>hardest puzzles</Link> ever published.
        </p>
        <h2>Frequently asked questions</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Is {SITE_NAME} free?</FaqQuestion>
                <FaqAnswer>
                    Yes. {SITE_NAME} is free and open source, with no in-app purchases, subscriptions or paywalled difficulty levels.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does {SITE_NAME} have ads?</FaqQuestion>
                <FaqAnswer>No. There are no ads and no third-party tracking, on the web or in the mobile apps.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does it work offline?</FaqQuestion>
                <FaqAnswer>
                    Yes. Once installed, {SITE_NAME} generates and solves puzzles entirely on your device, so it plays the same with no
                    connection.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What difficulty levels exist?</FaqQuestion>
                <FaqAnswer>
                    Six: Newbie, Easy, Medium, Hard, Nightmare and Hell. Hell puzzles come from a bundled, verified 17-clue corpus, the
                    minimum number of clues a Sudoku can have.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default HomePage;
