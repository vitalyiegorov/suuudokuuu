import type { CellInterface } from './cell.interface';
import type { FieldInterface } from './field.interface';
import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

export interface TechniqueResultInterface {
    technique: SolutionTechniqueEnum;
    cell: CellInterface;
    value: number;
}

export interface TechniqueStrategyInterface {
    readonly type: SolutionTechniqueEnum;
    readonly difficulty: number;
    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean;
    findAll(field: FieldInterface): TechniqueResultInterface[];
}
