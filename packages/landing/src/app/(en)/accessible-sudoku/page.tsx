import Link from 'next/link';

import { OpenInApp } from '../../../play/components/open-in-app/open-in-app';
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { SITE_NAME } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { largePrintSudokuPageMetadata } from '../large-print-sudoku/metadata';
import { homePageMetadata } from '../metadata';
import { relaxingSudokuPageMetadata } from '../relaxing-sudoku/metadata';
import { sudokuForSeniorsPageMetadata } from '../sudoku-for-seniors/metadata';
import { sudokuKeyboardShortcutsPageMetadata } from '../sudoku-keyboard-shortcuts/metadata';

import { accessibleSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(accessibleSudokuPageMetadata);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const AccessibleSudokuPage = () => (
    <main>
        <ArticleSchema metadata={accessibleSudokuPageMetadata} />
        <PageHeader metadata={accessibleSudokuPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Accessible sudoku</BreadcrumbListItem>
        </PageHeader>
        <p>
            Accessibility in {SITE_NAME} is a set of settings you can combine, not a separate game. This page lists what the app actually
            offers, so you can tell before you install whether it fits how you play.
        </p>
        <TechniqueSummary>
            <ul>
                <li>Two themes built for readability: High contrast and Colorblind safe.</li>
                <li>Number size from Tiny to Large and three cell spacing steps.</li>
                <li>Animations that follow your device’s reduce-motion setting, or stay always on or always off.</li>
                <li>Board cells and controls carry accessibility labels for screen readers.</li>
                <li>Interface text follows the operating system’s text size, up to a cap.</li>
            </ul>
        </TechniqueSummary>
        <h2>Colorblind-safe and high-contrast themes</h2>
        <p>
            The Colorblind safe theme tells board states apart by lightness and outlines instead of hue, so a highlighted cell, a pattern
            and a mistake do not depend on telling red from green. The High contrast theme maximises the separation between board states.
            Both are in Settings under Theme, next to Classic, Gold and Newspaper. If none of them fits, the live-preview theme editor lets
            you set every cell, line and highlight yourself, with built-in contrast validation so a custom theme stays readable.
        </p>
        <h2>Digit size and cell spacing</h2>
        <p>
            Number size has four steps, Tiny, Small, Standard and Large, and Cell spacing has three, Tight, Comfortable and Spacious. The
            Spacious setting adds wider gaps for easier tapping. Both are in Settings under Game.
        </p>
        <h2>Motion and feedback</h2>
        <p>
            The Animations setting can follow your device, stay always on or be always off, in which case changes appear instantly. The
            timer and vibration each have their own switch, and Calm play hides the score. See{' '}
            <Link href={relaxingSudokuPageMetadata.path}>relaxing sudoku</Link> for those options in context.
        </p>
        <h2>Screen readers</h2>
        <p>
            Every board cell is exposed as a button with a label that says whether it is empty, what it holds, and whether it is marked
            wrong. The number pad digits, the notes toggle, undo, redo, hint and auto-candidates controls are labelled too, and hint text is
            announced as it changes. On the web the board is a labelled grid you can move through with the keyboard; the{' '}
            <Link href={sudokuKeyboardShortcutsPageMetadata.path}>keyboard shortcuts</Link> page lists the keys.
        </p>
        <h2>OS text scaling</h2>
        <p>
            Text in the app respects the text size you set in iOS or Android, with a cap so that layouts stay usable, at most twice the
            normal size for body text and less for tight elements such as the tab bar. This is separate from the Number size setting, which
            only changes the digits on the board.
        </p>
        <h2>On this website</h2>
        <p>
            The header of every page here has a text-size control, A, A+ and A++, that scales the whole page including boards and remembers
            your choice. For paper, the <Link href={largePrintSudokuPageMetadata.path}>large-print booklet</Link> uses bigger grids, and the{' '}
            <Link href={sudokuForSeniorsPageMetadata.path}>sudoku for seniors</Link> page collects the comfort settings in one place.
        </p>
        <OpenInApp />
        <FaqPage>
            <FaqHeading>Accessible sudoku FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is there a colorblind-friendly sudoku theme?</FaqQuestion>
                <FaqAnswer>
                    Yes. Colorblind safe is one of the built-in themes. It separates board states by lightness and outlines rather than hue.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does the app work with a screen reader?</FaqQuestion>
                <FaqAnswer>
                    Cells and controls have accessibility labels and hint text is announced. Please report anything that reads poorly on the
                    project’s issue tracker so it can be fixed.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I make the digits bigger?</FaqQuestion>
                <FaqAnswer>
                    Yes. Number size goes up to Large, and you can add Spacious cell spacing. The operating system’s text size setting is
                    honored for the rest of the interface.
                </FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default AccessibleSudokuPage;
