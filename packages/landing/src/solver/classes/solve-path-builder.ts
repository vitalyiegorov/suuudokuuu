import { findRevealStepScript, getCellKey, techniqueResultToStepScript } from '@suuudokuuu/field-core';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { seTechniqueOrder } from '@suuudokuuu/rating';
import { TechniqueManager } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { TECHNIQUE_NAMES } from '../../techniques/constants/technique-name.constant';
import { TECHNIQUE_PAGE_PATHS } from '../../techniques/constants/technique-page-path.constant';
import { formatCellLabel } from '../../techniques/utils/format-cell-label.util';
import { renderTechniqueNarration } from '../../techniques/utils/render-technique-narration.util';

import type { SolvePathInterface } from '../interfaces/solve-path.interface';
import type { SolverStepInterface } from '../interfaces/solver-step.interface';
import type { StepScriptCandidateInterface, StepScriptInterface } from '@suuudokuuu/field-core';
import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const MAX_SOLVE_PATH_STEPS = 600;
const REVEAL_STEP_LABEL = 'Filled from the solution';

type EliminatedCandidatesType = Record<string, number[]>;

const addEliminations = (eliminated: EliminatedCandidatesType, result: TechniqueResultInterface): EliminatedCandidatesType => {
    const nextEliminated = { ...eliminated };

    for (const { cell, value } of result.eliminations) {
        const cellKey = getCellKey(cell);
        const cellEliminations = nextEliminated[cellKey] ?? [];

        if (!cellEliminations.includes(value)) {
            nextEliminated[cellKey] = [...cellEliminations, value];
        }
    }

    return nextEliminated;
};

const isAlreadyShown = (eliminated: EliminatedCandidatesType, result: TechniqueResultInterface): boolean =>
    result.kind === 'elimination' && result.eliminations.every(({ cell, value }) => (eliminated[getCellKey(cell)] ?? []).includes(value));

const narrateScript = (script: StepScriptInterface): string => {
    const lastStep = script.steps.at(-1);

    return isDefined(lastStep) ? renderTechniqueNarration(lastStep) : TECHNIQUE_NAMES[script.technique];
};

const narrateReveal = ({ cell, value }: StepScriptCandidateInterface): string =>
    `No implemented technique proves the next digit here, so ${formatCellLabel(cell)} = ${value} is filled in from the verified solution.`;

export class SolvePathBuilder {
    private readonly sudoku: Sudoku;
    private readonly steps: SolverStepInterface[] = [];
    private eliminated: EliminatedCandidatesType = {};
    private revealedCellCount = 0;

    constructor(puzzle: string) {
        this.sudoku = Sudoku.fromString(puzzle, { ...defaultSudokuConfig });
    }

    build(): SolvePathInterface {
        while (this.steps.length < MAX_SOLVE_PATH_STEPS && this.hasBlankCells()) {
            const { outcome, steps } = new TechniqueManager(this.sudoku).solveLogically(seTechniqueOrder);

            for (const result of steps) {
                this.addTechniqueStep(result);
            }

            if (outcome !== 'solved') {
                this.addRevealStep();
            }
        }

        return { steps: this.steps, revealedCellCount: this.revealedCellCount };
    }

    private hasBlankCells(): boolean {
        return this.sudoku.Field.flat().some(cell => this.sudoku.isBlankCell(cell));
    }

    private addTechniqueStep(result: TechniqueResultInterface): void {
        if (isAlreadyShown(this.eliminated, result)) {
            return;
        }

        const script = techniqueResultToStepScript(result);

        this.pushStep(script, narrateScript(script), TECHNIQUE_NAMES[script.technique]);
        this.eliminated = addEliminations(this.eliminated, result);

        if (result.kind !== 'elimination') {
            this.sudoku.setCellValue({ ...result.cell, value: result.value });
        }
    }

    private addRevealStep(): void {
        const script = findRevealStepScript(this.sudoku, this.eliminated);
        const placement = script?.placement;

        if (!isDefined(script) || !isDefined(placement)) {
            return;
        }

        this.pushStep(script, narrateReveal(placement), REVEAL_STEP_LABEL);
        this.sudoku.setCellValue({ ...placement.cell, value: placement.value });
        this.revealedCellCount += 1;
    }

    private pushStep(script: StepScriptInterface, narration: string, techniqueName: string): void {
        this.steps.push({
            index: this.steps.length,
            technique: script.technique,
            techniqueName,
            techniquePath: TECHNIQUE_PAGE_PATHS[script.technique],
            narration,
            boardBefore: this.sudoku.toString(),
            eliminatedCandidates: this.eliminated,
            script
        });
    }
}
