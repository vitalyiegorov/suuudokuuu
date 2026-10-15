import { Trans } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { glossaryPageMetadata } from '../../../app/(en)/glossary/metadata';
import { hardestSudokuPuzzlesPageMetadata } from '../../../app/(en)/hardest-sudoku-puzzles/metadata';
import { howToPlayPageMetadata } from '../../../app/(en)/how-to-play/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { solverPageMetadata } from '../../../app/(en)/solver/metadata';
import { infinitySudokuPageMetadata } from '../../../app/(en)/sudoku/infinity/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/(en)/sudoku/metadata';
import { fullHousePageMetadata } from '../../../app/(en)/techniques/full-house/metadata';
import { hiddenSinglePageMetadata } from '../../../app/(en)/techniques/hidden-single/metadata';
import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
import { nakedSinglePageMetadata } from '../../../app/(en)/techniques/naked-single/metadata';
import { whySuuudokuuuPageMetadata } from '../../../app/(en)/why-suuudokuuu/metadata';
import { StoreBadges } from '../../../chrome/components/store-badges/store-badges';
import { StoreBadgeCampaignEnum } from '../../../chrome/enums/store-badge-campaign.enum';
import { DifficultyBoard } from '../../../difficulty/components/difficulty-board/difficulty-board';
import { activateLocale } from '../../../i18n/utils/activate-locale.util';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { SoftwareApplicationFeature } from '../../../seo/components/software-application-feature/software-application-feature';
import { SoftwareApplicationSchema } from '../../../seo/components/software-application-schema/software-application-schema';
import { WebSiteSchema } from '../../../seo/components/web-site-schema/web-site-schema';
import { SITE_NAME, SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { buildLocalizedPagePath } from '../../../seo/utils/build-localized-page-path.util';
import { localizePageMetadata } from '../../../seo/utils/localize-page-metadata.util';
import { resolvePageHeadline } from '../../../seo/utils/resolve-page-headline.util';

import type { LocaleType } from '../../../seo/types/locale.type';

interface Props {
    locale: LocaleType;
}

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
export const HomePage = ({ locale }: Props) => {
    activateLocale(locale);
    const pageMetadata = localizePageMetadata(homePageMetadata, locale);

    return (
        <main>
            <WebSiteSchema locale={locale} metadata={pageMetadata} />
            <p className="hero__eyebrow">
                <Trans>Free, open-source, no ads</Trans>
            </p>
            <h1>{resolvePageHeadline(pageMetadata)}</h1>
            <DifficultyBoard difficulty={DifficultyEnum.Easy}>
                <Trans>An Easy board to start with. Play it right here, or pick any of seven difficulty levels in the app.</Trans>
            </DifficultyBoard>
            <p>
                <Trans>
                    Free online sudoku means playing the classic 9×9 number puzzle in a browser or app with no purchase, install limit or
                    paywall, and {SITE_NAME} is a free, open-source implementation of it — seven difficulty levels from Newbie to Infinity,
                    technique-explaining guides, no ads and no tracking in the game. Solve in the browser or install the app; your progress,
                    streaks and stats stay on the device you play on. See{' '}
                    <Link href={buildLocalizedPagePath(whySuuudokuuuPageMetadata)}>why {SITE_NAME} is built this way</Link> for the full,
                    verifiable case.
                </Trans>
            </p>
            <a className="hero__cta" href={SITE_PLAY_URL}>
                <Trans>Play now</Trans>
            </a>
            <StoreBadges campaign={StoreBadgeCampaignEnum.HOME} />
            <h2>
                <Trans>Why players stay</Trans>
            </h2>
            <SoftwareApplicationSchema description={pageMetadata.metaDescription} locale={locale} name={SITE_NAME} path={pageMetadata.path}>
                <SoftwareApplicationFeature>
                    <Trans>
                        Seven difficulty levels from Newbie through Hell to Infinity, the top tier serving record puzzles such as Everest
                        and AI Escargot
                    </Trans>
                </SoftwareApplicationFeature>
                <SoftwareApplicationFeature>
                    <Trans>Technique-aware hints that name the exact solving pattern, not just the next digit</Trans>
                </SoftwareApplicationFeature>
                <SoftwareApplicationFeature>
                    <Trans>Every puzzle guaranteed to have exactly one solution, no guessing required</Trans>
                </SoftwareApplicationFeature>
                <SoftwareApplicationFeature>
                    <Trans>No ads, no account and no tracking inside the game, on the web or in the app</Trans>
                </SoftwareApplicationFeature>
                <SoftwareApplicationFeature>
                    <Trans>Works fully offline once installed on iOS or Android</Trans>
                </SoftwareApplicationFeature>
                <SoftwareApplicationFeature>
                    <Trans>Shareable puzzle links and full game replays for any solve</Trans>
                </SoftwareApplicationFeature>
            </SoftwareApplicationSchema>
            <h2>
                <Trans>Learn to solve</Trans>
            </h2>
            <p>
                <Trans>
                    Every technique {SITE_NAME} uses to generate hints is documented with a worked example board pulled straight from the
                    solving engine. Start with the <Link href={buildLocalizedPagePath(techniquesPageMetadata)}>full technique index</Link>,
                    or jump into one of the first patterns most players learn.
                </Trans>
            </p>
            <ul className="link-list">
                <li>
                    <Trans>
                        <Link href={buildLocalizedPagePath(fullHousePageMetadata)}>Full House</Link> — the simplest possible move, filling
                        the last empty cell in a unit.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <Link href={buildLocalizedPagePath(nakedSinglePageMetadata)}>Naked Single</Link> — a cell left with exactly one
                        candidate.
                    </Trans>
                </li>
                <li>
                    <Trans>
                        <Link href={buildLocalizedPagePath(hiddenSinglePageMetadata)}>Hidden Single</Link> — a digit that only fits in one
                        cell of a unit.
                    </Trans>
                </li>
            </ul>
            <h2>
                <Trans>Stuck on a puzzle?</Trans>
            </h2>
            <p>
                <Trans>
                    Type or paste the grid into the{' '}
                    <Link href={buildLocalizedPagePath(solverPageMetadata)}>step-by-step sudoku solver</Link> and it will name every move —
                    Hidden Single, Naked Pair, X-Wing — instead of just filling the board in. It checks that your puzzle has exactly one
                    solution first, and it runs entirely in your browser.
                </Trans>
            </p>
            <h2>
                <Trans>New to Sudoku?</Trans>
            </h2>
            <p>
                <Trans>
                    Read the <Link href={buildLocalizedPagePath(howToPlayPageMetadata)}>how to play guide</Link> for the three rules and a
                    walkthrough of your first moves, or look up any term in the{' '}
                    <Link href={buildLocalizedPagePath(glossaryPageMetadata)}>sudoku glossary</Link>, which defines every technique and
                    every piece of vocabulary the guides use.
                </Trans>
            </p>
            <h2>
                <Trans>Difficulty guides</Trans>
            </h2>
            <p>
                <Trans>
                    Every tier from Newbie to Infinity now has its own guide, breaking down exactly what separates one level from the next —
                    clue counts, required techniques and an honest read on how hard each one really is. Start on the{' '}
                    <Link href={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>Sudoku difficulty levels</Link> hub, or see how it
                    compares to the <Link href={buildLocalizedPagePath(hardestSudokuPuzzlesPageMetadata)}>hardest puzzles</Link> ever
                    published.
                </Trans>
            </p>
            <FaqPage>
                <FaqHeading>
                    <Trans>Frequently asked questions</Trans>
                </FaqHeading>
                <Faq>
                    <FaqQuestion>
                        <Trans>Is {SITE_NAME} free?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Yes. {SITE_NAME} is free and open source, with no in-app purchases, subscriptions or paywalled difficulty
                            levels.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Does {SITE_NAME} have ads?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            No. There are no ads anywhere and no tracking inside the game; this website uses only cookieless, anonymous page
                            analytics.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>Does it work offline?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Yes, in the iOS and Android apps. Once installed, {SITE_NAME} generates and solves puzzles entirely on your
                            device, so it plays the same with no connection.
                        </Trans>
                    </FaqAnswer>
                </Faq>
                <Faq>
                    <FaqQuestion>
                        <Trans>What difficulty levels exist?</Trans>
                    </FaqQuestion>
                    <FaqAnswer>
                        <Trans>
                            Seven: Newbie, Easy, Medium, Hard, Nightmare, Hell and Infinity. Hell puzzles come from a bundled, verified
                            corpus of boards that each need a forcing chain, beyond anything Nightmare asks for, and{' '}
                            <Link href={buildLocalizedPagePath(infinitySudokuPageMetadata)}>Infinity</Link> serves record puzzles such as
                            Everest and AI Escargot.
                        </Trans>
                    </FaqAnswer>
                </Faq>
            </FaqPage>
        </main>
    );
};
