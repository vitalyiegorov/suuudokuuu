import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum, TechniqueManager, createTechniqueStrategies } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { TECHNIQUE_LADDER } from '../constants/technique-ladder.constant';

import type { LogicalSolveResultInterface } from '../interfaces/logical-solve-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';
import type { TechniqueResultInterface, TechniqueStrategyInterface } from '@suuudokuuu/techniques';

type EliminatedCandidateMapType = Record<string, number[]>;

interface PlacementInterface {
    cell: CellInterface;
    value: number;
}

interface LogicalStepInterface extends PlacementInterface {
    technique: SolutionTechniqueEnum;
}

const BLANK_CELL_VALUE = defaultSudokuConfig.blankCellValue;
const FIELD_SIZE = defaultSudokuConfig.fieldSize;
const EXHAUSTED_STRATEGY_OFFSET = -1;

const getCellKey = (cell: Pick<CellInterface, 'x' | 'y'>): string => `${cell.y}:${cell.x}`;

const getBlankCells = (sudoku: Sudoku): CellInterface[] => sudoku.Field.flatMap(row => row).filter(cell => cell.value === BLANK_CELL_VALUE);

const getRemainingCandidates = (sudoku: Sudoku, cell: CellInterface, eliminated: EliminatedCandidateMapType): number[] => {
    const eliminatedValues = eliminated[getCellKey(cell)] ?? [];

    return sudoku.getCellCandidates(cell).filter(candidate => !eliminatedValues.includes(candidate));
};

const addEliminations = (
    eliminated: EliminatedCandidateMapType,
    eliminations: TechniqueResultInterface['eliminations']
): EliminatedCandidateMapType => {
    const merged: EliminatedCandidateMapType = { ...eliminated };

    for (const elimination of eliminations) {
        const key = getCellKey(elimination.cell);

        merged[key] = [...(merged[key] ?? []), elimination.value];
    }

    return merged;
};

const findNakedSingle = (blankCells: CellInterface[], candidateMap: EliminatedCandidateMapType): PlacementInterface | null => {
    const forcedCell = blankCells.find(cell => candidateMap[getCellKey(cell)].length === 1);

    if (!isDefined(forcedCell)) {
        return null;
    }

    const [value] = candidateMap[getCellKey(forcedCell)];

    return { cell: forcedCell, value };
};

const findHiddenSingle = (blankCells: CellInterface[], candidateMap: EliminatedCandidateMapType): PlacementInterface | null => {
    for (let index = 0; index < FIELD_SIZE; index += 1) {
        const units = [
            blankCells.filter(cell => cell.y === index),
            blankCells.filter(cell => cell.x === index),
            blankCells.filter(cell => cell.group === index)
        ];

        for (const unit of units) {
            for (let value = 1; value <= FIELD_SIZE; value += 1) {
                const holders = unit.filter(cell => candidateMap[getCellKey(cell)].includes(value));
                const [holder] = holders;

                if (holders.length === 1) {
                    return { cell: holder, value };
                }
            }
        }
    }

    return null;
};

const findForcedPlacement = (sudoku: Sudoku, eliminated: EliminatedCandidateMapType): PlacementInterface | null => {
    const blankCells = getBlankCells(sudoku);
    const candidateMap: EliminatedCandidateMapType = {};

    for (const cell of blankCells) {
        candidateMap[getCellKey(cell)] = getRemainingCandidates(sudoku, cell, eliminated);
    }

    return findNakedSingle(blankCells, candidateMap) ?? findHiddenSingle(blankCells, candidateMap);
};

const findStepFromResult = (
    sudoku: Sudoku,
    result: TechniqueResultInterface,
    eliminated: EliminatedCandidateMapType
): LogicalStepInterface | null => {
    if (result.kind === 'placement') {
        return { technique: result.technique, cell: result.cell, value: result.value };
    }

    const placement = findForcedPlacement(sudoku, eliminated);

    return isDefined(placement) ? { technique: result.technique, ...placement } : null;
};

const getNextStrategyOffset = (offset: number, technique: SolutionTechniqueEnum): number => {
    const nextOffset = TECHNIQUE_LADDER.indexOf(technique) + 1;

    return nextOffset > offset ? nextOffset : EXHAUSTED_STRATEGY_OFFSET;
};

const findNextLogicalStep = (sudoku: Sudoku, strategies: TechniqueStrategyInterface[]): LogicalStepInterface | null => {
    let eliminated: EliminatedCandidateMapType = {};
    let offset = 0;

    while (offset >= 0 && offset < strategies.length) {
        const result = new TechniqueManager(sudoku, strategies.slice(offset)).findNextStep();

        if (!isDefined(result) || result.technique === SolutionTechniqueEnum.Guess) {
            return null;
        }

        eliminated = addEliminations(eliminated, result.eliminations);

        const step = findStepFromResult(sudoku, result, eliminated);

        if (isDefined(step)) {
            return step;
        }

        offset = getNextStrategyOffset(offset, result.technique);
    }

    return null;
};

export const solvePuzzleLogically = (puzzleString: string): LogicalSolveResultInterface => {
    const sudoku = Sudoku.fromString(puzzleString, defaultSudokuConfig);
    const strategies = createTechniqueStrategies();
    const usedTechniques = new Set<SolutionTechniqueEnum>();
    let isBeyondTechniqueLadder = false;

    for (let blankCells = getBlankCells(sudoku); blankCells.length > 0; blankCells = getBlankCells(sudoku)) {
        const step = findNextLogicalStep(sudoku, strategies);
        const [firstBlankCell] = blankCells;

        if (isDefined(step)) {
            usedTechniques.add(step.technique);
            sudoku.setCellValue({ ...step.cell, value: step.value });
        } else {
            isBeyondTechniqueLadder = true;
            sudoku.setCellValue({ ...firstBlankCell, value: sudoku.getCorrectValue(firstBlankCell) });
        }
    }

    const requiredTechniques = TECHNIQUE_LADDER.filter(technique => usedTechniques.has(technique));

    return {
        requiredTechniques,
        hardestTechnique: requiredTechniques.at(-1) ?? SolutionTechniqueEnum.Guess,
        isBeyondTechniqueLadder
    };
};
