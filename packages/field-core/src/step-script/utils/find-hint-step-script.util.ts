import { SolutionTechniqueEnum, createTechniqueStrategies, findPlacementChain } from '@suuudokuuu/techniques';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';

import { techniqueResultToStepScript } from './technique-result-to-step-script.util';

import type { FieldCandidatesType } from '../../field-engine/types/field-candidates.type';
import type { StepScriptCandidateInterface } from '../interfaces/step-script-candidate.interface';
import type { StepScriptInterface } from '../interfaces/step-script.interface';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

const hintEliminationStreakLimit = 6;

export const findRevealStepScript = (
    sudoku: Sudoku,
    eliminatedCandidates: FieldCandidatesType = {},
    targetCell?: CellInterface
): StepScriptInterface | null => {
    const blankCells = sudoku.Field.flat().filter(cell => sudoku.isBlankCell(cell));
    const getCandidateCount = (cell: CellInterface): number =>
        sudoku.getCellCandidates(cell).filter(value => !(eliminatedCandidates[getCellKey(cell)] ?? []).includes(value)).length;
    const getBlankPeerCount = (cell: CellInterface): number =>
        blankCells.filter(peer => peer.x === cell.x || peer.y === cell.y || peer.group === cell.group).length;
    const fewestCandidates = Math.min(...blankCells.map(getCandidateCount));
    const [mostConstrainedCell] = blankCells
        .filter(cell => getCandidateCount(cell) === fewestCandidates)
        .sort((firstCell, secondCell) => getBlankPeerCount(secondCell) - getBlankPeerCount(firstCell));
    const revealCell = sudoku.isBlankCell(targetCell) ? sudoku.Field[targetCell.y][targetCell.x] : mostConstrainedCell;

    return isDefined(revealCell)
        ? techniqueResultToStepScript({
              technique: SolutionTechniqueEnum.Guess,
              cell: revealCell,
              value: sudoku.getCorrectValue(revealCell),
              kind: 'guess',
              eliminations: [],
              reasonCells: [revealCell]
          })
        : null;
};

export const findHintStepScript = (
    sudoku: Sudoku,
    eliminatedCandidates: FieldCandidatesType = {},
    eliminationStreak = 0
): StepScriptInterface | null => {
    const previousEliminations: StepScriptCandidateInterface[] = sudoku.Field.flat()
        .filter(cell => sudoku.isBlankCell(cell))
        .flatMap(cell =>
            (eliminatedCandidates[getCellKey(cell)] ?? [])
                .filter(value => value !== sudoku.getCorrectValue(cell))
                .map(value => ({ cell, value }))
        );
    const chain = findPlacementChain(sudoku, createTechniqueStrategies(), previousEliminations, true);

    if (!isNotEmptyArray(chain)) {
        return findRevealStepScript(sudoku, eliminatedCandidates);
    }

    if (chain[chain.length - 1].kind === 'elimination') {
        return eliminationStreak < hintEliminationStreakLimit
            ? techniqueResultToStepScript(chain[0])
            : findRevealStepScript(sudoku, eliminatedCandidates);
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
