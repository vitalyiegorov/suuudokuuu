import { SolutionTechniqueEnum, findPlacementChain } from '@suuudokuuu/techniques';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { techniqueResultToStepScript } from './technique-result-to-step-script.util';

import type { StepScriptInterface } from '../interfaces/step-script.interface';
import type { Sudoku } from '@suuudokuuu/generator';
import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const findRevealResults = (sudoku: Sudoku): TechniqueResultInterface[] => {
    const [revealCell] = sudoku.Field.flat()
        .filter(cell => sudoku.isBlankCell(cell))
        .toSorted((left, right) => sudoku.getCellCandidates(left).length - sudoku.getCellCandidates(right).length);

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

export const findHintStepScript = (sudoku: Sudoku): StepScriptInterface | null => {
    const chain = findPlacementChain(sudoku);
    const scripts = (isNotEmptyArray(chain) ? chain : findRevealResults(sudoku)).map(techniqueResultToStepScript);
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
