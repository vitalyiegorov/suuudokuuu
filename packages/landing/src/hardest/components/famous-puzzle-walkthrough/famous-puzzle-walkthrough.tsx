import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { SolvePathBuilder } from '../../../solver/classes/solve-path-builder';
import { SolvePathList } from '../../../solver/components/solve-path-list/solve-path-list';
import { getSolvePathTechniques } from '../../../solver/utils/get-solve-path-techniques.util';
import { TechniqueLinkList } from '../../../techniques/components/technique-link-list/technique-link-list';

import type { FamousPuzzleInterface } from '../../interfaces/famous-puzzle.interface';

const FORCING_CHAIN_TECHNIQUES = new Set([
    SolutionTechniqueEnum.NishioForcingChain,
    SolutionTechniqueEnum.CellForcingChain,
    SolutionTechniqueEnum.RegionForcingChain
]);

interface Props {
    puzzle: FamousPuzzleInterface;
}

export const FamousPuzzleWalkthrough = ({ puzzle }: Props) => {
    const { revealedCellCount, steps } = new SolvePathBuilder(puzzle.givens).build();
    const forcingChainStepCount = steps.filter(step => FORCING_CHAIN_TECHNIQUES.has(step.technique)).length;

    return (
        <>
            <p>
                Suuudokuuu’s source-available engine solves {puzzle.name} in {steps.length} steps, reaching for the cheapest technique that
                still makes progress, exactly as it does when it rates a puzzle. {forcingChainStepCount} of those steps are forcing chains:
                the engine assumes a candidate, follows its consequences until something breaks, and removes the assumption. At{' '}
                {revealedCellCount} points even that runs dry — no technique the engine implements moves the grid — and the walkthrough says
                so, fills the cell with the fewest candidates from the verified solution, and carries on with logic from there. Every other
                step is a named deduction you can check by hand.
            </p>
            <p>
                Along the way the walkthrough uses <TechniqueLinkList techniques={getSolvePathTechniques(steps)} />.
            </p>
            <details>
                <summary>Show all {steps.length} steps</summary>
                <SolvePathList steps={steps} />
            </details>
        </>
    );
};
