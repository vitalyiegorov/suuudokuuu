import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { HowTo } from '../../../seo/components/how-to/how-to';
import { HowToStep } from '../../../seo/components/how-to-step/how-to-step';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueExampleBoard } from '../../../techniques/components/technique-example-board/technique-example-board';
import { TechniqueNavigation } from '../../../techniques/components/technique-navigation/technique-navigation';
import { TechniquePageHeader } from '../../../techniques/components/technique-page-header/technique-page-header';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { buildTechniqueExample } from '../../../techniques/utils/build-technique-example.util';
import { jellyfishPageMetadata } from '../jellyfish/metadata';
import { xWingPageMetadata } from '../x-wing/metadata';

import { swordfishPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(swordfishPageMetadata);

const EXAMPLE_BOARD = '953168742862734..1417..28367.6..3.2.2.164...73.527..6..38.2.674.7438.2.96294.7...';

const example = buildTechniqueExample(EXAMPLE_BOARD, SolutionTechniqueEnum.Swordfish);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const SwordfishPage = () => (
    <main>
        <TechniquePageHeader title="Swordfish" />
        <p>
            A Swordfish is the three-line version of an X-Wing: a digit confined to the same three columns across three rows can be erased
            from every other cell in those three columns.
        </p>
        <TechniqueSummary>
            <p>
                Find three rows where a digit’s remaining candidate cells all fall inside the same three columns. The digit must occupy one
                cell in each of those columns, so it can be erased from those columns everywhere else.
            </p>
        </TechniqueSummary>
        <h2>When a Swordfish applies</h2>
        <p>
            A Swordfish relaxes the X-Wing’s requirement in one useful way. An X-Wing needs exactly two candidate cells in each of two rows.
            A Swordfish needs three rows whose candidate cells for a digit, taken together, span exactly three columns — but no single row
            has to use all three columns itself. A row can have the digit in only two of the three columns, as long as the union across all
            three rows is exactly three columns and no row spills into a fourth.
        </p>
        <p>
            That flexibility is also why Swordfish patterns are harder to spot than X-Wings. Instead of comparing two neat pairs of cells, a
            solver has to track a digit across three rows at once and confirm the column count stays at three. Once it does, the logic is
            identical to the X-Wing: one of the three rows supplies the digit to each of the three columns, so no other row can contribute
            it there.
        </p>
        <p>
            As with the X-Wing, the pattern also runs on the column axis: three columns whose candidate cells for a digit span exactly three
            rows trap the digit just as tightly, eliminating it from those three rows elsewhere.
        </p>
        <h2>Worked example</h2>
        <TechniqueExampleBoard example={example}>
            The digit 8 is confined to columns 2, 8 and 9 across rows 5, 6 and 9. That traps 8 out of every other cell in those three
            columns, which the solver reports as eliminations at r4c2 and r4c9.
        </TechniqueExampleBoard>
        <p>
            In row 5, 8 can only go in r5c2 and r5c8. In row 6, it can only go in r6c2 and r6c9. In row 9, it can only go in r9c8 and r9c9.
            Collect the columns those six cells use: 2, 8, 2, 9, 8 and 9 — exactly three distinct columns, 2, 8 and 9, spread across exactly
            three rows. That is a Swordfish on 8.
        </p>
        <p>
            Because rows 5, 6 and 9 between them must place 8 in columns 2, 8 and 9, no other row can hold an 8 in any of those three
            columns. r4c2 was carrying 4, 8 and 9 and loses the 8, leaving 4 and 9. r4c9 was carrying 5 and 8 and loses the 8, leaving 5
            alone — which hands the next pass a naked single. No other cell in columns 2, 8 or 9 outside rows 5, 6 and 9 still had 8 as a
            candidate on this board, so those are the pattern’s only two eliminations.
        </p>
        <h2>How to spot a Swordfish</h2>
        <HowTo name="How to spot a Swordfish in Sudoku">
            <HowToStep name="Pick a digit and list its candidate cells per row">
                For one digit, write down which columns still hold it in each row. Rows where the digit has four or more candidate cells are
                not useful.
            </HowToStep>
            <HowToStep name="Look for three rows spanning three columns">
                Find three rows whose candidate columns for the digit, combined, total exactly three distinct columns. Each row can use two
                or three of them.
            </HowToStep>
            <HowToStep name="Reject a fourth column">
                If any of the three rows has a candidate in a column outside the shared set of three, the pattern does not hold. Every
                candidate cell in the three rows must sit in one of the three columns.
            </HowToStep>
            <HowToStep name="Erase the digit from the rest of the three columns">
                Remove the digit from every other cell in the three columns, outside the three base rows, then repeat the search on the
                column axis.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Requiring every row to use all three columns. Two candidate columns out of three is enough for a row, as long as the
                combined span across all three rows stays at three.
            </li>
            <li>
                Missing a fourth column hiding in one of the three rows. A single stray candidate cell outside the shared columns
                invalidates the whole pattern.
            </li>
            <li>
                Erasing the digit from inside the three base rows. The eliminations apply to the three columns outside those rows, not to
                the rows themselves.
            </li>
            <li>
                Stopping the search after finding one Swordfish. A board can carry more than one fish on different digits at the same time,
                and later passes may need a fresh scan.
            </li>
        </ul>
        <h2>Swordfish FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Do all three rows need candidates in all three columns?</FaqQuestion>
                <FaqAnswer>
                    No. Each row needs candidates in at least two of the three columns, and the union across all three rows must be exactly
                    those three columns. Mixed coverage like two-three-two is the normal shape.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How is a Swordfish different from an X-Wing?</FaqQuestion>
                <FaqAnswer>
                    They are the same fish pattern at different sizes. An X-Wing uses two lines by two lines; a Swordfish uses three by
                    three. The elimination logic — a digit trapped in a fixed set of cover lines — is identical.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does a Swordfish always place a digit?</FaqQuestion>
                <FaqAnswer>
                    No, it is purely an elimination technique. It can, as in the worked example, strip a cell down to a single remaining
                    candidate, which then becomes a naked single on the next pass.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What comes after a Swordfish in difficulty?</FaqQuestion>
                <FaqAnswer>
                    The Jellyfish, which is the same pattern stretched to four lines by four lines. Beyond four lines the pattern still
                    exists in theory but becomes impractical to spot by hand.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={jellyfishPageMetadata} previous={xWingPageMetadata} />
    </main>
);

export default SwordfishPage;
