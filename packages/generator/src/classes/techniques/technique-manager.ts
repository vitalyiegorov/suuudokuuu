import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { Sudoku } from '../sudoku/sudoku';

import { BaseTechnique } from './base-technique';
import { HiddenSingleGroupTechnique } from './hidden-single-group-technique/hidden-single-group.technique';
import { HiddenSingleLineTechnique } from './hidden-single-line-technique/hidden-single-line.technique';
import { NakedSingleTechnique } from './naked-single-technique/naked-single.technique';

import type { CellInterface } from '../../interfaces/cell.interface';

export class TechniqueManager {
    private readonly techniques: BaseTechnique[];

    constructor(sudoku: Sudoku) {
        this.techniques = [
            new HiddenSingleGroupTechnique(sudoku),
            new HiddenSingleLineTechnique(sudoku),
            new NakedSingleTechnique(sudoku)
        ].sort((techniqueA, techniqueB) => techniqueA.difficulty - techniqueB.difficulty);
    }

    identify(cell: CellInterface): SolutionTechniqueEnum {
        for (const technique of this.techniques) {
            if (technique.getSolution(cell)) {
                return technique.type;
            }
        }

        return SolutionTechniqueEnum.Guess;
    }
}
