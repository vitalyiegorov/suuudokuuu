import { describe, expect, it } from '@jest/globals';
import { Sudoku, createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { isNumber } from '@rnw-community/shared';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { CandidateContext } from '../candidate-context/candidate-context';

import { ChainTechniqueScanner } from './chain-technique.scanner';
import { FishTechniqueScanner } from './fish-technique.scanner';
import { IntersectionTechniqueScanner } from './intersection-technique.scanner';
import { PlacementTechniqueScanner } from './placement-technique.scanner';
import { SubsetTechniqueScanner } from './subset-technique.scanner';
import { WingTechniqueScanner } from './wing-technique.scanner';

import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { CandidateMapType } from '../../../types/candidate-map.type';
import type { CellInterface, FieldInterface } from '@suuudokuuu/generator';

const reservedTechniques = [SolutionTechniqueEnum.SimpleColoring, SolutionTechniqueEnum.AIC];

const coveredTechniques = [
    SolutionTechniqueEnum.Guess,
    SolutionTechniqueEnum.FullHouse,
    SolutionTechniqueEnum.NakedSingle,
    SolutionTechniqueEnum.HiddenSingle,
    SolutionTechniqueEnum.PointingPair,
    SolutionTechniqueEnum.PointingTriple,
    SolutionTechniqueEnum.BoxLineReduction,
    SolutionTechniqueEnum.NakedPair,
    SolutionTechniqueEnum.NakedTriple,
    SolutionTechniqueEnum.NakedQuad,
    SolutionTechniqueEnum.HiddenPair,
    SolutionTechniqueEnum.HiddenTriple,
    SolutionTechniqueEnum.HiddenQuad,
    SolutionTechniqueEnum.XWing,
    SolutionTechniqueEnum.Swordfish,
    SolutionTechniqueEnum.Jellyfish,
    SolutionTechniqueEnum.FinnedXWing,
    SolutionTechniqueEnum.FinnedSwordfish,
    SolutionTechniqueEnum.SashimiXWing,
    SolutionTechniqueEnum.SashimiSwordfish,
    SolutionTechniqueEnum.XYWing,
    SolutionTechniqueEnum.XYZWing,
    SolutionTechniqueEnum.WWing,
    SolutionTechniqueEnum.XChain,
    SolutionTechniqueEnum.XYChain
];

const getCellKey = (cell: CellInterface): string => CandidateContext.getCellKey(cell);

const getSortedTechniques = (techniques: SolutionTechniqueEnum[]): SolutionTechniqueEnum[] =>
    [...techniques].sort((firstTechnique, secondTechnique) => firstTechnique - secondTechnique);

const getNonReservedTechniques = (): SolutionTechniqueEnum[] =>
    Object.values(SolutionTechniqueEnum)
        .filter(isNumber)
        .filter(technique => !reservedTechniques.includes(technique));

const expectTechniqueResult = (
    results: TechniqueResultInterface[],
    expectedResult: { technique: SolutionTechniqueEnum } & Record<string, unknown>
): void => {
    expect(results).toContainEqual(expect.objectContaining(expectedResult));
};

const expectNoTechnique = (results: TechniqueResultInterface[], technique: SolutionTechniqueEnum): void => {
    expect(results.some(result => result.technique === technique)).toBe(false);
};

const createContext = (field: FieldInterface, entries: [CellInterface, number[]][]): CandidateContext => {
    const candidateMap: CandidateMapType = {};

    for (const [cell, candidates] of entries) {
        candidateMap[getCellKey(cell)] = candidates;
    }

    return new CandidateContext(defaultSudokuConfig, field, candidateMap);
};

const createRealContext = (...rows: string[]): CandidateContext => {
    const sudoku = Sudoku.fromStrings(defaultSudokuConfig, ...rows);

    return CandidateContext.fromSudoku(sudoku);
};

describe('technique coverage', () => {
    it('should keep a positive test for every non-reserved technique', () => {
        expect.assertions(1);

        expect(getSortedTechniques(coveredTechniques)).toEqual(getSortedTechniques(getNonReservedTechniques()));
    });
});

describe('PlacementTechniqueScanner', () => {
    it('should find a full house, a naked single and a hidden single on a real board', () => {
        expect.assertions(3);

        const context = createRealContext(
            '.3.678912',
            '672.95348',
            '1983425.7',
            '8597.142.',
            '.268537.1',
            '7.3924856',
            '961537284',
            '287419635',
            '34.286179'
        );
        const results = new PlacementTechniqueScanner().find(context);

        expectTechniqueResult(results, { technique: SolutionTechniqueEnum.FullHouse, cell: { x: 3, y: 1, value: 0, group: 4 }, value: 1 });
        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.NakedSingle,
            cell: { x: 0, y: 4, value: 0, group: 2 },
            value: 4
        });
        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.HiddenSingle,
            cell: { x: 0, y: 0, value: 0, group: 1 },
            value: 5
        });
    });
});

describe('IntersectionTechniqueScanner', () => {
    it('should find a pointing pair elimination on a real board', () => {
        expect.assertions(1);

        const context = createRealContext(
            '534678912',
            '672195348',
            '.9834.567',
            '85.761423',
            '42685379.',
            '..392485.',
            '961537284',
            '2.7419635',
            '3.5286179'
        );
        const results = new IntersectionTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.PointingPair,
            eliminations: expect.arrayContaining([{ cell: { x: 8, y: 5, value: 0, group: 8 }, value: 1 }])
        });
    });

    it('should find a pointing triple elimination on a synthetic board', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [5, 6]],
            [field[0][1], [5, 7]],
            [field[0][2], [5, 8]],
            [field[0][3], [5, 9]]
        ]);
        const results = new IntersectionTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.PointingTriple,
            eliminations: [{ cell: field[0][3], value: 5 }]
        });
    });

    it('should find a box-line reduction elimination on a real board', () => {
        expect.assertions(1);

        const context = createRealContext(
            '53.678912',
            '672195348',
            '19.342567',
            '85.761.23',
            '..6853791',
            '713924856',
            '.61537284',
            '287419635',
            '3.5286179'
        );
        const results = new IntersectionTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.BoxLineReduction,
            eliminations: expect.arrayContaining([{ cell: { x: 2, y: 3, value: 0, group: 2 }, value: 4 }])
        });
    });

    it('should not find a pointing pair when candidates span two rows of the box', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [5, 6]],
            [field[0][1], [5, 7]],
            [field[1][2], [5, 8]],
            [field[0][3], [5, 9]]
        ]);
        const results = new IntersectionTechniqueScanner().find(context);

        expectNoTechnique(results, SolutionTechniqueEnum.PointingPair);
    });
});

describe('SubsetTechniqueScanner', () => {
    it('should find a naked pair elimination on a real board', () => {
        expect.assertions(1);

        const context = createRealContext(
            '.34.7.91.',
            '672195348',
            '.9.34.567',
            '859761423',
            '426.5379.',
            '713924856',
            '961537284',
            '287419635',
            '345286179'
        );
        const results = new SubsetTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.NakedPair,
            eliminations: expect.arrayContaining([{ cell: { x: 3, y: 0, value: 0, group: 4 }, value: 8 }])
        });
    });

    it('should find a hidden pair elimination on a real board', () => {
        expect.assertions(1);

        const context = createRealContext(
            '5.46..912',
            '67219.34.',
            '1983.2567',
            '859761423',
            '4268.3791',
            '713924.56',
            '96153728.',
            '287419635',
            '345286179'
        );
        const results = new SubsetTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.HiddenPair,
            eliminations: expect.arrayContaining([{ cell: { x: 5, y: 1, value: 0, group: 4 }, value: 8 }])
        });
    });

    it('should find a naked triple elimination on a synthetic board', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [1, 2]],
            [field[0][1], [2, 3]],
            [field[0][2], [1, 3]],
            [field[0][3], [1, 4]]
        ]);
        const results = new SubsetTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.NakedTriple,
            eliminations: [{ cell: field[0][3], value: 1 }]
        });
    });

    it('should find a naked quad elimination on a real board', () => {
        expect.assertions(1);

        const context = createRealContext(
            '534678912',
            '.72.9....',
            '.9.342.6.',
            '85976.423',
            '426853.91',
            '7139248.6',
            '.6153728.',
            '287419635',
            '34528617.'
        );
        const results = new SubsetTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.NakedQuad,
            eliminations: expect.arrayContaining([{ cell: { x: 6, y: 1, value: 0, group: 7 }, value: 5 }])
        });
    });

    it('should find a hidden triple elimination on a real board', () => {
        expect.assertions(1);

        const context = createRealContext(
            '.34678912',
            '6.219534.',
            '1.834256.',
            '.59761423',
            '4.68.3791',
            '713924856',
            '.6.53.284',
            '2.741963.',
            '3.528..7.'
        );
        const results = new SubsetTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.HiddenTriple,
            eliminations: expect.arrayContaining([{ cell: { x: 1, y: 8, value: 0, group: 3 }, value: 9 }])
        });
    });

    it('should find a hidden quad elimination on a real board', () => {
        expect.assertions(1);

        const context = createRealContext(
            '534678.12',
            '672195348',
            '1983.25.7',
            '8.9...42.',
            '4268..7.1',
            '.13..4856',
            '961537.84',
            '28.4.9635',
            '345286179'
        );
        const results = new SubsetTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.HiddenQuad,
            eliminations: expect.arrayContaining([{ cell: { x: 4, y: 3, value: 0, group: 5 }, value: 5 }])
        });
    });

    it('should not find a naked pair when one cell gains a third candidate', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [1, 2, 3]],
            [field[0][1], [1, 2]],
            [field[0][2], [1, 4]]
        ]);
        const results = new SubsetTechniqueScanner().find(context);

        expectNoTechnique(results, SolutionTechniqueEnum.NakedPair);
    });
});

describe('FishTechniqueScanner', () => {
    it('should find an X-Wing elimination on a real board', () => {
        expect.assertions(1);

        const context = createRealContext(
            '53467891.',
            '672195.48',
            '1.83.2567',
            '...7..4.3',
            '.2.8.3.91',
            '713924856',
            '..1537284',
            '287419635',
            '345286179'
        );
        const results = new FishTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.XWing,
            eliminations: expect.arrayContaining([{ cell: { x: 1, y: 3, value: 0, group: 2 }, value: 6 }])
        });
    });

    it('should find a Swordfish elimination on a synthetic board', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const entries: [CellInterface, number[]][] = [];

        for (const row of [0, 1, 2]) {
            for (const column of [0, 3, 6]) {
                entries.push([field[row][column], [5, 9]]);
            }
        }
        entries.push([field[3][0], [5, 8]]);
        entries.push([field[3][3], [5, 7]]);
        const context = createContext(field, entries);
        const results = new FishTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.Swordfish,
            eliminations: expect.arrayContaining([{ cell: field[3][0], value: 5 }])
        });
    });

    it('should find a Jellyfish elimination on a synthetic board', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const entries: [CellInterface, number[]][] = [];

        for (const row of [0, 1, 2, 3]) {
            for (const column of [0, 3, 6, 8]) {
                entries.push([field[row][column], [5, 9]]);
            }
        }
        entries.push([field[4][0], [5, 8]]);
        const context = createContext(field, entries);
        const results = new FishTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.Jellyfish,
            eliminations: [{ cell: field[4][0], value: 5 }]
        });
    });

    it('should find a finned X-Wing elimination on a synthetic board', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [5, 6]],
            [field[0][1], [5, 7]],
            [field[0][4], [5, 8]],
            [field[1][0], [5, 6]],
            [field[1][4], [5, 8]],
            [field[2][0], [5, 9]]
        ]);
        const results = new FishTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.FinnedXWing,
            eliminations: [{ cell: field[2][0], value: 5 }]
        });
    });

    it('should find a sashimi X-Wing elimination on a synthetic board', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [5, 6]],
            [field[0][1], [5, 7]],
            [field[1][0], [5, 6]],
            [field[1][4], [5, 8]],
            [field[2][0], [5, 9]]
        ]);
        const results = new FishTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.SashimiXWing,
            eliminations: [{ cell: field[2][0], value: 5 }]
        });
    });

    it('should find a finned Swordfish elimination on a synthetic board', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [5, 9]],
            [field[0][3], [5, 9]],
            [field[0][6], [5, 9]],
            [field[1][0], [5, 9]],
            [field[1][3], [5, 9]],
            [field[1][6], [5, 9]],
            [field[3][0], [5, 9]],
            [field[3][3], [5, 9]],
            [field[3][6], [5, 9]],
            [field[3][7], [5, 9]],
            [field[4][6], [5, 8]]
        ]);
        const results = new FishTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.FinnedSwordfish,
            eliminations: expect.arrayContaining([{ cell: field[4][6], value: 5 }])
        });
    });

    it('should find a sashimi Swordfish elimination on a synthetic board', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [5, 9]],
            [field[1][0], [5, 9]],
            [field[1][3], [5, 9]],
            [field[3][0], [5, 9]],
            [field[3][3], [5, 9]],
            [field[3][6], [5, 9]],
            [field[3][7], [5, 9]],
            [field[4][6], [5, 8]]
        ]);
        const results = new FishTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.SashimiSwordfish,
            eliminations: expect.arrayContaining([{ cell: field[4][6], value: 5 }])
        });
    });

    it('should not find an X-Wing when a base row gains a third occurrence', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [5, 6]],
            [field[0][3], [5, 7]],
            [field[0][5], [5, 8]],
            [field[3][0], [5, 6]],
            [field[3][3], [5, 7]],
            [field[6][0], [5, 9]]
        ]);
        const results = new FishTechniqueScanner().find(context);

        expectNoTechnique(results, SolutionTechniqueEnum.XWing);
    });
});

describe('WingTechniqueScanner', () => {
    it('should find an XY-Wing elimination on a real board', () => {
        expect.assertions(1);

        const context = createRealContext(
            '534.78912',
            '672195.48',
            '198342567',
            '859761.23',
            '42685.791',
            '71392485.',
            '..15.7284',
            '287419.35',
            '.45.8.17.'
        );
        const results = new WingTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.XYWing,
            eliminations: expect.arrayContaining([{ cell: { x: 3, y: 8, value: 0, group: 6 }, value: 6 }])
        });
    });

    it('should find an XYZ-Wing elimination on a synthetic board', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [1, 2, 3]],
            [field[1][1], [3, 4]],
            [field[0][1], [1, 3]],
            [field[1][0], [2, 3]]
        ]);
        const results = new WingTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.XYZWing,
            eliminations: [{ cell: field[1][1], value: 3 }]
        });
    });

    it('should find a W-Wing elimination on a synthetic board', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[3][0], [1, 2]],
            [field[4][4], [1, 2]],
            [field[3][8], [1, 5]],
            [field[4][8], [1, 6]],
            [field[4][0], [2, 9]]
        ]);
        const results = new WingTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.WWing,
            eliminations: [{ cell: field[4][0], value: 2 }]
        });
    });

    it('should not find an XY-Wing when a pincer no longer shares a unique pivot value', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [1, 2]],
            [field[0][4], [1, 2]],
            [field[4][0], [2, 3]]
        ]);
        const results = new WingTechniqueScanner().find(context);

        expectNoTechnique(results, SolutionTechniqueEnum.XYWing);
    });
});

describe('ChainTechniqueScanner', () => {
    it('should find an X-Chain elimination on a synthetic board', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [5, 6]],
            [field[0][3], [5, 7]],
            [field[1][3], [5, 8]],
            [field[1][1], [5, 9]],
            [field[2][2], [5, 4]]
        ]);
        const results = new ChainTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.XChain,
            eliminations: [{ cell: field[2][2], value: 5 }]
        });
    });

    it('should find an XY-Chain elimination on a synthetic board', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [1, 2]],
            [field[0][1], [2, 3]],
            [field[1][1], [1, 3]],
            [field[2][2], [1, 4]]
        ]);
        const results = new ChainTechniqueScanner().find(context);

        expectTechniqueResult(results, {
            technique: SolutionTechniqueEnum.XYChain,
            eliminations: [{ cell: field[2][2], value: 1 }]
        });
    });

    it('should not find an X-Chain when a strong link cell gains a third row occurrence', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const context = createContext(field, [
            [field[0][0], [5, 6]],
            [field[0][3], [5, 7]],
            [field[0][6], [5, 1]],
            [field[1][3], [5, 8]],
            [field[1][1], [5, 9]],
            [field[2][2], [5, 4]]
        ]);
        const results = new ChainTechniqueScanner().find(context);

        expectNoTechnique(results, SolutionTechniqueEnum.XChain);
    });
});
