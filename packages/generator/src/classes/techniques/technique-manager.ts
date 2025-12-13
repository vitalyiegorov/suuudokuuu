import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';

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

    constructor(private readonly config: SudokuConfigInterface = defaultSudokuConfig) {
        this.config = config;
        this.techniques = [
            new FullHouseTechnique(config),
            new NakedSingleTechnique(config),
            new HiddenSingleTechnique(config),
            new NakedPairTechnique(config),
            new HiddenPairTechnique(config),
            new NakedTripleTechnique(config),
            new HiddenTripleTechnique(config),
            new NakedQuadTechnique(config),
            new HiddenQuadTechnique(config),
            new PointingPairTechnique(config),
            new BoxLineReductionTechnique(config),
            new XWingTechnique(config),
            new SwordfishTechnique(config),
            new JellyfishTechnique(config),
            new XYWingTechnique(config),
            new XYZWingTechnique(config),
            new GuessTechnique(config)
        ].sort((techniqueA, techniqueB) => techniqueA.difficulty - techniqueB.difficulty);
    }

    identify(field: FieldInterface, cell: CellInterface, _value: number): SolutionTechniqueEnum {
        const candidates = this.getCellCandidates(field, cell);

        for (const technique of this.techniques) {
            if (technique.canApply(field, cell, candidates)) {
                return technique.type;
            }
        }

        return SolutionTechniqueEnum.Guess;
    }

    findNextStep(field: FieldInterface): TechniqueHint | null {
        for (const technique of this.techniques) {
            if (technique.type === SolutionTechniqueEnum.Guess) {
                continue;
            }

            for (let y = 0; y < this.config.fieldSize; y += 1) {
                for (let x = 0; x < this.config.fieldSize; x += 1) {
                    const cell = field[y][x];

                    if (cell.value !== this.config.blankCellValue) {
                        continue;
                    }

                    const candidates = this.getCellCandidates(field, cell);

                    if (candidates.length === 0) {
                        continue;
                    }

                    const hint = technique.findHint(field, cell, candidates);

                    if (hint) {
                        return hint;
                    }
                }
            }
        }

        return null;
    }

    private getCellCandidates(field: FieldInterface, cell: CellInterface): number[] {
        const candidates: number[] = [];
        const fieldFillingValues = Array.from({ length: this.config.fieldSize }, (_, idx) => idx + 1);

        for (const value of fieldFillingValues) {
            if (this.isValueValid(field, cell, value)) {
                candidates.push(value);
            }
        }

        return candidates;
    }

    private isValueValid(field: FieldInterface, cell: CellInterface, value: number): boolean {
        return (
            this.isValueValidInRow(field, cell.y, value) &&
            this.isValueValidInCol(field, cell.x, value) &&
            this.isValueValidInGroup(field, cell, value)
        );
    }

    private isValueValidInRow(field: FieldInterface, rowIndex: number, value: number): boolean {
        return !field[rowIndex].some(cell => cell.value === value);
    }

    private isValueValidInCol(field: FieldInterface, colIndex: number, value: number): boolean {
        return !field.some(row => row[colIndex].value === value);
    }

    private isValueValidInGroup(field: FieldInterface, targetCell: CellInterface, value: number): boolean {
        const groupStartX = Math.floor(targetCell.x / this.config.fieldGroupWidth) * this.config.fieldGroupWidth;
        const groupStartY = Math.floor(targetCell.y / this.config.fieldGroupHeight) * this.config.fieldGroupHeight;

        for (let yCoord = groupStartY; yCoord < groupStartY + this.config.fieldGroupHeight; yCoord += 1) {
            for (let xCoord = groupStartX; xCoord < groupStartX + this.config.fieldGroupWidth; xCoord += 1) {
                if (field[yCoord][xCoord].value === value) {
                    return false;
                }
            }
        }

        return true;
    }
}
