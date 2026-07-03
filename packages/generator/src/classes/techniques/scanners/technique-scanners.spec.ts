import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { createEmptyField } from '../../../util/create-empty-field.util';
import { CandidateContext } from '../candidate-context/candidate-context';

import { ChainTechniqueScanner } from './chain-technique.scanner';
import { FishTechniqueScanner } from './fish-technique.scanner';
import { IntersectionTechniqueScanner } from './intersection-technique.scanner';
import { PlacementTechniqueScanner } from './placement-technique.scanner';
import { SubsetTechniqueScanner } from './subset-technique.scanner';
import { WingTechniqueScanner } from './wing-technique.scanner';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';
import type { CandidateMapType } from '../../../types/candidate-map.type';

const getCellKey = (cell: CellInterface): string => CandidateContext.getCellKey(cell);

const createContext = (field: FieldInterface, entries: [CellInterface, number[]][]): CandidateContext => {
    const candidateMap: CandidateMapType = {};

    for (const [cell, candidates] of entries) {
        candidateMap[getCellKey(cell)] = candidates;
    }

    return new CandidateContext(defaultSudokuConfig, field, candidateMap);
};

describe('technique scanners', () => {
    it('should find full house naked single and hidden single placements', () => {
        expect.assertions(3);

        const field = createEmptyField(defaultSudokuConfig);

        for (let index = 0; index < 8; index += 1) {
            field[0][index].value = index + 1;
        }

        const context = createContext(field, [
            [field[0][8], [9]],
            [field[1][0], [4]],
            [field[2][0], [1, 2]],
            [field[2][1], [2, 3]]
        ]);
        const results = new PlacementTechniqueScanner().find(context);

        expect(results).toContainEqual(
            expect.objectContaining({ technique: SolutionTechniqueEnum.FullHouse, cell: field[0][8], value: 9 })
        );
        expect(results).toContainEqual(
            expect.objectContaining({ technique: SolutionTechniqueEnum.NakedSingle, cell: field[1][0], value: 4 })
        );
        expect(results).toContainEqual(
            expect.objectContaining({ technique: SolutionTechniqueEnum.HiddenSingle, cell: field[2][0], value: 1 })
        );
    });

    it('should find pointing and box-line eliminations', () => {
        expect.assertions(2);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [5, 6]],
            [field[0][1], [5, 7]],
            [field[0][3], [5, 8]],
            [field[1][0], [6, 7]],
            [field[1][1], [6, 8]]
        ]);
        const results = new IntersectionTechniqueScanner().find(context);

        expect(results).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.PointingPair,
                eliminations: [{ cell: field[0][3], value: 5 }]
            })
        );
        expect(results.some(result => result.technique === SolutionTechniqueEnum.BoxLineReduction && result.eliminations.length > 0)).toBe(
            true
        );
    });

    it('should find naked and hidden subset eliminations', () => {
        expect.assertions(2);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [1, 2]],
            [field[0][1], [2, 3]],
            [field[0][2], [1, 3]],
            [field[0][3], [1, 4]],
            [field[1][0], [1, 2, 5]],
            [field[1][1], [1, 2, 6]],
            [field[1][2], [7, 8]],
            [field[1][3], [7, 8]],
            [field[1][4], [5, 6, 7, 8, 9]]
        ]);
        const results = new SubsetTechniqueScanner().find(context);

        expect(results).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.NakedTriple,
                eliminations: [{ cell: field[0][3], value: 1 }]
            })
        );
        expect(results).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.HiddenPair,
                eliminations: [
                    { cell: field[1][0], value: 5 },
                    { cell: field[1][1], value: 6 }
                ]
            })
        );
    });

    it('should find fish eliminations', () => {
        expect.assertions(3);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [5, 6]],
            [field[0][2], [5, 7]],
            [field[1][0], [5, 8]],
            [field[1][2], [5, 9]],
            [field[3][0], [5, 6]],
            [field[4][2], [5, 7]],
            [field[2][0], [6, 7]],
            [field[2][2], [6, 8]],
            [field[2][4], [6, 9]],
            [field[3][2], [6, 8]],
            [field[3][4], [6, 9]],
            [field[4][0], [6, 7]],
            [field[4][4], [6, 9]],
            [field[5][0], [6, 7]],
            [field[0][1], [7, 8]],
            [field[0][3], [7, 8]],
            [field[0][5], [7, 8]],
            [field[0][7], [7, 8]],
            [field[1][1], [7, 8]],
            [field[1][3], [7, 8]],
            [field[1][5], [7, 8]],
            [field[1][7], [7, 8]],
            [field[2][1], [7, 8]],
            [field[2][3], [7, 8]],
            [field[2][5], [7, 8]],
            [field[2][7], [7, 8]],
            [field[3][1], [7, 8]],
            [field[3][3], [7, 8]],
            [field[3][5], [7, 8]],
            [field[3][7], [7, 8]],
            [field[4][1], [7, 8]]
        ]);
        const results = new FishTechniqueScanner().find(context);

        expect(results).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.XWing,
                eliminations: [
                    { cell: field[3][0], value: 5 },
                    { cell: field[4][2], value: 5 }
                ]
            })
        );
        expect(results.some(result => result.technique === SolutionTechniqueEnum.Swordfish)).toBe(true);
        expect(results.some(result => result.technique === SolutionTechniqueEnum.Jellyfish)).toBe(true);
    });

    it('should find wing eliminations', () => {
        expect.assertions(3);

        const field = createEmptyField(defaultSudokuConfig);
        const xyWingContext = createContext(field, [
            [field[0][0], [1, 2]],
            [field[0][4], [1, 3]],
            [field[4][0], [2, 3]],
            [field[4][4], [3, 9]]
        ]);
        const xyzWingContext = createContext(field, [
            [field[0][0], [1, 2, 3]],
            [field[1][1], [3, 4]],
            [field[0][1], [1, 3]],
            [field[1][0], [2, 3]]
        ]);
        const wWingContext = createContext(field, [
            [field[3][0], [1, 2]],
            [field[4][4], [1, 2]],
            [field[3][8], [1, 5]],
            [field[4][8], [1, 6]],
            [field[4][0], [2, 9]]
        ]);
        const xyWingResults = new WingTechniqueScanner().find(xyWingContext);
        const xyzWingResults = new WingTechniqueScanner().find(xyzWingContext);
        const wWingResults = new WingTechniqueScanner().find(wWingContext);

        expect(xyWingResults.some(result => result.technique === SolutionTechniqueEnum.XYWing)).toBe(true);
        expect(xyzWingResults.some(result => result.technique === SolutionTechniqueEnum.XYZWing)).toBe(true);
        expect(wWingResults.some(result => result.technique === SolutionTechniqueEnum.WWing)).toBe(true);
    });

    it('should find bounded chain eliminations', () => {
        expect.assertions(3);

        const field = createEmptyField(defaultSudokuConfig);
        const xyChainContext = createContext(field, [
            [field[0][0], [1, 2]],
            [field[0][1], [2, 3]],
            [field[1][1], [1, 3]],
            [field[2][2], [1, 4]]
        ]);
        const xChainContext = createContext(field, [
            [field[0][0], [5, 6]],
            [field[0][3], [5, 7]],
            [field[1][3], [5, 8]],
            [field[1][1], [5, 9]],
            [field[2][2], [5, 4]]
        ]);
        const xyChainResults = new ChainTechniqueScanner().find(xyChainContext);
        const xChainResults = new ChainTechniqueScanner().find(xChainContext);

        expect(xyChainResults.some(result => result.technique === SolutionTechniqueEnum.XYChain)).toBe(true);
        expect(xChainResults.some(result => result.technique === SolutionTechniqueEnum.XChain)).toBe(true);
        expect(xChainResults.some(result => result.technique === SolutionTechniqueEnum.AIC)).toBe(true);
    });
});
