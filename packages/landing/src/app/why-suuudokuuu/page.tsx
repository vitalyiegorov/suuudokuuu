import Link from 'next/link';

import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Faq } from '../../seo/components/faq/faq';
import { FaqAnswer } from '../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../seo/components/faq-question/faq-question';
import { PageHeader } from '../../seo/components/page-header/page-header';
import { SITE_GITHUB_URL, SITE_NAME, SITE_PLAY_URL } from '../../seo/constants/site.constant';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { homePageMetadata } from '../metadata';
import { solverPageMetadata } from '../solver/metadata';
import { hellSudokuPageMetadata } from '../sudoku/hell/metadata';
import { sudokuForSeniorsPageMetadata } from '../sudoku-for-seniors/metadata';
import { techniquesPageMetadata } from '../techniques/metadata';

import { whySuuudokuuuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(whySuuudokuuuPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const WhySuuudokuuuPage = () => (
    <main>
        <PageHeader metadata={whySuuudokuuuPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Why {SITE_NAME}</BreadcrumbListItem>
        </PageHeader>
        <p>
            {SITE_NAME} is a free sudoku app and website with no ads and no account, and the game itself carries no tracking of any kind.
            The full source — the puzzle generator, the solvers, the technique detector and the app itself — is published on{' '}
            <a href={SITE_GITHUB_URL}>GitHub under the MIT license</a>. That combination is unusual: most sudoku apps run ads, most closed
            source apps ask you to trust their claims about privacy, and few publish the code that generates and checks the puzzles you are
            actually solving. This page lays out exactly what {SITE_NAME} does, with links to the parts of the codebase that back each
            claim, so none of it has to be taken on faith.
        </p>
        <h2>What free and open source actually means here</h2>
        <p>
            Free means every difficulty level, every hint and every technique guide is available with no paywall, no subscription and no
            in-app purchase. Open source means the repository is public, the license is MIT — one of the most permissive licenses that
            exists, letting anyone read, fork, modify or redeploy the code — and every commit that ever shipped a feature is visible in the
            same public history. Nothing about generation, solving or scoring happens on a server you cannot inspect; the logic lives in
            plain TypeScript packages anyone can read end to end.
        </p>
        <h2>No ads, no account, no tracking in the game</h2>
        <p>
            The game ships with no advertising SDK, no analytics SDK and no crash-reporting SDK — nothing in the app’s dependency list sends
            your play activity anywhere. This website uses cookieless, anonymous page analytics to see which guides help people, with no
            cookies, no cross-site profiles and no ad networks; the game never does. Playing does not require creating an account, entering
            an email address or signing in with a third party. Progress, streaks and settings are stored on your own device, not in an
            account database, because there is no account database. If you want to verify this instead of trusting a marketing sentence, the
            dependency manifests are public, and you can grep them for yourself.
        </p>
        <h2>How this differs from most sudoku apps</h2>
        <p>
            The typical free sudoku app is free to download and monetized afterward: banner ads between puzzles, interstitial ads on
            mistakes, rewarded-video ads for hints, or analytics SDKs that report how you play back to an ad network. None of that is
            inherently dishonest — it pays for development — but it means the app’s incentives are not purely about helping you solve
            puzzles well. {SITE_NAME} has no advertising business model to serve, so there is no interstitial timed around a wrong guess and
            no hint gated behind a video. The app either helps you learn to solve sudoku, or it does not; there is no third incentive
            pulling in a different direction.
        </p>
        <h2>Puzzles that are actually verified, not just generated</h2>
        <p>
            Every puzzle {SITE_NAME} generates is checked for exactly one solution before it is served, using a solver-backed uniqueness
            check in the generator itself — no puzzle ever requires a guess to finish. The hardest tier goes further: Hell-difficulty
            puzzles come from a bundled, pre-verified 17-clue corpus, and 17 is the proven minimum number of clues a sudoku can have and
            still keep a unique solution. Those puzzles are additionally cross-checked by two independent solving algorithms — a Dancing
            Links exact-cover solver and a typed-array bitmask solver — so one algorithm’s bug cannot silently ship a broken puzzle. All
            three solvers, <code>solver-dlx</code>, <code>solver-bitmask</code> and the shared <code>solver-core</code> contract they both
            implement, are separate open packages in the repository, not a black box.
        </p>
        <h2>Hints that teach, not just answer</h2>
        <p>
            Stuck on a cell, most apps just fill it in. {SITE_NAME}’s hint button runs the same technique detector that powers the{' '}
            <Link href={techniquesPageMetadata.path}>technique guides</Link> on this site, so it names the exact pattern that justifies the
            next move — a hidden pair, a pointing triple, an X-Wing — and walks through why it applies, instead of silently revealing a
            digit. If you would rather work through a puzzle you already have on paper or from another source, the{' '}
            <Link href={solverPageMetadata.path}>step-by-step solver</Link> does the same thing: type in a grid and it narrates every move
            by name, in your browser, with nothing sent to a server.
        </p>
        <h2>A transparent alternative</h2>
        <p>
            If you are comparing sudoku.com, other ad-supported sudoku sites, or a closed-source mobile app against {SITE_NAME}, the
            practical difference is verifiability. You do not have to trust a privacy policy’s wording, because there is no hidden layer for
            it to describe — the code that generates your puzzle, checks it has one solution and decides what a hint tells you is public,
            readable and forkable on GitHub. That is the whole pitch: not a longer feature list, just fewer things you have to take on
            trust. It is also built to be comfortable, not just honest — see the{' '}
            <Link href={sudokuForSeniorsPageMetadata.path}>sudoku for seniors</Link> guide for the large-print and comfort-mode options that
            come with the same free, ad-free package.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play {SITE_NAME} now
        </a>
        <FaqPage>
            <FaqHeading>Why {SITE_NAME} FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is {SITE_NAME} really free, with no hidden costs?</FaqQuestion>
                <FaqAnswer>
                    Yes. There are no subscriptions, no in-app purchases and no difficulty level locked behind a paywall. Every tier from
                    Newbie to <Link href={hellSudokuPageMetadata.path}>Hell</Link> is free to play.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is the source code actually public?</FaqQuestion>
                <FaqAnswer>
                    Yes, the full monorepo is public on <a href={SITE_GITHUB_URL}>GitHub</a> under the MIT license, including the puzzle
                    generator, both solvers, the technique detector, the app and this website.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does {SITE_NAME} track me or show ads?</FaqQuestion>
                <FaqAnswer>
                    No. There is no advertising SDK and no analytics SDK in the dependency list, on the web or in the mobile apps, and no
                    account is required to play.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does it work offline?</FaqQuestion>
                <FaqAnswer>
                    Yes. Once installed, {SITE_NAME} generates and verifies puzzles entirely on your device, so it plays the same with no
                    connection.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is {SITE_NAME} a good sudoku.com alternative?</FaqQuestion>
                <FaqAnswer>
                    If what you want is ad-free, trackable-free, open-source sudoku with technique-explaining hints instead of a plain
                    answer button, {SITE_NAME} is built specifically for that. It is not a clone of any other site — it is a from-scratch,
                    open-source engine with its own generator, solvers and technique library.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default WhySuuudokuuuPage;
