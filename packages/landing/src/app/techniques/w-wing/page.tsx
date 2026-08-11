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
import { xChainPageMetadata } from '../x-chain/metadata';
import { xyzWingPageMetadata } from '../xyz-wing/metadata';

import { wWingPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(wWingPageMetadata);

const EXAMPLE_BOARD = '953168742862734951417..28367.6..3.252816453973.527..68.38.2.674.7438.2.96294.7..3';

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const WWingPage = () => (
    <main>
        <TechniquePageHeader title="W-Wing" />
        <p>
            A W-Wing links two cells that hold the same pair of candidates through a strong link on one of those digits elsewhere on the
            board, which lets the other digit be erased from every cell both starting cells see.
        </p>
        <TechniqueSummary>
            <p>
                Find two cells with identical two-candidate pairs, X and Y, that do not see each other. If a strong link on X connects them
                — through a unit where X can only go in two cells — then Y can be erased from any cell both cells see.
            </p>
        </TechniqueSummary>
        <h2>When a W-Wing applies</h2>
        <p>
            A W-Wing starts from two cells, anywhere on the board, that both carry exactly the same two candidates, X and Y. Each cell must
            eventually hold one of the two, and since they carry the identical pair, exactly one of them holds X and the other holds Y —
            never both holding the same value, because if one held X, a strong link on X between them would force the other away from X and
            into Y.
        </p>
        <p>
            The strong link is what makes the connection provable. Somewhere on the board, a unit — a row, column or box — has X confined to
            exactly two cells, one of which is one of the two W-Wing cells and the other of which sees the second W-Wing cell. That
            conjugate pair on X ties the two ends of the wing together: if the first cell is not X, the link forces X into its partner,
            which forces the second W-Wing cell away from X and into Y.
        </p>
        <p>
            Once the two ends are shown to always split between X and Y, any cell that sees both of them cannot hold Y, since one of the two
            W-Wing cells always does.
        </p>
        <h2>Worked example</h2>
        <TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.WWing}>
            r8c1 and r9c5 both hold 1 and 5, tied together by a strong link on 5. Because r8c6 sees both cells, the solver eliminates the
            shared value 1 there.
        </TechniqueWorkedExample>
        <p>
            r8c1 and r9c5 both carry exactly 1 and 5. A strong link on 5 connects them, so the two cells always split the pair between them:
            whichever one ends up holding 5, the other is left holding 1. There is no way for both to hold 1 at once.
        </p>
        <p>
            r8c6 sits in row 8 with r8c1 and in the same box as r9c5, so it sees both W-Wing cells. It was carrying 1 and 6 before the
            deduction. Since one of r8c1 or r9c5 always holds 1, r8c6 cannot hold 1 as well, and the solver removes it, leaving 6 behind as
            a naked single.
        </p>
        <h2>How to spot a W-Wing</h2>
        <HowTo name="How to spot a W-Wing in Sudoku">
            <HowToStep name="Find two matching bivalue cells">
                Look for two cells, anywhere on the board, that carry exactly the same two candidates and do not already see each other.
            </HowToStep>
            <HowToStep name="Find a strong link on one of the two digits">
                Check whether a row, column or box confines one of the two candidates to exactly two cells, with one end reaching each of
                the two starting cells.
            </HowToStep>
            <HowToStep name="Confirm the link ties the two cells together">
                The strong link must connect a peer of the first bivalue cell to a peer of the second, so that the two cells are always
                forced apart between the two digits.
            </HowToStep>
            <HowToStep name="Erase the other digit from shared peers">
                Remove the non-linked digit from any cell that sees both of the original bivalue cells.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Using two bivalue cells that already see each other. A W-Wing’s value comes from tying together two cells that are not
                already peers.
            </li>
            <li>
                Treating any shared candidate as a strong link. The link must confine one digit to exactly two cells in some unit, not just
                have the digit present in both.
            </li>
            <li>
                Eliminating the linked digit instead of the other one. The strong-link digit stays in play at both ends; it is the remaining
                digit that gets erased from shared peers.
            </li>
            <li>
                Forgetting to check both digits as the possible link. A pair might only work as a W-Wing through one of its two candidates,
                not the other.
            </li>
        </ul>
        <h2>W-Wing FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>What is a strong link?</FaqQuestion>
                <FaqAnswer>
                    A strong link on a digit is a unit — a row, column or box — where that digit has exactly two remaining candidate cells.
                    If one of the two cells is not the digit, the other one must be.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Do the two W-Wing cells need to be in the same row, column or box?</FaqQuestion>
                <FaqAnswer>
                    No. They can be anywhere on the board. What ties them together is the strong link elsewhere, not any direct relationship
                    between the two cells themselves.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>How is a W-Wing different from an XY-Wing?</FaqQuestion>
                <FaqAnswer>
                    An XY-Wing uses a shared pivot cell with two of the three values in play. A W-Wing has no pivot at all; instead, two
                    identical bivalue cells are tied together by a strong link somewhere else on the board.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is a W-Wing a kind of chain?</FaqQuestion>
                <FaqAnswer>
                    It is a short, two-step version of the same alternating strong-and-weak-link reasoning that the chain techniques later
                    in this list use on a larger scale.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={xChainPageMetadata} previous={xyzWingPageMetadata} />
    </main>
);

export default WWingPage;
