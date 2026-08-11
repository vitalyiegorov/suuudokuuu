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
import { wWingPageMetadata } from '../w-wing/metadata';
import { xyWingPageMetadata } from '../xy-wing/metadata';

import { xyzWingPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(xyzWingPageMetadata);

const EXAMPLE_BOARD = '953168742862734951417..28367.6..3.2528164..973.527..68.38.2.674.7438.2.96294.7..3';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const XYZWingPage = () => (
    <main>
        <TechniquePageHeader title="XYZ-Wing" />
        <p>
            An XYZ-Wing tightens the XY-Wing by giving the pivot cell all three candidates involved, X, Y and Z, so the elimination only
            reaches cells that all three cells of the wing see at once.
        </p>
        <TechniqueSummary>
            <p>
                Find a pivot with three candidates, X, Y and Z, and two pincers that each share two of those candidates with the pivot,
                including Z. Any other cell that sees the pivot and both pincers cannot hold Z.
            </p>
        </TechniqueSummary>
        <h2>When an XYZ-Wing applies</h2>
        <p>
            An XY-Wing’s pivot has only two candidates, so it never itself carries the value being eliminated. An XYZ-Wing’s pivot carries
            all three: X, Y and Z. Two pincers each see the pivot and each hold one of X or Y alongside the shared value Z. The pivot must
            end up holding X, Y or Z. If it holds X, one pincer is forced to Z. If it holds Y, the other pincer is forced to Z. If it holds
            Z itself, the pivot is Z. Every branch ends with the pivot or one of the pincers holding Z.
        </p>
        <p>
            Because the pivot itself is one of the three cells that might hold Z, any target cell has to see all three — the pivot and both
            pincers — for the elimination to be safe. That usually means the wing sits inside a single box, with the pivot and pincers close
            enough together that a target cell shares a unit with all of them.
        </p>
        <p>
            This is stricter than an XY-Wing, which only needs a target cell to see the two pincers. The payoff is that an XYZ-Wing can fire
            in positions where the pivot’s extra candidate rules out a plain XY-Wing but the three-way agreement on Z still holds.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.XYZWing}>
            The pivot r7c6 holds 1, 5 and 9. Pincer r7c4 holds 5 and 9; pincer r9c5 holds 1 and 5. All three cells and the target r8c6 share
            the same box, so the solver eliminates 5 there.
        </TechniqueWorkedExample>
        <p>
            r7c6 is the pivot, carrying 1, 5 and 9. r7c4 shares the pivot’s row and holds 5 and 9. r9c5 shares the pivot’s box and holds 1
            and 5. Both pincers agree with the pivot on 5, so every one of the pivot’s three possible values leads to 5 landing somewhere in
            the wing. If the pivot itself is 5, that is immediate. If the pivot is 9 instead, r7c4 cannot also be 9, so r7c4 must be 5. If
            the pivot is 1 instead, r9c5 cannot also be 1, so r9c5 must be 5.
        </p>
        <p>
            r8c6 sits in the same bottom-middle box as all three wing cells, so it sees the pivot and both pincers at once. It was carrying
            1, 5 and 6 before the deduction. Since 5 lands somewhere in the wing no matter which value the pivot takes, r8c6 cannot hold 5,
            and the solver removes it, leaving 1 and 6 behind.
        </p>
        <h2>How to spot an XYZ-Wing</h2>
        <HowTo name="How to spot an XYZ-Wing in Sudoku">
            <HowToStep name="Find a tri-value pivot">
                Look for a cell with exactly three candidates, X, Y and Z, sitting inside a box with room for two pincers nearby.
            </HowToStep>
            <HowToStep name="Find two pincers that each see the pivot">
                Each pincer must share a unit with the pivot, hold exactly two candidates, include Z, and include one of X or Y.
            </HowToStep>
            <HowToStep name="Confirm all three cells share a unit with the target">
                The elimination only applies to cells that see the pivot and both pincers, which usually means all four cells share a box.
            </HowToStep>
            <HowToStep name="Erase Z from that shared cell">
                Remove Z from any cell, other than the wing’s own three cells, that sees the pivot and both pincers.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Using a pivot with only two candidates. That is an XY-Wing, not an XYZ-Wing; the pivot here must carry all three values.
            </li>
            <li>
                Eliminating Z from a cell that sees only the pincers but not the pivot. All three wing cells must see the target for an
                XYZ-Wing elimination.
            </li>
            <li>
                Mixing up which pincer shares which value with the pivot. Each pincer needs exactly one of X or Y in common with the pivot,
                plus the shared Z.
            </li>
            <li>
                Assuming the wing always fits in a single row or column. It is most often confined to a single box because that is usually
                the only unit all three cells share.
            </li>
        </ul>
        <h2>XYZ-Wing FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Why does the pivot need three candidates instead of two?</FaqQuestion>
                <FaqAnswer>
                    Because the pivot itself is one of the cells that might end up holding Z. Including that possibility is what lets the
                    elimination reach cells that see all three wing cells, not just the two pincers.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can an XYZ-Wing’s pincers see each other directly?</FaqQuestion>
                <FaqAnswer>
                    They can, but they do not need to. What matters is that each pincer sees the pivot, and that the target cell sees the
                    pivot and both pincers.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does an XYZ-Wing eliminate more than an XY-Wing?</FaqQuestion>
                <FaqAnswer>
                    Not necessarily more cells, but a different set. An XYZ-Wing’s stricter visibility requirement often narrows the
                    elimination to fewer cells than an XY-Wing would, in exchange for working on boards where a plain XY-Wing does not fit.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What comes after the wing patterns?</FaqQuestion>
                <FaqAnswer>
                    The W-Wing, which links two matching bivalue cells through a strong link instead of a shared pivot, followed by the
                    chain techniques that generalise all of these patterns further.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={wWingPageMetadata} previous={xyWingPageMetadata} />
    </main>
);

export default XYZWingPage;
