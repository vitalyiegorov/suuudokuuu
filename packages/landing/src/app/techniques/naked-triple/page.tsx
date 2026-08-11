import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../../seo/components/breadcrumbs/breadcrumbs';
import { Faq } from '../../../seo/components/faq/faq';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { HowTo } from '../../../seo/components/how-to/how-to';
import { HowToStep } from '../../../seo/components/how-to-step/how-to-step';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { TechniqueExampleBoard } from '../../../techniques/components/technique-example-board/technique-example-board';
import { TechniqueNavigation } from '../../../techniques/components/technique-navigation/technique-navigation';
import { TechniqueSummary } from '../../../techniques/components/technique-summary/technique-summary';
import { buildTechniqueExample } from '../../../techniques/utils/build-technique-example.util';
import { homePageMetadata } from '../../metadata';
import { techniquesPageMetadata } from '../metadata';
import { nakedPairPageMetadata } from '../naked-pair/metadata';
import { nakedQuadPageMetadata } from '../naked-quad/metadata';

import { nakedTriplePageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(nakedTriplePageMetadata);

const EXAMPLE_BOARD = '..5.21.43934567812....34.5....215364342786195561493278.5317.48....64.5374..35..21';

const example = buildTechniqueExample(EXAMPLE_BOARD, SolutionTechniqueEnum.NakedTriple);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const NakedTriplePage = () => (
    <main>
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={techniquesPageMetadata.path}>Sudoku techniques</BreadcrumbListItem>
            <BreadcrumbListItem>Naked Triple</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Naked Triple Sudoku Technique</h1>
        <p>
            A naked triple is three cells in the same unit whose candidates, taken together, use only three different digits, which reserves
            those digits for the three cells and clears them from the rest of the unit.
        </p>
        <TechniqueSummary>
            <p>
                Three cells, three digits between them. The cells do not each need all three candidates; what matters is that their union is
                exactly three digits, so those digits are used up and every other cell in the unit loses them.
            </p>
        </TechniqueSummary>
        <h2>When a naked triple applies</h2>
        <p>
            The trap with triples is expecting three identical candidate lists. That is only one of the possible shapes. A valid triple over
            the digits a, b and c can be made of any mix of {'{'}a,b,c{'}'}, {'{'}a,b{'}'}, {'{'}a,c{'}'} and {'{'}b,c{'}'} cells, as long
            as the union across the three cells is exactly three digits and no cell brings in a fourth.
        </p>
        <p>
            Three cells that can only hold three digits will consume all three, one each. Since a unit contains every digit exactly once,
            those digits are no longer available to any other cell in the row, column or box that holds the triple.
        </p>
        <p>
            Naked triples appear in units with five or six blanks. Fewer blanks and the puzzle usually collapses to singles first; more
            blanks and the candidate lists are still too wide for three cells to share only three digits.
        </p>
        <h2>Worked example</h2>
        <TechniqueExampleBoard example={example}>
            Column 2 holds a naked triple on 7, 8 and 9 in r1c2, r4c2 and r9c2. Four candidates are erased from the two remaining cells of
            the column.
        </TechniqueExampleBoard>
        <p>
            Column 2 has five empty cells. Three of them carry only 7, 8 and 9 between them: r1c2 shows 7 and 8, r4c2 shows 7, 8 and 9, and
            r9c2 shows 7, 8 and 9. Note the mismatch in size, which is exactly why triples are missed so often. The union is still just
            three digits.
        </p>
        <p>
            Those three digits are therefore locked into those three cells. r3c2 held 1, 2, 7 and 8 and gives up the 7 and the 8. r8c2 held
            1, 2, 8 and 9 and gives up the 8 and the 9. Both are left holding 1 and 2, which is a fresh naked pair and an immediate second
            deduction.
        </p>
        <h2>How to spot a naked triple</h2>
        <HowTo name="How to spot a naked triple in Sudoku">
            <HowToStep name="Pick a unit with five or six blanks">
                Rows, columns and boxes in that range are where triples live. Write out the candidates before you start looking.
            </HowToStep>
            <HowToStep name="Collect cells with two or three candidates">
                Any cell with four or more candidates cannot belong to a triple, so cross those out of consideration immediately.
            </HowToStep>
            <HowToStep name="Test combinations for a three-digit union">
                Take three of the surviving cells and merge their candidate lists. If the merged list has exactly three digits, you have a
                triple.
            </HowToStep>
            <HowToStep name="Erase those digits from the rest of the unit">
                Remove all three digits from every other cell in the unit, then rescan for the naked or hidden single the removal usually
                exposes.
            </HowToStep>
        </HowTo>
        <h2>Common mistakes</h2>
        <ul>
            <li>
                Insisting that all three cells show all three candidates. Subsets of the triple are perfectly valid as long as no fourth
                digit appears.
            </li>
            <li>Accepting a union of four digits. Three cells covering four digits proves nothing at all.</li>
            <li>Eliminating from the triple cells. They keep every candidate they had; the rest of the unit loses the three digits.</li>
            <li>
                Overlooking the box. If all three cells also share a box, the same three digits can be cleared from the box as well as from
                the line.
            </li>
        </ul>
        <h2>Naked triple FAQ</h2>
        <FaqPage>
            <Faq>
                <FaqQuestion>Do all three cells need identical candidates?</FaqQuestion>
                <FaqAnswer>
                    No. The shapes 3-3-3, 3-3-2, 3-2-2 and 2-2-2 all work. The only requirement is that the union of the three candidate
                    lists contains exactly three digits.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Can a naked triple be made of three cells with two candidates each?</FaqQuestion>
                <FaqAnswer>
                    Yes, and this is the classic ring shape: 1-2, 2-3 and 1-3. The union is 1, 2 and 3, so the triple is valid even though
                    no cell shows all three digits.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Is a naked triple the same as a hidden triple?</FaqQuestion>
                <FaqAnswer>
                    No. A naked triple is found by looking at cells and counting digits. A hidden triple is found by looking at digits and
                    counting cells, and it removes candidates from the triple cells rather than from their neighbours.
                </FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Why do solvers rank the triple above the pair?</FaqQuestion>
                <FaqAnswer>
                    Because there are far more three-cell combinations to test than two-cell ones. The reasoning is identical, but the
                    search cost is higher, so Suuudokuuu tries pairs first.
                </FaqAnswer>
            </Faq>
        </FaqPage>
        <TechniqueNavigation next={nakedQuadPageMetadata} previous={nakedPairPageMetadata} />
    </main>
);

export default NakedTriplePage;
