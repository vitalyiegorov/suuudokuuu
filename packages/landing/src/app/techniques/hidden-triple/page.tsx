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
import { hiddenPairPageMetadata } from '../hidden-pair/metadata';
import { hiddenQuadPageMetadata } from '../hidden-quad/metadata';

import { hiddenTriplePageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(hiddenTriplePageMetadata);

const EXAMPLE_BOARD = '692...8..457..831218324569784...3...31.....6.72.......571486...934172586268..9471';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const HiddenTriplePage = () => (
    <main>
        <TechniquePageHeader title="Hidden Triple" />
        <p>
            A hidden triple is three digits that between them can only go in the same three cells of a unit, which reserves those cells for
            the triple and removes every other candidate from them.
        </p>
        <TechniqueSummary>
            <p>
                Three digits, three cells. Each digit may fit in two or three of the cells, but none of them fits anywhere else in the unit,
                so the three cells are committed and their remaining candidates are impossible.
            </p>
        </TechniqueSummary>
        <h2>When a hidden triple applies</h2>
        <p>
            The rule is about coverage, not about individual cells. Pick three digits a unit still needs and collect every cell where any of
            them can go. If that collection has exactly three cells, the three digits must occupy them, one each, and no fourth digit can
            squeeze in.
        </p>
        <p>
            Unlike a hidden pair, the three digits do not all need the same list of homes. One digit might be limited to two of the cells
            and another to all three. What matters is that the union of their homes is three cells wide.
        </p>
        <p>
            Hidden triples are worth hunting on hard puzzles because the cells involved are often very wide. Stripping a five-candidate cell
            down to three in a single move is the sort of progress that restarts a stalled grid.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.HiddenTriple}>
            The bottom-right box confines 3, 4 and 8 to r5c9, r6c8 and r6c9. Those three cells are cleaned out, which the solver reports as
            five eliminations.
        </TechniqueWorkedExample>
        <p>
            The bottom-right box has eight empty cells, so nothing about it looks tidy. Trace the three digits anyway. 3 fits only in r6c8
            and r6c9. 4 fits only in r5c9, r6c8 and r6c9. 8 fits only in r5c9 and r6c9. Together those digits reach exactly three cells.
        </p>
        <p>
            Those cells must therefore hold 3, 4 and 8 in some order. r5c9 was carrying 4, 5, 8 and 9 and gives up the 5 and the 9. r6c8 was
            carrying 3, 4 and 5 and gives up the 5. r6c9 was carrying 3, 4, 5, 8 and 9 and gives up the 5 and the 9. The box has lost its
            only homes for 5 outside the triple, which sets up the next deduction.
        </p>
        <h2>How to spot a hidden triple</h2>
        <HowTo name="How to spot a hidden triple in Sudoku">
            <HowToStep name="Choose a unit and list its missing digits">
                Boxes with many blanks are the best hunting ground, because intersections have usually already thinned their candidates.
            </HowToStep>
            <HowToStep name="Note the homes of every missing digit">
                Write down, for each digit, the cells in the unit where it can still go. Digits with two or three homes are the interesting
                ones.
            </HowToStep>
            <HowToStep name="Look for three digits covering three cells">
                Combine three of those home lists. If the union is exactly three cells, the triple is confirmed.
            </HowToStep>
            <HowToStep name="Clean the three cells">
                Remove every candidate other than the three digits from all three cells, then look for the naked subset or single that
                appears next.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>Requiring each digit to fit in all three cells. Two homes out of the three is fine, and very common.</li>
            <li>
                Counting a digit that also fits in a fourth cell of the unit. A single stray home breaks the pattern completely, so check
                every cell.
            </li>
            <li>Erasing the three digits from the rest of the unit instead of cleaning the triple cells. That is the naked version.</li>
            <li>
                Giving up because the cells look crowded. Wide candidate lists are exactly where hidden triples live, which is why they are
                worth the search.
            </li>
        </ul>
        <h2>Hidden triple FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Do the three digits have to appear in all three cells?</FaqQuestion>
                <FaqAnswer>
                    No. Each digit needs at least two homes among the three cells, and the union of all three home lists must be exactly
                    those three cells. Any distribution satisfying that is a valid hidden triple.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Where do hidden triples show up most?</FaqQuestion>
                <FaqAnswer>
                    In units with seven or more empty cells, most often boxes. In tighter units the equivalent naked subset is smaller and a
                    solver will find that first.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is a hidden triple related to a naked subset?</FaqQuestion>
                <FaqAnswer>
                    Yes. In a unit with n empty cells, a hidden triple on three of them is the complement of a naked subset on the other n −
                    3 cells. When that complement is small, the naked version is the easier way in.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Does it ever place a digit directly?</FaqQuestion>
                <FaqAnswer>
                    Not on its own. It only removes candidates, but the removals routinely expose a hidden single for a digit that was
                    previously spread across the unit.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={hiddenQuadPageMetadata} previous={hiddenPairPageMetadata} />
    </main>
);

export default HiddenTriplePage;
