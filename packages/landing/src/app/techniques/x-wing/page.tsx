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
import { hiddenQuadPageMetadata } from '../hidden-quad/metadata';
import { swordfishPageMetadata } from '../swordfish/metadata';

import { xWingPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(xWingPageMetadata);

const EXAMPLE_BOARD = '953168742862734..1417..28367.6..3.2...1.4...7..5.7..6..38....74.7438...96294.7...';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const XWingPage = () => (
    <main>
        <TechniquePageHeader title="X-Wing" />
        <p>
            An X-Wing is a fish pattern where a digit is confined to the same two lines — the same two columns across two rows, or the same
            two rows across two columns — which lets that digit be erased from every other cell along those two lines.
        </p>
        <TechniqueSummary>
            <p>
                Find two rows where a digit has only two candidate cells each, and check whether those cells share the same two columns.
                When they do, that digit can be removed from both columns everywhere outside the two rows.
            </p>
        </TechniqueSummary>
        <h2>When an X-Wing applies</h2>
        <p>
            Subsets reason inside a single unit. Fish patterns are the first techniques on this list that reason across two units of the
            same kind at once — two rows, or two columns. An X-Wing needs a digit that, in two separate rows, can only go in exactly two
            cells each. If those four cells line up in exactly two columns, the digit is trapped in a rectangle: whichever row eventually
            takes it in one column, the other row must take it in the other column. Either way, no cell outside those two rows can hold the
            digit in either of those two columns, so every other candidate for it in those columns is impossible.
        </p>
        <p>
            The same logic runs sideways: two columns with exactly two candidate cells each, aligned on the same two rows, trap the digit
            just as tightly and let it be erased from the rest of those two rows instead. X-Wings are the smallest fish, sized at two lines
            by two lines; Swordfish and Jellyfish, later on this list, stretch the same idea to three and four lines.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.XWing}>
            The digit 2 is confined to columns 1 and 4 in rows 5 and 6. That rectangle removes 2 from every other cell in columns 1 and 4,
            which the solver reports as an elimination at r7c4.
        </TechniqueWorkedExample>
        <p>
            Look at rows 5 and 6. In row 5, the only cells that can still hold 2 are r5c1 and r5c4. In row 6, the only cells that can still
            hold 2 are r6c1 and r6c4. Both rows restrict the digit to exactly the same pair of columns, 1 and 4, so the four corner cells
            r5c1, r5c4, r6c1 and r6c4 form an X-Wing on 2.
        </p>
        <p>
            One of those two rows must place 2 in column 1, and the other must place it in column 4 — there is no third option, because
            nowhere else in either row can 2 go. That means column 1 and column 4 each get their 2 from row 5 or row 6, which is enough to
            rule the digit out everywhere else in both columns. r7c4 carried 2, 5, 6 and 9 before the deduction; the X-Wing removes the 2
            and leaves 5, 6 and 9 behind. No other cell in columns 1 or 4 outside rows 5 and 6 still had 2 as a candidate on this board, so
            r7c4 is the pattern’s only elimination here.
        </p>
        <h2>How to spot an X-Wing</h2>
        <HowTo name="How to spot an X-Wing in Sudoku">
            <HowToStep name="Pick a digit and scan the rows">
                For one digit at a time, note every row where it has exactly two remaining candidate cells. Rows with three or more
                candidates for that digit are not useful here.
            </HowToStep>
            <HowToStep name="Compare the columns those cells sit in">
                Take any two such rows and check whether their candidate cells share the same two columns. If they do, the four cells form a
                rectangle.
            </HowToStep>
            <HowToStep name="Confirm the rectangle is exact">
                Both rows must be limited to precisely those two columns for the digit. A stray third candidate cell in either row breaks
                the pattern completely.
            </HowToStep>
            <HowToStep name="Erase the digit from the rest of both columns">
                Remove the digit from every other cell in the two columns, outside the two base rows, then repeat the search on the column
                axis.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Eliminating the digit from cells inside the two base rows. The rows are exactly where the digit is still allowed; the
                eliminations only apply to the two columns outside them.
            </li>
            <li>
                Accepting a row with three candidate cells for the digit as one corner of the rectangle. A basic X-Wing needs precisely two
                candidate cells in each base row.
            </li>
            <li>
                Mixing up rows and columns mid-search. A row-based X-Wing eliminates along columns; a column-based X-Wing eliminates along
                rows. Keep the base and cover lines straight.
            </li>
            <li>
                Giving up because the grid looks crowded. X-Wings hide in wide candidate lists just as easily as in narrow ones — what
                matters is the digit’s own count per row or column, not how full the cells look.
            </li>
        </ul>
        <h2>X-Wing FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Does an X-Wing place a digit directly?</FaqQuestion>
                <FaqAnswer>
                    No. It only proves that a digit cannot appear in certain cells. Like the subset techniques before it, it usually exposes
                    a single or another elimination on the next pass rather than filling a cell itself.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why is it called an X-Wing?</FaqQuestion>
                <FaqAnswer>
                    The four candidate cells sit at the corners of a rectangle, and tracing the two diagonals across it sketches an X shape
                    over the grid. The name describes the pattern, not the underlying logic.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What is the difference between a row-based and column-based X-Wing?</FaqQuestion>
                <FaqAnswer>
                    They are the same rectangle read from two directions: a row-based X-Wing eliminates along its two cover columns, and a
                    column-based X-Wing eliminates along its two cover rows.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How does an X-Wing relate to a Swordfish?</FaqQuestion>
                <FaqAnswer>
                    A Swordfish is the same reasoning extended from two lines to three. Both are fish patterns; the X-Wing is the smallest
                    member of the family, and the size keeps growing until the pattern stops being practical to spot by eye.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={swordfishPageMetadata} previous={hiddenQuadPageMetadata} />
    </main>
);

export default XWingPage;
