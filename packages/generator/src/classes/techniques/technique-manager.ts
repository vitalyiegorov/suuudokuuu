import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';
import { Sudoku } from '../sudoku/sudoku';

import { BaseTechnique, TechniqueHint } from './base-technique';
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
import type { FieldInterface } from '../../interfaces/field.interface';
import type { SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';

export class TechniqueManager {
    private readonly techniques: BaseTechnique[];
    private readonly sudoku: Sudoku;

    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        this.sudoku = new Sudoku(config);
        this.techniques = [
            new FullHouseTechnique(this.sudoku),
            new NakedSingleTechnique(this.sudoku),
            new HiddenSingleTechnique(this.sudoku),
            new NakedPairTechnique(this.sudoku),
            new HiddenPairTechnique(this.sudoku),
            new NakedTripleTechnique(this.sudoku),
            new HiddenTripleTechnique(this.sudoku),
            new NakedQuadTechnique(this.sudoku),
            new HiddenQuadTechnique(this.sudoku),
            new PointingPairTechnique(this.sudoku),
            new BoxLineReductionTechnique(this.sudoku),
            new XWingTechnique(this.sudoku),
            new SwordfishTechnique(this.sudoku),
            new JellyfishTechnique(this.sudoku),
            new XYWingTechnique(this.sudoku),
            new XYZWingTechnique(this.sudoku),
            new GuessTechnique(this.sudoku)
        ].sort((techniqueA, techniqueB) => techniqueA.difficulty - techniqueB.difficulty);
    }

    identify(field: FieldInterface, cell: CellInterface, _value: number): SolutionTechniqueEnum {
        const candidates = this.sudoku.getCellCandidates(cell);

        for (const technique of this.techniques) {
            if (technique.canApply(field, cell, candidates)) {
                return technique.type;
            }
        }

        return SolutionTechniqueEnum.Guess;
    }

    findNextStep(field: FieldInterface): TechniqueHint | null {
        const config = this.sudoku.Config;
        for (const technique of this.techniques) {
            if (technique.type === SolutionTechniqueEnum.Guess) {
                continue;
            }

            for (let y = 0; y < config.fieldSize; y += 1) {
                for (let x = 0; x < config.fieldSize; x += 1) {
                    const cell = field[y][x];

                    if (cell.value !== config.blankCellValue) {
                        continue;
                    }

                    const candidates = this.sudoku.getCellCandidates(cell);

                    if (candidates.length === 0) {
                        continue;
                    }

                    if (technique.canApply(field, cell, candidates)) {
                        return {
                            technique: technique.type,
                            cell,
                            value: candidates[0]
                        };
                    }
                }
            }
        }

        return null;
    }
}
