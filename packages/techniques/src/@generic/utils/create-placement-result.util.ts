import type { SolutionTechniqueEnum } from '../enums/solution-technique.enum';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export const createPlacementResult = (
    technique: SolutionTechniqueEnum,
    cell: CellInterface,
    value: number,
    reasonCells: CellInterface[]
): TechniqueResultInterface => ({
    technique,
    cell,
    value,
    kind: 'placement',
    eliminations: [],
    reasonCells
});
