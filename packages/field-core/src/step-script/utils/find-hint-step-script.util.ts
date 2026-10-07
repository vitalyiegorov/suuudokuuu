import { SolutionTechniqueEnum, createTechniqueStrategies, findPlacementChain } from '@suuudokuuu/techniques';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';

import { techniqueResultToStepScript } from './technique-result-to-step-script.util';

import type { FieldCandidatesType } from '../../field-engine/types/field-candidates.type';
import type { StepScriptCandidateInterface } from '../interfaces/step-script-candidate.interface';
import type { StepScriptInterface } from '../interfaces/step-script.interface';
import type { Sudoku } from '@suuudokuuu/generator';
import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const findRevealResults = (sudoku: Sudoku): TechniqueResultInterface[] => {
    const blankCells = sudoku.Field.flat().filter(cell => sudoku.isBlankCell(cell));
    const fewestCandidates = Math.min(...blankCells.map(cell => sudoku.getCellCandidates(cell).length));
    const revealCell = blankCells.find(cell => sudoku.getCellCandidates(cell).length === fewestCandidates);

    return isDefined(revealCell)
        ? [
              {
                  technique: SolutionTechniqueEnum.Guess,
                  cell: revealCell,
                  value: sudoku.getCorrectValue(revealCell),
                  kind: 'guess',
                  eliminations: [],
                  reasonCells: [revealCell]
              }
          ]
        : [];
};

export const findRevealStepScript = (sudoku: Sudoku): StepScriptInterface | null => {
    const [result] = findRevealResults(sudoku);

    return isDefined(result) ? techniqueResultToStepScript(result) : null;
};

export const findHintStepScript = (sudoku: Sudoku, eliminatedCandidates: FieldCandidatesType = {}): StepScriptInterface | null => {
    const previousEliminations: StepScriptCandidateInterface[] = sudoku.Field.flat()
        .filter(cell => sudoku.isBlankCell(cell))
        .flatMap(cell => (eliminatedCandidates[getCellKey(cell)] ?? []).map(value => ({ cell, value })));
    const chain = findPlacementChain(sudoku, createTechniqueStrategies(), previousEliminations, true);

    if (!isNotEmptyArray(chain)) {
        return findRevealStepScript(sudoku);
    }

    if (chain[chain.length - 1].kind === 'elimination') {
        return techniqueResultToStepScript(chain[0]);
    }

    const scripts = chain.map(techniqueResultToStepScript);
    const [firstScript] = scripts;
    const placement = scripts.at(-1)?.placement;

    if (!isDefined(firstScript) || !isDefined(placement)) {
        return null;
    }

    return {
        technique: firstScript.technique,
        patternCells: scripts.flatMap(script => script.patternCells),
        eliminations: scripts.flatMap(script => script.eliminations),
        placement,
        steps: scripts.flatMap(script => script.steps)
    };
};
