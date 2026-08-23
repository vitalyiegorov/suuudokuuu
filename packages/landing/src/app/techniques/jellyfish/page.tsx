import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { HowTo } from '../../../seo/components/how-to/how-to';
import { HowToStep } from '../../../seo/components/how-to-step/how-to-step';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueNavigation } from '../../../techniques/components/technique-navigation/technique-navigation';
import { TechniquePageHeader } from '../../../techniques/components/technique-page-header/technique-page-header';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { TechniqueWorkedExample } from '../../../techniques/components/technique-worked-example/technique-worked-example';
import { finnedXWingPageMetadata } from '../finned-x-wing/metadata';
import { swordfishPageMetadata } from '../swordfish/metadata';

import { jellyfishPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(jellyfishPageMetadata);

const EXAMPLE_BOARD = '94.71..32...25..41.12934.87...4.382.42.5..31..6.1.247....64.2.8..4.2.7.325.3..1.4';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const JellyfishPage = () => (
    <main>
        <TechniquePageHeader metadata={jellyfishPageMetadata} />
        <p>
            A Jellyfish is the four-line version of the fish pattern behind the X-Wing and the Swordfish: a digit confined to the same four
            columns across four rows can be erased from every other cell in those four columns.
        </p>
        <TechniqueSummary>
            <p>
                Find four rows where a digit’s remaining candidate cells all fall inside the same four columns. The digit must occupy one
                cell in each of those columns, so it can be erased from those columns everywhere else.
            </p>
        </TechniqueSummary>
        <h2>When a Jellyfish applies</h2>
        <p>
            A Jellyfish extends the Swordfish’s relaxed coverage rule one size further. Four rows are chosen, and the digit’s candidate
            cells across those four rows, taken together, must span exactly four columns. No single row needs candidates in all four columns
            — two or three is enough per row — as long as the combined span across the four rows lands on exactly four, and no row adds a
            fifth.
        </p>
        <p>
            The scanning cost grows quickly with size. An X-Wing compares two rows, a Swordfish compares three, and a Jellyfish compares
            four, so the number of row combinations to check climbs fast even on a nine-row grid. That is why Jellyfish patterns are rare in
            practice and are usually left to a solving engine rather than searched for by hand, even though the underlying logic is no
            different from the smaller fish.
        </p>
        <p>
            The same pattern also runs on the column axis: four columns whose candidate cells for a digit span exactly four rows trap the
            digit just as tightly, eliminating it from those four rows elsewhere.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.Jellyfish}>
            The digit 8 is confined to columns 1, 3, 5 and 6 across rows 1, 5, 6 and 9. That traps 8 out of every other cell in those four
            columns, which the solver reports as an elimination at r2c1.
        </TechniqueWorkedExample>
        <p>
            Across rows 1, 5, 6 and 9, the only cells that can still hold 8 are r1c3, r1c6, r5c3, r5c5, r5c6, r6c1, r6c3, r6c5, r9c3, r9c5
            and r9c6. Collect the columns those eleven cells use: 1, 3, 5 and 6 — exactly four distinct columns spread across exactly four
            rows. That is a Jellyfish on 8, even though not every row reaches all four columns; row 1 only reaches columns 3 and 6, for
            example, while row 6 reaches all four.
        </p>
        <p>
            Because rows 1, 5, 6 and 9 between them must place 8 in columns 1, 3, 5 and 6, no other row can hold an 8 in any of those four
            columns. r2c1 was carrying 3, 6, 7 and 8 before the deduction and loses the 8, leaving 3, 6 and 7. The same reasoning also
            clears 8 from r8c1, r2c3, r2c6 and r8c6 on this board, so the Jellyfish removes five stray candidates in one pass even though it
            needed eleven cells to prove it.
        </p>
        <h2>How to spot a Jellyfish</h2>
        <HowTo name="How to spot a Jellyfish in Sudoku">
            <HowToStep name="Pick a digit and list its candidate cells per row">
                For one digit, write down which columns still hold it in each row. Rows where the digit has five or more candidate cells are
                not useful.
            </HowToStep>
            <HowToStep name="Look for four rows spanning four columns">
                Find four rows whose candidate columns for the digit, combined, total exactly four distinct columns. Each row can use two,
                three or four of them.
            </HowToStep>
            <HowToStep name="Reject a fifth column">
                If any of the four rows has a candidate in a column outside the shared set of four, the pattern does not hold. Every
                candidate cell in the four rows must sit in one of the four columns.
            </HowToStep>
            <HowToStep name="Erase the digit from the rest of the four columns">
                Remove the digit from every other cell in the four columns, outside the four base rows, then repeat the search on the column
                axis.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Requiring every row to use all four columns. A row can use as few as two of the four, as long as the combined span across
                all four rows stays at four.
            </li>
            <li>
                Missing a fifth column hiding in one of the four rows. A single stray candidate cell outside the shared columns invalidates
                the whole pattern.
            </li>
            <li>
                Trying to spot a Jellyfish by eye on a busy board. With four rows and up to sixteen candidate cells to track, it is far
                easier to verify with pencil marks written down than to hold in your head.
            </li>
            <li>
                Assuming a Jellyfish is common. Most puzzles that need a fish pattern at all resolve with an X-Wing or a Swordfish; a true
                Jellyfish is a sign of a genuinely hard grid.
            </li>
        </ul>
        <h2>Jellyfish FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Is a Jellyfish just a bigger Swordfish?</FaqQuestion>
                <FaqAnswer>
                    Yes. The reasoning is identical — a digit confined to the same number of columns as rows — the Jellyfish simply runs the
                    pattern at size four instead of size three.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why does the worked example need eleven cells instead of sixteen?</FaqQuestion>
                <FaqAnswer>
                    A four-by-four fish only needs each of the four rows to keep the digit inside the four shared columns, not to use every
                    one of them. Rows that have already had some of those cells filled in naturally show fewer candidate cells while the
                    pattern still holds.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does a fish pattern have to be a perfect square of cells?</FaqQuestion>
                <FaqAnswer>
                    No. Only the count of base lines and cover lines has to match — four rows and four columns for a Jellyfish. The actual
                    number of candidate cells inside that four-by-four frame can be anywhere from four up to sixteen.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What if a fish pattern has an extra candidate cell outside the frame?</FaqQuestion>
                <FaqAnswer>
                    That extra cell is called a fin, and it turns the pattern into a finned fish rather than invalidating it outright. The
                    Finned X-Wing page picks up exactly that case.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={finnedXWingPageMetadata} previous={swordfishPageMetadata} />
    </main>
);

export default JellyfishPage;
