import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { getDifficultyClueCount } from '../../difficulty/utils/get-difficulty-clue-count.util';
import { PRINTABLE_LARGE_PRINT_PUZZLES_PER_PAGE } from '../../printable/constants/printable-layout.constant';
import { ArticleSchema } from '../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../seo/components/breadcrumbs/breadcrumbs';
import { Faq } from '../../seo/components/faq/faq';
import { FaqAnswer } from '../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../seo/components/faq-question/faq-question';
import { SITE_NAME, SITE_PLAY_URL } from '../../seo/constants/site.constant';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { TechniqueSummary } from '../../techniques/components/technique-summary/technique-summary';
import { howToPlayPageMetadata } from '../how-to-play/metadata';
import { largePrintSudokuPageMetadata } from '../large-print-sudoku/metadata';
import { homePageMetadata } from '../metadata';
import { printableSudokuPageMetadata } from '../printable/metadata';
import { easySudokuPageMetadata } from '../sudoku/easy/metadata';
import { newbieSudokuPageMetadata } from '../sudoku/newbie/metadata';
import { whySuuudokuuuPageMetadata } from '../why-suuudokuuu/metadata';

import { sudokuForSeniorsPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(sudokuForSeniorsPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const SudokuForSeniorsPage = () => (
    <main>
        <ArticleSchema
            dateModified={sudokuForSeniorsPageMetadata.updatedAt}
            datePublished={sudokuForSeniorsPageMetadata.publishedAt}
            description={sudokuForSeniorsPageMetadata.metaDescription}
            headline={sudokuForSeniorsPageMetadata.title}
            path={sudokuForSeniorsPageMetadata.path}
        />
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Sudoku for seniors</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Sudoku for Seniors</h1>
        <p>
            Sudoku for seniors on {SITE_NAME} is the same puzzle everyone else plays, with the visual and motor friction removed: bigger
            digits, calmer colors, no forced timer, and a one-tap preset called Comfort mode that turns all of it on at once. Nothing here
            is a separate, simplified game — every puzzle, hint and technique guide on the site is the one everyone uses. What changes is
            how comfortable it is to read the board and tap the right cell.
        </p>
        <TechniqueSummary>
            <ul>
                <li>
                    Comfort mode is one tap in Settings: extra-large digits, roomy cells with guaranteed touch targets, a high-contrast
                    board, no timer, calmer motion and score-free play — every piece stays adjustable on its own.
                </li>
                <li>
                    Newbie ({getDifficultyClueCount(DifficultyEnum.Newbie)} clues) and Easy ({getDifficultyClueCount(DifficultyEnum.Easy)}{' '}
                    clues) are the two gentlest tiers, solvable with the simplest deductions in the game.
                </li>
                <li>
                    A free <Link href={largePrintSudokuPageMetadata.path}>large-print PDF booklet</Link> prints{' '}
                    {PRINTABLE_LARGE_PRINT_PUZZLES_PER_PAGE} puzzles per page instead of four, with solutions included.
                </li>
                <li>The site’s own text-size control in the header enlarges every page, boards included, and remembers your choice.</li>
                <li>No ads, no account and no paywall on any of it.</li>
            </ul>
        </TechniqueSummary>
        <h2>Sudoku as part of a daily routine</h2>
        <p>
            People come back to sudoku for the same reasons they come back to a crossword or a daily walk: it is a fixed, satisfying block
            of focus that fits into a morning coffee or a wind-down before bed. We are not going to tell you it sharpens your mind or
            protects against decline — that is a claim we cannot back with real evidence, so we will not make it. What we can offer is a
            puzzle that asks for your attention in short, clear steps, with no clock forcing you to rush and no permanent record of a bad
            day, so a slow evening is exactly as good as a fast one.
        </p>
        <h2>Starting with no jargon</h2>
        <p>
            If the rules are rusty or new, start with the plain-language <Link href={howToPlayPageMetadata.path}>how to play guide</Link>,
            then pick a gentle tier. <Link href={newbieSudokuPageMetadata.path}>Newbie</Link> starts with{' '}
            {getDifficultyClueCount(DifficultyEnum.Newbie)} of the 81 cells already filled and never asks for anything beyond the two
            simplest deductions in the game. <Link href={easySudokuPageMetadata.path}>Easy</Link> carries{' '}
            {getDifficultyClueCount(DifficultyEnum.Easy)} clues and adds exactly one more idea on top. Neither tier ever requires writing
            candidates in the margin, and both are exactly as free as every other level.
        </p>
        <h2>What Comfort mode does</h2>
        <p>
            Comfort mode, found in the app’s Settings, is a single switch that bundles the settings people with less-sharp eyesight or a
            less steady hand tend to want: the largest available digit size, spacious cells with a guaranteed 44-point touch target so a
            near-miss tap still lands, a high-contrast theme, the timer turned off, calm play that hides the score so nothing feels timed or
            graded, and reduced motion for a calmer board. Turning the preset on does not lock anything in — every one of those pieces can
            still be adjusted individually afterward, and the app keeps honoring your own choices instead of fighting them.
        </p>
        <h2>Large print on paper</h2>
        <p>
            Prefer paper? The <Link href={largePrintSudokuPageMetadata.path}>large-print sudoku page</Link> has a free PDF booklet with
            noticeably bigger grids and digits than the standard printable set, plus every difficulty tier’s own booklet on the{' '}
            <Link href={printableSudokuPageMetadata.path}>printable sudoku hub</Link> for working up through the levels. Every PDF ships
            with solutions and needs nothing but a printer.
        </p>
        <h2>Reading comfortably on this site</h2>
        <p>
            You do not need the app to get a bigger view. The text-size control in the header of this very page — the small A / A+ / A++
            buttons — scales every page on {SITE_NAME}, boards included, and remembers your pick on your next visit. No account, no settings
            menu to hunt through.
        </p>
        <h2>Free, no ads, no account</h2>
        <p>
            Every tier, every hint and every comfort setting described here is free with no sign-up, no subscription and no advertising —
            see exactly what that means and how to verify it on the <Link href={whySuuudokuuuPageMetadata.path}>why {SITE_NAME}</Link> page.
        </p>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Play {SITE_NAME} now
        </a>
        <h2>Sudoku for Seniors FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Is there a large print version?</FaqQuestion>
                <FaqAnswer>
                    Yes. The <Link href={largePrintSudokuPageMetadata.path}>large-print sudoku page</Link> has a free PDF with bigger grids
                    and digits, and Comfort mode gives the on-screen board its own extra-large digit size.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do I need an account?</FaqQuestion>
                <FaqAnswer>
                    No. {SITE_NAME} has no account system at all — progress and settings are stored on your own device, and every difficulty
                    and every comfort setting is available without signing in.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I turn off the timer?</FaqQuestion>
                <FaqAnswer>
                    Yes. The timer has its own on/off setting, and Comfort mode turns it off automatically along with the score display, so
                    a puzzle is never framed as something to beat the clock on.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does it cost anything?</FaqQuestion>
                <FaqAnswer>
                    No. Every difficulty from Newbie to Hell, every hint and every comfort setting is free, with no in-app purchase and no
                    ads.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default SudokuForSeniorsPage;
