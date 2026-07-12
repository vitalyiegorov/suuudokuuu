import { expect } from '@jest/globals';

import { isDefined } from '@rnw-community/shared';

import { CandidateContext } from '../classes/candidate-context/candidate-context';

import type {
    LegacyTechniqueResultExpectationInterface,
    TechniqueResultExpectationInterface
} from '../interfaces/technique-result-expectation.spec.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { CandidateCoordinateSpecType } from '../types/candidate-coordinate.spec.type';
import type { CellInterface } from '@suuudokuuu/generator';

interface ExpectTechniqueResultsInterface {
    (context: CandidateContext, results: TechniqueResultInterface[], expectations: TechniqueResultExpectationInterface[]): void;
    (results: TechniqueResultInterface[], expectation: LegacyTechniqueResultExpectationInterface): void;
}

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

const getUniqueCoordinates = (coordinates: CandidateCoordinateSpecType[]): CandidateCoordinateSpecType[] => {
    const coordinatesByKey = new Map(coordinates.map(coordinate => [coordinate.join(':'), coordinate]));

    return sortCoordinates([...coordinatesByKey.values()]);
};

const expectLegacyTechniqueResults = (
    results: TechniqueResultInterface[],
    expectation: LegacyTechniqueResultExpectationInterface
): void => {
    const techniques = [...new Set(results.map(result => result.technique))];
    const kinds = [...new Set(results.map(result => result.kind))];
    const normalizedResults = getUniqueCoordinates(results.map(result => normalizeCandidate(result.cell, result.value)));
    const normalizedEliminations = getUniqueCoordinates(
        results.flatMap(result => result.eliminations.map(elimination => normalizeCandidate(elimination.cell, elimination.value)))
    );
    const hasValidReasonCells = results.every(result => {
        const reasonCells = result.reasonCells.map(cell => [cell.y, cell.x]);

        return reasonCells.length > 0 && hasUniqueCoordinates(reasonCells);
    });

    expect({ techniques, kinds, hasValidReasonCells, results: normalizedResults, eliminations: normalizedEliminations }).toEqual({
        techniques: [expectation.technique],
        kinds: ['elimination'],
        hasValidReasonCells: true,
        results: getUniqueCoordinates(expectation.results),
        eliminations: getUniqueCoordinates(expectation.eliminations)
    });
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

export const expectTechniqueResults: ExpectTechniqueResultsInterface = (
    contextOrResults: CandidateContext | TechniqueResultInterface[],
    resultsOrExpectation: TechniqueResultInterface[] | LegacyTechniqueResultExpectationInterface,
    expectations?: TechniqueResultExpectationInterface[]
): void => {
    if (contextOrResults instanceof CandidateContext) {
        if (!Array.isArray(resultsOrExpectation) || !isDefined(expectations)) {
            throw new Error('Exact technique expectations require a context, results, and expectations');
        }

        validateResults(contextOrResults, resultsOrExpectation);

        expect(sortResults(resultsOrExpectation.map(result => normalizeResult(result)))).toEqual(
            sortResults(expectations.map(expectation => normalizeExpectation(expectation)))
        );

        return;
    }

    if (Array.isArray(resultsOrExpectation)) {
        throw new Error('Legacy technique expectations require results and one aggregate expectation');
    }

    expectLegacyTechniqueResults(contextOrResults, resultsOrExpectation);
};
