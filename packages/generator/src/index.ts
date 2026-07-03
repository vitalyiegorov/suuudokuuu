export type { CellInterface } from './interfaces/cell.interface';
export type { ScoredCellsInterface } from './interfaces/scored-cells.interface';
export type { FieldInterface } from './interfaces/field.interface';
export type { SudokuConfigInterface } from './interfaces/sudoku-config.interface';

export type { AvailableValuesType } from './types/available-values.type';

export type { TechniqueResultInterface } from './interfaces/technique-result.interface';
export type { CandidateEliminationInterface } from './interfaces/candidate-elimination.interface';
export type { CandidatePlacementInterface } from './interfaces/candidate-placement.interface';
export type { CandidateUnitInterface } from './interfaces/candidate-unit.interface';
export type { CandidateMapType } from './types/candidate-map.type';
export type { TechniqueResultKindType } from './types/technique-result-kind.type';

export { DifficultyEnum } from './enums/difficulty.enum';
export { SolutionTechniqueEnum } from './enums/solution-technique.enum';

export { Sudoku } from './classes/sudoku/sudoku';
export { TechniqueManager } from './classes/techniques/technique-manager';
export { defaultSudokuConfig } from './interfaces/sudoku-config.interface';
export { emptyScoredCells, isEmptyScoredCells } from './interfaces/scored-cells.interface';
