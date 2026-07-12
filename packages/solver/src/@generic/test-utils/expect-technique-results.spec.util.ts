import { expect } from '@jest/globals';

import type { TechniqueResultExpectationInterface } from '../interfaces/technique-result-expectation.spec.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { CandidateCoordinateSpecType } from '../types/candidate-coordinate.spec.type';
import type { CellInterface } from '@suuudokuuu/generator';

const sortCoordinates = <Coordinate extends number[]>(coordinates: Coordinate[]): Coordinate[] =>
    [...coordinates].sort((firstCoordinate, secondCoordinate) => firstCoordinate.join(':').localeCompare(secondCoordinate.join(':')));

const normalizeCandidate = (cell: CellInterface, value: number): CandidateCoordinateSpecType => [cell.y, cell.x, value];

const getUniqueCoordinates = (coordinates: CandidateCoordinateSpecType[]): CandidateCoordinateSpecType[] => {
    const coordinatesByKey = new Map(coordinates.map(coordinate => [coordinate.join(':'), coordinate]));

    return sortCoordinates([...coordinatesByKey.values()]);
};

const hasValidReasonCells = (results: TechniqueResultInterface[]): boolean =>
    results.every(result => {
        const reasonCellKeys = result.reasonCells.map(cell => `${cell.y}:${cell.x}`);

        return reasonCellKeys.length > 0 && new Set(reasonCellKeys).size === reasonCellKeys.length;
    });

export const expectTechniqueResults = (results: TechniqueResultInterface[], expectation: TechniqueResultExpectationInterface): void => {
    const techniques = [...new Set(results.map(result => result.technique))];
    const kinds = [...new Set(results.map(result => result.kind))];
    const normalizedResults = getUniqueCoordinates(results.map(result => normalizeCandidate(result.cell, result.value)));
    const normalizedEliminations = getUniqueCoordinates(
        results.flatMap(result => result.eliminations.map(elimination => normalizeCandidate(elimination.cell, elimination.value)))
    );

    expect({
        techniques,
        kinds,
        hasValidReasonCells: hasValidReasonCells(results),
        results: normalizedResults,
        eliminations: normalizedEliminations
    }).toEqual({
        techniques: [expectation.technique],
        kinds: ['elimination'],
        hasValidReasonCells: true,
        results: getUniqueCoordinates(expectation.results),
        eliminations: getUniqueCoordinates(expectation.eliminations)
    });
};
