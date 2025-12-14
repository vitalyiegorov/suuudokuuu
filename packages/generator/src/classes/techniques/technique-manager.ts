import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { Sudoku } from '../sudoku/sudoku';

import { BaseTechnique } from './base-technique';
import { FullHouseTechnique } from './full-house-technique/full-house.technique';
import { HiddenSingleGroupTechnique } from './hidden-single-group-technique/hidden-single-group.technique';
import { HiddenSingleLineTechnique } from './hidden-single-line-technique/hidden-single-line.technique';

import type { CellInterface } from '../../interfaces/cell.interface';

export class TechniqueManager {
    private readonly techniques: BaseTechnique[];

    constructor(sudoku: Sudoku) {
        this.techniques = [
            new FullHouseTechnique(sudoku),
            new HiddenSingleGroupTechnique(sudoku),
            new HiddenSingleLineTechnique(sudoku)
        ].sort((techniqueA, techniqueB) => techniqueA.difficulty - techniqueB.difficulty);
    }

    identify(cell: CellInterface, _value: number): SolutionTechniqueEnum {
        for (const technique of this.techniques) {
            if (technique.getSolution(cell)) {
                return technique.type;
            }
        }

        return SolutionTechniqueEnum.Guess;
    }
}
