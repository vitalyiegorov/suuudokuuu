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
import { aicPageMetadata } from '../aic/metadata';
import { bugPageMetadata } from '../bug/metadata';
import { cellForcingChainPageMetadata } from '../cell-forcing-chain/metadata';

import { nishioForcingChainPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(nishioForcingChainPageMetadata);

const EXAMPLE_BOARD = '16.........3..15...9.8...716....2.3....75...4....9...82.1.....6..6.......8.5...4.';

// oxlint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const NishioForcingChainPage = () => (
    <main>
        <TechniquePageHeader metadata={nishioForcingChainPageMetadata} />
        <p>
            A Nishio forcing chain is a proof by contradiction on one candidate: assume a digit goes in a cell, follow every naked and
            hidden single that assumption forces, and if the chain reaches an impossible position, erase that candidate from the cell.
        </p>
        <TechniqueSummary>
            <p>
                Pick a candidate and pretend it is true. Place every single that follows, one after another. If some cell runs out of
                candidates, or some unit has nowhere left for a digit, the assumption was false and the candidate can be removed.
            </p>
        </TechniqueSummary>
        <h2>When a Nishio forcing chain applies</h2>
        <p>
            Forcing chains are the techniques that carry the hardest puzzles, the ones that resist every fixed pattern from fish to{' '}
            <Link href={aicPageMetadata.path}>AIC</Link>. The Nishio is the simplest of them. It starts from one candidate, a digit d in a
            cell, and asks a single question: if d were placed here, would the board stay consistent? To answer it, place d and then apply
            only the cheapest logic — naked singles and hidden singles — again and again, writing down each forced placement.
        </p>
        <p>
            Most of the time the chain simply fizzles out, and the test proves nothing. Sometimes it collides with itself: a cell is left
            with no candidates, or a row, column or box loses every place for a digit it still needs. A real solution can never produce that
            state, so the starting assumption was false. The candidate is removed, and nothing else on the board changes.
        </p>
        <p>
            That is the difference between a forcing chain and a guess. A guess commits to a digit and hopes. A Nishio commits to nothing:
            it only keeps the conclusion that the assumption is impossible, which is a fact about the puzzle no matter what the solution
            turns out to be. Suuudokuuu’s solver only reports a chain that touches at least four cells, leaving the shortest collisions to
            the simpler techniques that already cover them.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.NishioForcingChain}>
            Assuming r1c6 is 4 forces r1c3 to 5, r3c6 to 5 and r3c7 to 4, which leaves r3c1 with no candidates at all. The solver erases 4
            from r1c6.
        </TechniqueWorkedExample>
        <p>
            r1c6 holds 3, 4, 5, 7 and 9. Assume it is 4 and follow the singles. In row 1, digit 5 only fits in r1c3 and r1c6; with r1c6
            taken, r1c3 must be 5. In the top-middle box, 5 only fits in r1c6 and r3c6, so r3c6 must be 5. In the top-right box, 4 only fits
            in r1c7 and r3c7, and r1c7 shares row 1 with the assumed 4, so r3c7 must be 4.
        </p>
        <p>
            Now look at r3c1, which started with just 4 and 5. The 5 in r1c3 sits in the same box, and the 4 in r3c7 sits in the same row.
            r3c1 has nothing left. No solution can contain an empty cell, so r1c6 cannot be 4, and the solver removes that candidate. The
            four highlighted cells are the assumption and the three placements that led to the contradiction.
        </p>
        <h2>How to use a Nishio forcing chain</h2>
        <HowTo name="How to use a Nishio forcing chain in Sudoku">
            <HowToStep name="Pick a promising candidate">
                Choose a candidate in a crowded area, ideally one whose removal would leave its cell with very few options.
            </HowToStep>
            <HowToStep name="Assume it and follow the singles">
                Place it on scratch paper or in your head, then apply every naked and hidden single it forces, one at a time.
            </HowToStep>
            <HowToStep name="Watch for a contradiction">
                Stop when a cell runs out of candidates or a unit has no place left for a digit it still needs.
            </HowToStep>
            <HowToStep name="Erase the starting candidate">
                Undo the scratch placements and remove only the candidate you assumed. If no contradiction appeared, nothing is learned.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Keeping the scratch placements. The chain proves one thing only, that the starting candidate is false; every digit placed
                along the way must be undone.
            </li>
            <li>
                Treating a chain that fizzles out as proof the candidate is true. No contradiction means no conclusion, not a placement.
            </li>
            <li>
                Following anything stronger than singles. Mixing in deeper techniques makes the chain hard to verify and easy to get wrong.
            </li>
            <li>Starting from a random candidate. Short chains come from crowded areas where each placement quickly forces the next.</li>
        </ul>
        <FaqPage>
            <FaqHeading>Nishio forcing chain FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>Is a Nishio forcing chain the same as guessing?</FaqQuestion>
                <FaqAnswer>
                    No. A guess keeps the assumed digit and hopes it is right. A Nishio only keeps the proof that the assumption leads to an
                    impossible board, which is true whatever the solution is.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Where does the name Nishio come from?</FaqQuestion>
                <FaqAnswer>
                    It is named after the Japanese puzzle author Tetsuya Nishio. In its original form it tests the placements of a single
                    digit; solvers now use the name for any single-candidate contradiction test like the one shown here.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How is a Nishio different from a cell forcing chain?</FaqQuestion>
                <FaqAnswer>
                    A Nishio tests one candidate and needs a contradiction. A{' '}
                    <Link href={cellForcingChainPageMetadata.path}>cell forcing chain</Link> tests every candidate of a cell and keeps what
                    all of the branches agree on, so it can also place a digit.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Which puzzles need a Nishio forcing chain?</FaqQuestion>
                <FaqAnswer>
                    Puzzles beyond the reach of every fixed pattern. Every board in Suuudokuuu’s Hell tier needs a forcing chain of some
                    kind, and the record puzzles in the Infinity tier lean on them heavily.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={cellForcingChainPageMetadata} previous={bugPageMetadata} />
    </main>
);

export default NishioForcingChainPage;
