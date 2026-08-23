import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import Link from 'next/link';

import { BreadcrumbListItem } from '../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Faq } from '../../seo/components/faq/faq';
import { FaqAnswer } from '../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../seo/components/faq-question/faq-question';
import { PageHeader } from '../../seo/components/page-header/page-header';
import { buildPageMetadata } from '../../seo/utils/build-page-metadata.util';
import { TechniqueLink } from '../../techniques/components/technique-link/technique-link';
import { TechniqueSummary } from '../../techniques/components/technique-summary/technique-summary';
import { getTechniquePageCount } from '../../techniques/utils/get-technique-page-count.util';
import { howToPlayPageMetadata } from '../how-to-play/metadata';
import { homePageMetadata } from '../metadata';
import { aicPageMetadata } from '../techniques/aic/metadata';
import { techniquesPageMetadata } from '../techniques/metadata';

import { glossaryPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(glossaryPageMetadata);

// eslint-disable-next-line max-lines-per-function -- Long-form article copy belongs in the route file
const GlossaryPage = () => (
    <main>
        <PageHeader metadata={glossaryPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Glossary</BreadcrumbListItem>
        </PageHeader>
        <p>
            Sudoku terms are the grid vocabulary — cell, row, column, box, candidate, given — plus every named solving technique, from full
            house to alternating inference chain, that justifies a placement or an elimination. This glossary defines all{' '}
            {getTechniquePageCount()} of those techniques plus the core vocabulary, matching the{' '}
            <Link href={howToPlayPageMetadata.path}>how to play guide</Link> and the{' '}
            <Link href={techniquesPageMetadata.path}>technique index</Link>.
        </p>
        <TechniqueSummary>
            <ul>
                <li>Core grid vocabulary first — cell, row, column, box, unit, candidate, given — then every named solving technique.</li>
                <li>Each entry defines the term in one or two sentences and links to its full guide where one exists.</li>
                <li>The names used here are the names the Suuudokuuu solver prints in its step output.</li>
            </ul>
        </TechniqueSummary>
        <h2>Core vocabulary</h2>
        <dl className="glossary-list">
            <div className="glossary-entry">
                <dt id="cell">Cell</dt>
                <dd>One of the 81 positions in the grid, holding either a filled digit or, while blank, a set of candidates.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="row">Row</dt>
                <dd>One of the nine horizontal lines of nine cells. Every row must contain the digits 1 to 9 exactly once.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="column">Column</dt>
                <dd>One of the nine vertical lines of nine cells. Every column must contain the digits 1 to 9 exactly once.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="box">Box (unit)</dt>
                <dd>One of the nine 3×3 blocks of cells. Unit is the general term for any row, column or box.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="candidate">Candidate (pencil mark)</dt>
                <dd>A digit a blank cell could still legally hold, based on what its row, column and box already contain.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="given">Given (clue)</dt>
                <dd>A digit printed on the board before solving starts, part of what makes one puzzle different from another.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="naked-hidden">Naked / hidden</dt>
                <dd>Naked patterns are visible in a cell’s own candidates; hidden patterns need checking, unit by unit, for a digit.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="elimination">Elimination</dt>
                <dd>Removing a candidate from a cell because a technique has proven it cannot be the answer, without placing a digit.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="unique-solution">Unique solution</dt>
                <dd>The property every well-formed Sudoku has: exactly one completed grid satisfies all three rules given its clues.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="minimal-puzzle">Minimal puzzle (17-clue)</dt>
                <dd>A puzzle with the fewest clues that still has a unique solution — 17 for standard Sudoku.</dd>
            </div>
        </dl>
        <h2>Solving techniques</h2>
        <p>
            Techniques are listed in the difficulty order Suuudokuuu applies them. Every one of them has its own guide with a worked example
            board built from the real solving engine; the definitions below are the quick-reference version of the same list.
        </p>
        <dl className="glossary-list">
            <div className="glossary-entry">
                <dt id="full-house">
                    <TechniqueLink technique={SolutionTechniqueEnum.FullHouse} />
                </dt>
                <dd>The last empty cell in a row, column or box. It must take the one digit that unit is still missing.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="naked-single">
                    <TechniqueLink technique={SolutionTechniqueEnum.NakedSingle} />
                </dt>
                <dd>A cell whose row, column and box between them eliminate every candidate but one.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="hidden-single">
                    <TechniqueLink technique={SolutionTechniqueEnum.HiddenSingle} />
                </dt>
                <dd>A digit that fits in only one cell of a unit, even though that cell still carries other candidates.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="pointing-pair">
                    <TechniqueLink technique={SolutionTechniqueEnum.PointingPair} />
                </dt>
                <dd>A digit confined to two cells of a box sharing a row or column, erased from the rest of that line.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="pointing-triple">
                    <TechniqueLink technique={SolutionTechniqueEnum.PointingTriple} />
                </dt>
                <dd>The same pattern as a pointing pair, with three cells confined to a box-line intersection instead of two.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="box-line-reduction">
                    <TechniqueLink technique={SolutionTechniqueEnum.BoxLineReduction} />
                </dt>
                <dd>The mirror of a pointing pair: a digit confined to one box along a line is erased from the rest of that box.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="naked-pair">
                    <TechniqueLink technique={SolutionTechniqueEnum.NakedPair} />
                </dt>
                <dd>Two cells sharing the same two candidates and nothing else, so both digits are erased elsewhere in the unit.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="naked-triple">
                    <TechniqueLink technique={SolutionTechniqueEnum.NakedTriple} />
                </dt>
                <dd>Three cells in a unit whose candidates together use only three digits.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="naked-quad">
                    <TechniqueLink technique={SolutionTechniqueEnum.NakedQuad} />
                </dt>
                <dd>Four cells in a unit whose candidates together use only four digits.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="hidden-pair">
                    <TechniqueLink technique={SolutionTechniqueEnum.HiddenPair} />
                </dt>
                <dd>Two digits that fit in only two cells of a unit, which reserves those cells for the pair.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="hidden-triple">
                    <TechniqueLink technique={SolutionTechniqueEnum.HiddenTriple} />
                </dt>
                <dd>Three digits confined between them to the same three cells of a unit.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="hidden-quad">
                    <TechniqueLink technique={SolutionTechniqueEnum.HiddenQuad} />
                </dt>
                <dd>Four digits confined between them to the same four cells of a unit.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="x-wing">
                    <TechniqueLink technique={SolutionTechniqueEnum.XWing} />
                </dt>
                <dd>A fish pattern: a digit confined to the same two columns across two rows is erased from the rest of those columns.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="swordfish">
                    <TechniqueLink technique={SolutionTechniqueEnum.Swordfish} />
                </dt>
                <dd>The three-line version of an X-Wing, using three rows and three columns instead of two.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="jellyfish">
                    <TechniqueLink technique={SolutionTechniqueEnum.Jellyfish} />
                </dt>
                <dd>The four-line version of the same fish pattern, using four rows and four columns.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="finned-x-wing">
                    <TechniqueLink technique={SolutionTechniqueEnum.FinnedXWing} />
                </dt>
                <dd>An X-Wing with an extra candidate, called a fin, that still supports a smaller set of eliminations near the fin.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="finned-swordfish">
                    <TechniqueLink technique={SolutionTechniqueEnum.FinnedSwordfish} />
                </dt>
                <dd>A Swordfish pattern with fins, the three-line counterpart to a finned X-Wing.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="sashimi-x-wing">
                    <TechniqueLink technique={SolutionTechniqueEnum.SashimiXWing} />
                </dt>
                <dd>A finned X-Wing where removing the fin cell’s own candidate entirely still leaves a valid, smaller X-Wing behind.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="sashimi-swordfish">
                    <TechniqueLink technique={SolutionTechniqueEnum.SashimiSwordfish} />
                </dt>
                <dd>The same sashimi pattern applied to a Swordfish instead of an X-Wing.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="xy-wing">
                    <TechniqueLink technique={SolutionTechniqueEnum.XYWing} />
                </dt>
                <dd>
                    Three bivalue cells where, whichever value the pivot holds, a shared candidate is erased from cells seeing both others.
                </dd>
            </div>
            <div className="glossary-entry">
                <dt id="xyz-wing">
                    <TechniqueLink technique={SolutionTechniqueEnum.XYZWing} />
                </dt>
                <dd>An XY-Wing where the pivot cell also carries the shared third candidate, which tightens the elimination further.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="w-wing">
                    <TechniqueLink technique={SolutionTechniqueEnum.WWing} />
                </dt>
                <dd>Two cells sharing a candidate pair, linked by a strong link on one digit, that erases the other from shared peers.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="x-chain">
                    <TechniqueLink technique={SolutionTechniqueEnum.XChain} />
                </dt>
                <dd>A chain of strong and weak links on one digit connecting two cells, proving an endpoint of the chain must hold it.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="xy-chain">
                    <TechniqueLink technique={SolutionTechniqueEnum.XYChain} />
                </dt>
                <dd>A chain of bivalue cells linked so the two endpoints force an elimination wherever their shared peers overlap.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="simple-coloring">
                    <TechniqueLink technique={SolutionTechniqueEnum.SimpleColoring} />
                </dt>
                <dd>Assigns two alternating colors to a chain of strong links on one digit, then clears candidates seeing both colors.</dd>
            </div>
            <div className="glossary-entry">
                <dt id="aic">
                    <Link href={aicPageMetadata.path}>AIC (Alternating Inference Chain)</Link>
                </dt>
                <dd>A chain of alternating strong and weak links across candidates, generalising X-Chains, XY-Chains and coloring.</dd>
            </div>
        </dl>
        <FaqPage>
            <FaqHeading>Sudoku glossary FAQ</FaqHeading>
            <Faq>
                <FaqQuestion>What is the difference between naked and hidden in sudoku?</FaqQuestion>
                <FaqAnswer>Naked patterns show directly in a cell’s own candidates; hidden patterns need checking unit by unit.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>Are candidates and pencil marks the same thing?</FaqQuestion>
                <FaqAnswer>Yes. Candidate is the term used here; pencil mark is the traditional paper-solving name for it.</FaqAnswer>
            </Faq>
            <Faq>
                <FaqQuestion>What does “unit” mean in sudoku?</FaqQuestion>
                <FaqAnswer>Unit is the general term for a row, column or box, the groups that each hold 1 to 9 once.</FaqAnswer>
            </Faq>
        </FaqPage>
        <p>
            Ready to put a term into practice? <Link href={howToPlayPageMetadata.path}>Learn how to play</Link> or browse the full{' '}
            <Link href={techniquesPageMetadata.path}>technique index</Link>.
        </p>
    </main>
);

export default GlossaryPage;
