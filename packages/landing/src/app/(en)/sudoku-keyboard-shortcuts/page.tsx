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
import { accessibleSudokuPageMetadata } from '../accessible-sudoku/metadata';
import { homePageMetadata } from '../metadata';
import { sudokuTipsPageMetadata } from '../sudoku-tips/metadata';
import { techniquesPageMetadata } from '../techniques/metadata';

import { sudokuKeyboardShortcutsPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(sudokuKeyboardShortcutsPageMetadata);

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const SudokuKeyboardShortcutsPage = () => (
    <main>
        <ArticleSchema metadata={sudokuKeyboardShortcutsPageMetadata} />
        <PageHeader metadata={sudokuKeyboardShortcutsPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Sudoku keyboard shortcuts</BreadcrumbListItem>
        </PageHeader>
        <p>
            {SITE_NAME} can be played entirely from the keyboard. The tables below list every shortcut as shipped: the full set in the web
            version, and the smaller set the iPhone and iPad app recognises from a hardware keyboard.
        </p>
        <TechniqueSummary>
            <ul>
                <li>
                    Arrow keys move the selection, <span className="key-cap">1</span> to <span className="key-cap">9</span> enter a digit.
                </li>
                <li>
                    <span className="key-cap">Space</span> or <span className="key-cap">N</span> switches between digits and notes on the
                    web; <span className="key-cap">Shift</span> + digit writes one note without switching.
                </li>
                <li>
                    <span className="key-cap">Ctrl</span> or <span className="key-cap">⌘</span> + <span className="key-cap">Z</span> undoes,
                    adding <span className="key-cap">Shift</span> redoes.
                </li>
            </ul>
        </TechniqueSummary>
        <h2>Web shortcuts</h2>
        <div className="data-table__scroll">
            <table className="data-table">
                <caption className="data-table__caption">Shortcuts in the web version of the game screen.</caption>
                <thead>
                    <tr>
                        <th scope="col">Key</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">
                            <span className="key-cap">↑</span> <span className="key-cap">↓</span> <span className="key-cap">←</span>{' '}
                            <span className="key-cap">→</span>
                        </th>
                        <td>Move the selected cell; the selection stops at the edge of the board</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <span className="key-cap">1</span> to <span className="key-cap">9</span> (also the numeric keypad)
                        </th>
                        <td>Enter the digit in the selected cell, or toggle it as a note when notes mode is on</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <span className="key-cap">Shift</span> + <span className="key-cap">1</span> to{' '}
                            <span className="key-cap">9</span>
                        </th>
                        <td>Toggle that digit as a note in the selected empty cell without changing input mode</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <span className="key-cap">Space</span> or <span className="key-cap">N</span>
                        </th>
                        <td>Switch between digit mode and notes mode (needs a selected cell)</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <span className="key-cap">A</span>
                        </th>
                        <td>Show or hide all candidates (not available in Hardcore, where the button is hidden)</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <span className="key-cap">Ctrl</span> / <span className="key-cap">⌘</span> + <span className="key-cap">Z</span>
                        </th>
                        <td>Undo the last move (not available in challenge runs)</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <span className="key-cap">Ctrl</span> / <span className="key-cap">⌘</span> +{' '}
                            <span className="key-cap">Shift</span> + <span className="key-cap">Z</span>
                        </th>
                        <td>Redo (not available in challenge runs)</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <span className="key-cap">Esc</span>
                        </th>
                        <td>
                            Ask to stop the current run (confirming discards its progress); while a hint is open, close the hint instead
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <h2>iPhone and iPad with a hardware keyboard</h2>
        <p>On an iPad, or an iPhone with a keyboard attached, the game screen listens for a shorter set of keys.</p>
        <div className="data-table__scroll">
            <table className="data-table">
                <caption className="data-table__caption">Shortcuts in the iPhone and iPad app.</caption>
                <thead>
                    <tr>
                        <th scope="col">Key</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">
                            <span className="key-cap">↑</span> <span className="key-cap">↓</span> <span className="key-cap">←</span>{' '}
                            <span className="key-cap">→</span>
                        </th>
                        <td>Move the selected cell; the selection wraps around to the opposite edge</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <span className="key-cap">1</span> to <span className="key-cap">9</span>
                        </th>
                        <td>Enter the digit in the selected cell, or toggle it as a note when notes mode is on</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <span className="key-cap">Space</span>
                        </th>
                        <td>Switch between digit mode and notes mode (needs a selected cell)</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <span className="key-cap">Esc</span>
                        </th>
                        <td>
                            Ask to stop the current run (confirming discards its progress); while a hint is open, close the hint instead
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>
            Undo, redo, hints and the candidates toggle remain on-screen buttons in the app. This page does not cover hardware keyboards on
            Android.
        </p>
        <h2>On the practice boards on this site</h2>
        <p>
            The live boards on the <Link href={techniquesPageMetadata.path}>technique pages</Link> and the difficulty pages use a smaller
            set: the arrow keys move the selection, <span className="key-cap">1</span> to <span className="key-cap">9</span> enter a digit
            or a note, and <span className="key-cap">N</span> switches between them. The board is a labelled grid with a single tab stop,
            which also helps with <Link href={accessibleSudokuPageMetadata.path}>accessibility</Link>. For tactics to use the keyboard on,
            see the <Link href={sudokuTipsPageMetadata.path}>sudoku tips</Link>.
        </p>
        <OpenInApp />
        <FaqPage>
            <FaqHeading>Keyboard shortcuts FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>How do I write pencil marks with the keyboard?</FaqQuestion>
                <FaqAnswer>
                    Press N or Space to switch to notes mode and then press digits, or hold Shift while pressing a digit to toggle a single
                    note without leaving digit mode.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is there a keyboard shortcut for undo?</FaqQuestion>
                <FaqAnswer>On the web, Ctrl+Z or Cmd+Z undoes and adding Shift redoes. Undo is not available in challenge runs.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I clear a cell with Backspace?</FaqQuestion>
                <FaqAnswer>No. Backspace and Delete are not bound. Use undo, or press a note’s digit again to remove that note.</FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default SudokuKeyboardShortcutsPage;
