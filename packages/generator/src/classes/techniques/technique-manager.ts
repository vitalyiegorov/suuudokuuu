import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { Sudoku } from '../sudoku/sudoku';

import { BaseTechnique } from './base-technique';
import { BoxLineReductionTechnique } from './box-line-reduction-technique/box-line-reduction.technique';
import { FullHouseTechnique } from './full-house-technique/full-house.technique';
import { GuessTechnique } from './guess-technique/guess-technique';
import { HiddenPairTechnique } from './hidden-pair-technique/hidden-pair.technique';
import { HiddenQuadTechnique } from './hidden-quad-technique/hidden-quad.technique';
import { HiddenSingleTechnique } from './hidden-single-technique/hidden-single.technique';
import { HiddenTripleTechnique } from './hidden-triple-technique/hidden-triple.technique';
import { JellyfishTechnique } from './jellyfish-technique/jellyfish.technique';
import { NakedPairTechnique } from './naked-pair-technique/naked-pair.technique';
import { NakedQuadTechnique } from './naked-quad-technique/naked-quad.technique';
import { NakedSingleTechnique } from './naked-single-technique/naked-single.technique';
import { NakedTripleTechnique } from './naked-triple-technique/naked-triple.technique';
import { PointingPairTechnique } from './pointing-pair-technique/pointing-pair.technique';
import { SwordfishTechnique } from './swordfish-technique/swordfish.technique';
import { XWingTechnique } from './x-wing-technique/x-wing.technique';
import { XYWingTechnique } from './xy-wing-technique/xy-wing.technique';
import { XYZWingTechnique } from './xyz-wing-technique/xyz-wing.technique';

import type { CellInterface } from '../../interfaces/cell.interface';

export class TechniqueManager {
    private readonly techniques: BaseTechnique[];

    constructor(private readonly sudoku: Sudoku) {
        this.techniques = [
            new FullHouseTechnique(sudoku),
            new NakedSingleTechnique(sudoku),
            new HiddenSingleTechnique(sudoku),
            new NakedPairTechnique(sudoku),
            new HiddenPairTechnique(sudoku),
            new NakedTripleTechnique(sudoku),
            new HiddenTripleTechnique(sudoku),
            new NakedQuadTechnique(sudoku),
            new HiddenQuadTechnique(sudoku),
            new PointingPairTechnique(sudoku),
            new BoxLineReductionTechnique(sudoku),
            new XWingTechnique(sudoku),
            new SwordfishTechnique(sudoku),
            new JellyfishTechnique(sudoku),
            new XYWingTechnique(sudoku),
            new XYZWingTechnique(sudoku),
            new GuessTechnique(sudoku)
        ].sort((techniqueA, techniqueB) => techniqueA.difficulty - techniqueB.difficulty);
    }

    identify(cell: CellInterface, _value: number): SolutionTechniqueEnum {
        const candidates = this.sudoku.getCellCandidates(cell);

        for (const technique of this.techniques) {
            if (technique.canApply(cell, candidates)) {
                return technique.type;
            }
        }

        return SolutionTechniqueEnum.Guess;
    }
}
