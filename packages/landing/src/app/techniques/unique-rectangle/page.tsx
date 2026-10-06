import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { HowToStep } from '../../../seo/components/how-to-step/how-to-step';
import { HowTo } from '../../../seo/components/how-to/how-to';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueNavigation } from '../../../techniques/components/technique-navigation/technique-navigation';
import { TechniquePageHeader } from '../../../techniques/components/technique-page-header/technique-page-header';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { TechniqueWorkedExample } from '../../../techniques/components/technique-worked-example/technique-worked-example';
import { aicPageMetadata } from '../aic/metadata';
import { bugPageMetadata } from '../bug/metadata';

import { uniqueRectanglePageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(uniqueRectanglePageMetadata);

const EXAMPLE_BOARD = '927.54.81185..2..76347..29587624..5334..6587225.873..6468527..95.2...7647.34.6528';

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const UniqueRectanglePage = () => (
    <main>
        <TechniquePageHeader metadata={uniqueRectanglePageMetadata} />
        <p>
            A Unique Rectangle is a uniqueness technique: when three corners of a rectangle spanning two rows, two columns and exactly two
            boxes hold the same two candidates and nothing else, the fourth corner cannot take either of those two digits, because doing so
            would give the puzzle a second solution.
        </p>
        <TechniqueSummary>
            <p>
                Find four empty cells at the corners of a rectangle that sits in two boxes. If three of them carry the same pair of
                candidates and the fourth carries that pair plus something extra, erase the pair from the fourth corner.
            </p>
        </TechniqueSummary>
        <h2>When a Unique Rectangle applies</h2>
        <p>
            Every proper sudoku has exactly one solution, and every puzzle Suuudokuuu serves is checked for that before it reaches you. A
            Unique Rectangle turns that promise into a deduction. Picture four cells at the corners of a rectangle, in two rows and two
            columns, with the rectangle sitting in exactly two boxes. If all four corners ended up holding only the digits a and b, the
            corners could be filled in two ways — a and b on one diagonal, or the swap — and nothing else in the grid could tell the two
            apart. That arrangement is called a deadly pattern, and a puzzle with one solution can never reach it.
        </p>
        <p>
            The two-box condition is what makes the swap invisible. Each row, each column and each of the two boxes contains exactly two
            corners, so exchanging a and b keeps every unit valid. A rectangle that spreads across four boxes does not give the same
            guarantee, because each box only sees one corner and the swap can break a box elsewhere.
        </p>
        <p>
            The pattern that fires is the near miss. Three corners, the floor, hold exactly a and b. The fourth corner, the roof, holds a
            and b plus at least one more digit. If the roof became a or b, all four corners would collapse into the deadly pattern, so the
            roof must take one of its other candidates. This is the most common form, often called type 1, and it is the one Suuudokuuu’s
            solver checks for.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.UniqueRectangle}>
            r8c2, r9c2 and r9c5 hold only 1 and 9, and r8c5 holds 1, 3, 8 and 9. The four cells form a rectangle across rows 8 and 9 and
            columns 2 and 5, in the bottom-left and bottom-middle boxes. The solver erases 1 and 9 from r8c5.
        </TechniqueWorkedExample>
        <p>
            Look at rows 8 and 9 near the bottom of the grid. Column 2 holds the pair 1 and 9 in both r8c2 and r9c2, and column 5 holds the
            same pair in r9c5. The rectangle sits in exactly two boxes: the column 2 corners in the bottom-left box, the column 5 corners in
            the bottom-middle box. Those three cells are the floor.
        </p>
        <p>
            r8c5 is the roof, with candidates 1, 3, 8 and 9. Suppose it were 1. Then r8c2 would have to be 9, r9c2 would have to be 1, and
            r9c5 would have to be 9 — and the same grid with every 1 and 9 in those four cells exchanged would also be valid. Suppose it
            were 9 instead and the same swap appears. Both choices lead to two solutions, which the puzzle does not have, so r8c5 is neither
            1 nor 9. The solver removes both and leaves 3 and 8, a much smaller choice for the next step to work with.
        </p>
        <h2>How to spot a Unique Rectangle</h2>
        <HowTo name="How to spot a Unique Rectangle in Sudoku">
            <HowToStep name="Look for repeated bivalue pairs">
                Scan for the same two-candidate pair appearing in several cells, especially in two rows or two columns near each other.
            </HowToStep>
            <HowToStep name="Check the rectangle shape">
                Pick three cells holding that pair that form three corners of a rectangle, and confirm the four corners sit in exactly two
                boxes.
            </HowToStep>
            <HowToStep name="Inspect the fourth corner">
                The fourth corner must be empty and must hold both digits of the pair plus at least one extra candidate.
            </HowToStep>
            <HowToStep name="Erase the pair from the roof">
                Remove both digits of the pair from the fourth corner. Whatever is left there is the corner’s real set of options.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Using a rectangle that spans four boxes. Without the two-box condition the swap is not invisible, and the deduction is not
                valid.
            </li>
            <li>
                Counting a given as a corner. The deadly pattern only threatens cells that are still empty; a corner that holds a given or a
                digit you placed by logic breaks the swap.
            </li>
            <li>
                Applying it to a puzzle that might have several solutions. The technique proves nothing on a grid you typed in yourself
                unless you know it has exactly one solution.
            </li>
            <li>
                Erasing the extra candidates instead of the pair. The roof keeps its extras; it is the shared pair that cannot go there.
            </li>
        </ul>
        <FaqPage>
            <FaqHeading>Unique Rectangle FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is a Unique Rectangle a real deduction or a shortcut?</FaqQuestion>
                <FaqAnswer>
                    It is a real deduction, but it rests on one extra fact: the puzzle has exactly one solution. Every Suuudokuuu puzzle is
                    checked for that, so the technique is always safe on boards the app serves.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why must the rectangle sit in exactly two boxes?</FaqQuestion>
                <FaqAnswer>
                    Because then every row, column and box involved contains exactly two corners, so exchanging the two digits keeps every
                    unit valid. Across four boxes the swap can break a box, and there is no deadly pattern to avoid.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Are there other types of Unique Rectangle?</FaqQuestion>
                <FaqAnswer>
                    Yes. Players also use variants where two corners carry extras, or where the extras form a subset with nearby cells.
                    Suuudokuuu’s solver detects the basic form shown here, where only one corner carries extra candidates.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why does the Unique Rectangle come after AIC in this list?</FaqQuestion>
                <FaqAnswer>
                    The list follows the order the solver tries techniques. Uniqueness techniques come after the chain family because they
                    rely on the one-solution guarantee rather than on the rules of the grid alone.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={bugPageMetadata} previous={aicPageMetadata} />
    </main>
);

export default UniqueRectanglePage;
