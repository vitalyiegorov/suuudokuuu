import { expect } from '@jest/globals';

import { isDefined } from '@rnw-community/shared';

import { CandidateContext } from '../classes/candidate-context/candidate-context';

import type { TechniqueResultExpectationInterface } from '../interfaces/technique-result-expectation.spec.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { CandidateCoordinateSpecType } from '../types/candidate-coordinate.spec.type';
import type { CellInterface } from '@suuudokuuu/generator';

const sortCoordinates = <Coordinate extends number[]>(coordinates: Coordinate[]): Coordinate[] =>
    [...coordinates].sort((firstCoordinate, secondCoordinate) => {
        for (let coordinateIndex = 0; coordinateIndex < firstCoordinate.length; coordinateIndex += 1) {
            const difference = firstCoordinate[coordinateIndex] - secondCoordinate[coordinateIndex];

            if (difference !== 0) {
                return difference;
            }
        }

        return 0;
    });

const normalizeCandidate = (cell: CellInterface, value: number): CandidateCoordinateSpecType => [cell.y, cell.x, value];

const normalizeReasonCells = (cells: CellInterface[]): [number, number][] => sortCoordinates(cells.map(cell => [cell.y, cell.x]));

const normalizeResult = (result: TechniqueResultInterface): TechniqueResultExpectationInterface => ({
    technique: result.technique,
    kind: result.kind,
    result: normalizeCandidate(result.cell, result.value),
    eliminations: sortCoordinates(result.eliminations.map(elimination => normalizeCandidate(elimination.cell, elimination.value))),
    reasonCells: normalizeReasonCells(result.reasonCells)
});

const normalizeExpectation = (expectation: TechniqueResultExpectationInterface): TechniqueResultExpectationInterface => ({
    ...expectation,
    eliminations: sortCoordinates(expectation.eliminations),
    reasonCells: sortCoordinates(expectation.reasonCells)
});

const sortResults = (results: TechniqueResultExpectationInterface[]): TechniqueResultExpectationInterface[] =>
    [...results].sort((firstResult, secondResult) => {
        const [firstRow, firstColumn, firstValue] = firstResult.result;
        const [secondRow, secondColumn, secondValue] = secondResult.result;

        return firstRow - secondRow || firstColumn - secondColumn || firstValue - secondValue;
    });

const hasUniqueCoordinates = (coordinates: number[][]): boolean => {
    const coordinateKeys = coordinates.map(coordinate => coordinate.join(':'));

    return new Set(coordinateKeys).size === coordinateKeys.length;
};

const validateUniqueEliminations = (eliminations: CandidateCoordinateSpecType[]): void => {
    if (!hasUniqueCoordinates(eliminations)) {
        throw new Error('Technique results cannot report duplicate eliminations');
    }
};

const validateResult = (context: CandidateContext, result: TechniqueResultInterface): void => {
    const reasonCells = result.reasonCells.map(cell => [cell.y, cell.x]);
    const eliminations = result.eliminations.map(elimination => normalizeCandidate(elimination.cell, elimination.value));

    if (reasonCells.length === 0 || !hasUniqueCoordinates(reasonCells)) {
        throw new Error('Technique results must have non-empty unique reason cells');
    }

    validateUniqueEliminations(eliminations);

    if (result.kind === 'placement' || result.kind === 'guess') {
        if (eliminations.length !== 0) {
            throw new Error(`${result.kind} results cannot report eliminations`);
        }
    }

    if (result.kind === 'elimination') {
        if (eliminations.length === 0) {
            throw new Error('Elimination results must report at least one elimination');
        }

        if (JSON.stringify(normalizeCandidate(result.cell, result.value)) !== JSON.stringify(eliminations[0])) {
            throw new Error('Elimination result must equal its first elimination');
        }

        eliminations.forEach(([rowIndex, columnIndex, value]) => {
            const cell = context.getCells().find(candidate => candidate.y === rowIndex && candidate.x === columnIndex);

            if (!isDefined(cell) || !context.getCandidates(cell).includes(value)) {
                throw new Error('Elimination must exist in the candidate context');
            }
        });
    }
};

const validateResults = (context: CandidateContext, results: TechniqueResultInterface[]): void => {
    results.forEach(result => void validateResult(context, result));

    const resultKeys = results.map(result => JSON.stringify(normalizeResult(result)));

    if (new Set(resultKeys).size !== resultKeys.length) {
        throw new Error('Technique results cannot contain exact duplicates');
    }
};

export const expectTechniqueResults = (
    context: CandidateContext,
    results: TechniqueResultInterface[],
    expectations: TechniqueResultExpectationInterface[]
): void => {
    validateResults(context, results);

    expect(sortResults(results.map(result => normalizeResult(result)))).toEqual(
        sortResults(expectations.map(expectation => normalizeExpectation(expectation)))
    );
};
