import Link from 'next/link';

import { StoreBadges } from '../../../chrome/components/store-badges/store-badges';
import { StoreBadgeCampaignEnum } from '../../../chrome/enums/store-badge-campaign.enum';
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { HowToStep } from '../../../seo/components/how-to-step/how-to-step';
import { HowTo } from '../../../seo/components/how-to/how-to';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { DEFAULT_LOCALE, SITE_NAME } from '../../../seo/constants/site.constant';
import { buildLocaleUrl } from '../../../seo/utils/build-locale-url.util';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { sudokuDifficultyRatingPageMetadata } from '../guides/sudoku-difficulty-rating/metadata';
import { homePageMetadata } from '../metadata';
import { privacyPolicyPageMetadata } from '../privacy-policy/metadata';
import { solverPageMetadata } from '../solver/metadata';
import { sudokuDifficultiesPageMetadata } from '../sudoku/metadata';

import { sudokuScannerPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(sudokuScannerPageMetadata);

const SudokuScannerPage = () => (
    <main>
        <ArticleSchema metadata={sudokuScannerPageMetadata} />
        <PageHeader metadata={sudokuScannerPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Sudoku scanner</BreadcrumbListItem>
        </PageHeader>
        <p>
            A sudoku scanner reads a puzzle from a picture and turns it into a grid you can play. In {SITE_NAME} you can photograph a
            newspaper or puzzle book, pick a screenshot from your photos, or paste the puzzle as text, then check the board and carry on
            where you left off. The picture is read on your device, and there is no account to create.
        </p>
        <TechniqueSummary>
            <ul>
                <li>Four ways in: scan with the camera, pick a photo, paste, or type the digits yourself.</li>
                <li>Recognition runs on your device, so the photo is never uploaded.</li>
                <li>Printed digits become the clues and your handwritten digits become your progress.</li>
                <li>A review board marks doubtful digits and checks that the puzzle has exactly one solution before you play.</li>
            </ul>
        </TechniqueSummary>
        <h2>How to scan a sudoku</h2>
        <HowTo name="How to import a sudoku from a photo">
            <HowToStep name="Open the import screen">
                On the Home screen of the app, tap Import a puzzle. In a browser, use the import link at the end of this page.
            </HowToStep>
            <HowToStep name="Bring the puzzle in">
                Tap Scan a puzzle to photograph a newspaper, a book or another screen, or choose Photos for a picture you already have.
                Paste and Type it in are there for puzzles you have as text.
            </HowToStep>
            <HowToStep name="Check the board">
                The recognized grid appears with any doubtful digits marked. Tap a cell to correct it, and the status line under the board
                updates as you go.
            </HowToStep>
            <HowToStep name="Play">
                When the status line reports one solution, with the difficulty and the SE rating, press Play. Handwritten entries that fit
                the solution are already on the board.
            </HowToStep>
        </HowTo>
        <h2>Four ways to bring a puzzle in</h2>
        <ul>
            <li>
                <strong>Scan.</strong> In the iOS and Android apps the camera opens a document scanner, so you can frame the puzzle and crop
                it before it is read.
            </li>
            <li>
                <strong>Photos.</strong> Pick a picture you already took of a printed page, or a screenshot from another sudoku app. This
                works in the web app too.
            </li>
            <li>
                <strong>Paste.</strong> Paste the 81 digits in a row, a grid copied as text with dots or zeros for the blanks, or a link
                from another sudoku site that carries the puzzle in its address. In the web app you can also paste an image straight from
                the clipboard.
            </li>
            <li>
                <strong>Type it in.</strong> Tap a cell and enter its digit. On a computer keyboard the arrow keys move between cells and
                the number keys fill them.
            </li>
        </ul>
        <h2>Continue a puzzle you started on paper</h2>
        <p>
            If you have already filled in some cells by hand, the scanner separates your handwriting from the printed clues by the shade and
            color of the ink. Printed digits become the givens and handwritten ones become your entries. Once the puzzle is checked, entries
            that agree with the solution are kept and the ones that don’t are dropped, so a mistake on paper does not follow you into the
            game. The review board tells you how many entries were kept and how many didn’t match.
        </p>
        <p>
            Handwriting in a pen that looks just like the print can be read as a clue, and the other way round. Tap the digit and choose
            Make my entry or Make printed clue to switch it. If the paper puzzle is already finished, you start again from the printed
            clues.
        </p>
        <p>Small pencil marks, the candidates written in the corner of a cell, are ignored, so a cell full of notes is read as empty.</p>
        <h2>What the review board checks</h2>
        <p>Before you play, the app solves the puzzle itself and the status line under the board reports what it found:</p>
        <ul>
            <li>
                One solution, together with the difficulty tier and the Sudoku Explainer rating. The{' '}
                <Link href={sudokuDifficultiesPageMetadata.path}>difficulty levels</Link> page describes each tier, and the{' '}
                <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> explains the SE scale.
            </li>
            <li>A conflict, named in plain words, such as two 5s in row 3, with the clashing cells highlighted.</li>
            <li>More than one solution, which usually means a clue was missed, or no solution, which usually means a digit was misread.</li>
        </ul>
        <p>
            Play stays off until the puzzle has exactly one solution. If you would rather read the solution than play it, paste the same
            puzzle into the <Link href={solverPageMetadata.path}>step-by-step sudoku solver</Link>, which names the technique behind every
            move.
        </p>
        <h2>Getting a good scan</h2>
        <ul>
            <li>Only classic 9×9 sudoku with the usual 3×3 boxes is supported.</li>
            <li>A closer, straighter photo reads better. Fill the frame with the grid and hold the phone square to the page.</li>
            <li>
                A board partly cut off at one edge of the picture, such as a screenshot that scrolled past the last row, can often still be
                found.
            </li>
            <li>Recognition is not perfect, which is why the review step exists. Look over the marked digits before you press Play.</li>
        </ul>
        <h2>Your photos stay on your device</h2>
        <p>
            The picture is read by a small digit-recognition model that ships with the game, on your phone or in your browser. It is not
            uploaded anywhere, you do not sign in, and the game has no ads and no analytics. The details are in the{' '}
            <Link href={privacyPolicyPageMetadata.path}>privacy policy</Link>.
        </p>
        <h2>On the web and in the apps</h2>
        <p>
            The web app imports from photos, from pasted images and from text. The camera scanner with page framing is a feature of the iOS
            and Android apps.
        </p>
        <a className="hero__cta" href={buildLocaleUrl(DEFAULT_LOCALE, '/import')}>
            Import a puzzle in your browser
        </a>
        <StoreBadges campaign={StoreBadgeCampaignEnum.CONTENT} />
        <FaqPage>
            <FaqHeading>Sudoku scanner FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Can I scan a sudoku from a newspaper or book?</FaqQuestion>
                <FaqAnswer>
                    Yes. Photograph the puzzle with the scanner or pick a photo you took earlier. Printed digits become the clues, and
                    anything you wrote in becomes your progress.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is my photo uploaded?</FaqQuestion>
                <FaqAnswer>No. Recognition runs on your device, and {SITE_NAME} has no account system.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I continue a sudoku I started on paper?</FaqQuestion>
                <FaqAnswer>
                    Yes. Your handwritten digits are kept as your progress when they agree with the solution. Any that don’t are dropped,
                    and the review board tells you how many.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How do I check that a sudoku has only one solution?</FaqQuestion>
                <FaqAnswer>
                    Import it. The review board solves the puzzle before you play and reports one solution with its difficulty tier and SE
                    rating, or says what is wrong: a conflict, no solution, or more than one solution.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can I import a screenshot from another sudoku app?</FaqQuestion>
                <FaqAnswer>
                    Yes. Pick it from your photos, or in the web app paste the image straight from the clipboard. A link from another site
                    works too when the puzzle digits are part of its address.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does the scanner read pencil marks?</FaqQuestion>
                <FaqAnswer>No. Small candidate notes are ignored, and a cell that holds only notes is read as empty.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does it work with killer, jigsaw or other variants?</FaqQuestion>
                <FaqAnswer>No. The scanner reads classic 9×9 sudoku only.</FaqAnswer>
            </Faq>
        </FaqPage>
    </main>
);

export default SudokuScannerPage;
