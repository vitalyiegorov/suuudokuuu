import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import Link from 'next/link';

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
import { nishioForcingChainPageMetadata } from '../nishio-forcing-chain/metadata';
import { uniqueRectanglePageMetadata } from '../unique-rectangle/metadata';
import { xyChainPageMetadata } from '../xy-chain/metadata';

import { bugPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(bugPageMetadata);

const EXAMPLE_BOARD = '3861794527..6549384..328176.6.947315934215867.7.836294643581729...762543..7493681';

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const BugPage = () => (
    <main>
        <TechniquePageHeader metadata={bugPageMetadata} />
        <p>
            A Bivalue Universal Grave, usually written BUG+1, is a uniqueness technique for the late game: when every empty cell holds
            exactly two candidates except one cell that holds three, the digit that appears three times in that cell’s row, column and box
            must be placed there.
        </p>
        <TechniqueSummary>
            <p>
                Check that every empty cell is bivalue apart from a single three-candidate cell. In that cell’s units, two of its digits
                appear twice and one appears three times. Place the one that appears three times.
            </p>
        </TechniqueSummary>
        <h2>When a BUG+1 applies</h2>
        <p>
            A bivalue universal grave is a whole-board deadly pattern. Imagine a position where every empty cell holds exactly two
            candidates, and every digit that is still open in a row, column or box appears there exactly twice. Such a position always has
            either no solution or at least two: every cell can flip to its other candidate together with the cells it pairs with, and no
            unit can tell the difference. A puzzle with exactly one solution can never reach it.
        </p>
        <p>
            The “+1” is the single cell that keeps the board out of that grave. It has three candidates instead of two. In each of its three
            units, two of its digits appear the usual two times, while the third digit appears three times — the extra copy is the one in
            this cell. Strike that third digit from the cell and the board is exactly the grave, so the digit can never be ruled out there.
            The cell must take the digit that appears three times, and that is a placement, not just an elimination.
        </p>
        <p>
            Like the <Link href={uniqueRectanglePageMetadata.path}>Unique Rectangle</Link>, BUG+1 depends on the puzzle having one solution.
            Unlike it, the pattern is global: you have to confirm that every other empty cell on the board is bivalue, not just four
            corners.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.BivalueUniversalGrave}>
            Thirteen cells are still empty. Twelve hold exactly two candidates; r8c3 holds 1, 8 and 9. Digit 1 appears three times in row 8,
            in column 3 and in the bottom-left box, so the solver places 1 in r8c3.
        </TechniqueWorkedExample>
        <p>
            Count the candidates in row 8 first. r8c1 holds 1 and 8, r8c2 holds 1 and 9, and r8c3 holds 1, 8 and 9. Digit 8 appears twice,
            digit 9 appears twice, and digit 1 appears three times. Column 3 tells the same story: 1 sits in r2c3, r6c3 and r8c3, while 8
            and 9 each appear twice. The bottom-left box agrees, with 1 in r8c1, r8c2 and r8c3.
        </p>
        <p>
            Strike the 1 from r8c3 and every empty cell holds two candidates, with every digit appearing twice in every unit — the grave,
            which a single-solution puzzle can never reach. So the 1 cannot be ruled out of r8c3, and r8c3 must be 1. The highlighted cells
            are the ones in r8c3’s units that still carry a 1, which is exactly the count that proves the placement. On this particular
            board an <Link href={xyChainPageMetadata.path}>XY-Chain</Link> would also make progress; the example isolates BUG+1 the same way
            every page in this guide isolates its own technique.
        </p>
        <h2>How to spot a BUG+1</h2>
        <HowTo name="How to spot a BUG+1 in Sudoku">
            <HowToStep name="Fill in every candidate">
                BUG+1 is a whole-board pattern, so it needs complete candidates for every empty cell before you can trust it.
            </HowToStep>
            <HowToStep name="Confirm one cell has three candidates">
                Every empty cell must be bivalue except one, which must have exactly three candidates.
            </HowToStep>
            <HowToStep name="Count that cell’s digits in its units">
                In the cell’s row, column and box, find the digit that appears three times while the other two appear twice.
            </HowToStep>
            <HowToStep name="Place the digit that appears three times">
                Write that digit into the three-candidate cell. The rest of the board usually falls to singles right after.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Missing a second non-bivalue cell. BUG+1 needs exactly one cell with three candidates; two such cells, or any cell with
                four, means the pattern is not there.
            </li>
            <li>
                Working from incomplete pencil marks. A cell that looks bivalue because a candidate was never written in breaks the whole
                argument.
            </li>
            <li>
                Placing the wrong digit. It is the digit that appears three times in the cell’s units that goes in, not one of the digits
                that appear twice.
            </li>
            <li>
                Using it on a puzzle that might have more than one solution. Like every uniqueness technique, it assumes a single answer.
            </li>
        </ul>
        <FaqPage>
            <FaqHeading>BUG+1 FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>What does BUG stand for in sudoku?</FaqQuestion>
                <FaqAnswer>
                    Bivalue Universal Grave: a position where every empty cell is bivalue and every open digit appears twice in each unit.
                    The “+1” names the single extra candidate that keeps the board out of it.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does BUG+1 place a digit or eliminate candidates?</FaqQuestion>
                <FaqAnswer>
                    It places a digit. The three-candidate cell must take the digit that appears three times in its units, which settles the
                    cell outright.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>When does BUG+1 usually show up?</FaqQuestion>
                <FaqAnswer>
                    Late in hard puzzles, when most cells are filled and the remaining ones have been narrowed to pairs. It is a quick
                    finishing move once you know to look for it.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is BUG+1 safe to use on every puzzle?</FaqQuestion>
                <FaqAnswer>
                    Only on puzzles with exactly one solution. Every Suuudokuuu puzzle is checked for that, so it is safe on any board the
                    app serves.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={nishioForcingChainPageMetadata} previous={uniqueRectanglePageMetadata} />
    </main>
);

export default BugPage;
