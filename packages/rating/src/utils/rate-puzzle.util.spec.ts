import { describe, expect, it } from '@jest/globals';
import { Sudoku } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum, TechniqueManager } from '@suuudokuuu/techniques';

import { seTechniqueOrder } from '../constants/se-technique-order.constant';
import { SE_RATING_CEILING, seTechniqueRatings } from '../constants/se-technique-rating.constant';

import { getStepRating } from './get-step-rating.util';
import { ratePuzzle } from './rate-puzzle.util';

const hiddenSingleBoard = '5..6178.3.19.3264.8364957..421..93.8..51832.4387..6..915.3..9...9.7514.6674.28...';
const nakedSingleBoard = '4..357......4165..3.728964173.92.854.48765.121....376.2196..43.57.19.28...45321..';
const pointingBoard = '..5.1.96.41.....7..79.....3.....86.1.83....95...3....77..5...26.52.87......46.75.';
const nakedPairBoard = '.6.....3..8..9...2..4..6....2..6....4...5.91.......4.7..2.....5.4.........5..17.9';
const xWingBoard = '..3...7......4.2...826.......9..1........5..84...2..9.5....4...16....8.9......6.7';
const aicBoard = '.4...8....1...9..37..6...21...7.........4.65...3.....9.8..9.3.......54....5....7.';
const uniquenessBoard = '.1...2.3..7....4...95.....7.64.9......9..82.......17.......5..1.3..7..2....4.....';
const xyChainBoard = '................12..3..4..............5.1.3...6.27.........358..2......47...9....';
const forcingChainBoard = '000000001000000023004005000000000060000010000037000400000260700050000800200100000';
const stuckInfinityBoard = '800000000003600000070090200050007000000045700000100030001000068008500010090000400';
const solvedBoard = '123456789456789123789123456214365897365897214897214365531642978642978531978531642';

const ratingTimeoutMilliseconds = 30000;

describe('ratePuzzle', () => {
    it('should rate a board that hidden singles alone finish as a hidden single board', () => {
        expect.assertions(1);

        expect(ratePuzzle(hiddenSingleBoard)).toEqual({
            rating: 1.5,
            hardestTechnique: SolutionTechniqueEnum.HiddenSingle,
            isCeiling: false
        });
    });

    it('should rate a board that needs a naked single at the naked single value', () => {
        expect.assertions(1);

        expect(ratePuzzle(nakedSingleBoard)).toEqual({
            rating: 2.3,
            hardestTechnique: SolutionTechniqueEnum.NakedSingle,
            isCeiling: false
        });
    });

    it('should rate a board that needs a pointing pair inside the intersection band', () => {
        expect.assertions(3);

        const result = ratePuzzle(pointingBoard);

        expect(result.rating).toBeGreaterThanOrEqual(seTechniqueRatings[SolutionTechniqueEnum.PointingPair]);
        expect(result.rating).toBeLessThanOrEqual(seTechniqueRatings[SolutionTechniqueEnum.BoxLineReduction]);
        expect(result.hardestTechnique).toBe(SolutionTechniqueEnum.PointingPair);
    });

    it('should rate a board that needs a naked pair at the naked pair value', () => {
        expect.assertions(1);

        expect(ratePuzzle(nakedPairBoard)).toEqual({
            rating: 3.0,
            hardestTechnique: SolutionTechniqueEnum.NakedPair,
            isCeiling: false
        });
    });

    it('should rate a board that needs an X-Wing at the X-Wing value', () => {
        expect.assertions(1);

        expect(ratePuzzle(xWingBoard)).toEqual({
            rating: 3.2,
            hardestTechnique: SolutionTechniqueEnum.XWing,
            isCeiling: false
        });
    });

    it('should report an exact rating when the hardest technique is the top of the chain ladder', () => {
        expect.assertions(2);

        expect(ratePuzzle(aicBoard)).toEqual({
            rating: seTechniqueRatings[SolutionTechniqueEnum.AIC],
            hardestTechnique: SolutionTechniqueEnum.AIC,
            isCeiling: false
        });
        expect(ratePuzzle(aicBoard).rating).toBeLessThan(SE_RATING_CEILING);
    });

    it('should rate a board the ladder could not finish before the uniqueness techniques', () => {
        expect.assertions(4);

        const uniquenessOrder = [
            SolutionTechniqueEnum.UniqueRectangle,
            SolutionTechniqueEnum.BivalueUniversalGrave,
            SolutionTechniqueEnum.NishioForcingChain,
            SolutionTechniqueEnum.CellForcingChain,
            SolutionTechniqueEnum.RegionForcingChain
        ];
        const previousOrder = seTechniqueOrder.filter(technique => !uniquenessOrder.includes(technique));
        const previousResult = new TechniqueManager(Sudoku.fromString(uniquenessBoard)).solveLogically(previousOrder);
        const currentResult = new TechniqueManager(Sudoku.fromString(uniquenessBoard)).solveLogically(seTechniqueOrder);

        expect(previousResult.outcome).toBe('stuck');
        expect(currentResult.outcome).toBe('solved');
        expect(currentResult.steps.some(step => step.technique === SolutionTechniqueEnum.UniqueRectangle)).toBe(true);
        expect(ratePuzzle(uniquenessBoard)).toEqual({
            rating: seTechniqueRatings[SolutionTechniqueEnum.AIC],
            hardestTechnique: SolutionTechniqueEnum.AIC,
            isCeiling: false
        });
    });

    it(
        'should price a chain-rated board above the chain base by its shortest chain length',
        () => {
            expect.assertions(5);

            const result = ratePuzzle(xyChainBoard);
            const solveResult = new TechniqueManager(Sudoku.fromString(xyChainBoard)).solveLogically(seTechniqueOrder);
            const chainSteps = solveResult.steps.filter(step => step.technique === SolutionTechniqueEnum.XYChain);
            const chainRatings = chainSteps.map(step => getStepRating(step));

            expect(result.hardestTechnique).toBe(SolutionTechniqueEnum.XYChain);
            expect(result.isCeiling).toBe(false);
            expect(chainSteps.every(step => step.chainLength === step.reasonCells.length)).toBe(true);
            expect(result.rating).toBeGreaterThan(seTechniqueRatings[SolutionTechniqueEnum.XYChain]);
            expect(result.rating).toBe(Math.max(...chainRatings));
        },
        ratingTimeoutMilliseconds
    );

    it('should take the maximum technique value over the whole solve path', () => {
        expect.assertions(4);

        const result = ratePuzzle(xWingBoard);
        const solveResult = new TechniqueManager(Sudoku.fromString(xWingBoard)).solveLogically(seTechniqueOrder);
        const pathRatings = solveResult.steps.map(step => seTechniqueRatings[step.technique]);

        expect(solveResult.outcome).toBe('solved');
        expect(result.rating).toBe(Math.max(...pathRatings));
        expect(pathRatings.some(pathRating => pathRating < result.rating)).toBe(true);
        expect(solveResult.steps.some(step => step.technique === result.hardestTechnique)).toBe(true);
    });

    it(
        'should report a ceiling rating for an infinity corpus board the ladder cannot finish',
        () => {
            expect.assertions(3);

            const result = ratePuzzle(stuckInfinityBoard);

            expect(result).toEqual({ rating: SE_RATING_CEILING, hardestTechnique: SolutionTechniqueEnum.Guess, isCeiling: true });
            expect(result.rating.toFixed(1)).toBe('8.5');
            expect(new TechniqueManager(Sudoku.fromString(stuckInfinityBoard)).solveLogically(seTechniqueOrder).outcome).toBe('stuck');
        },
        ratingTimeoutMilliseconds
    );

    it(
        'should rate a board only a forcing chain can finish inside the forcing chain band',
        () => {
            expect.assertions(5);

            const forcingOrder = [
                SolutionTechniqueEnum.NishioForcingChain,
                SolutionTechniqueEnum.CellForcingChain,
                SolutionTechniqueEnum.RegionForcingChain
            ];
            const previousOrder = seTechniqueOrder.filter(technique => !forcingOrder.includes(technique));
            const previousResult = new TechniqueManager(Sudoku.fromString(forcingChainBoard)).solveLogically(previousOrder);
            const currentResult = new TechniqueManager(Sudoku.fromString(forcingChainBoard)).solveLogically(seTechniqueOrder);
            const result = ratePuzzle(forcingChainBoard);

            expect(previousResult.outcome).toBe('stuck');
            expect(currentResult.outcome).toBe('solved');
            expect(result.hardestTechnique).toBe(SolutionTechniqueEnum.NishioForcingChain);
            expect(result.isCeiling).toBe(false);
            expect(result.rating).toBeGreaterThanOrEqual(seTechniqueRatings[SolutionTechniqueEnum.NishioForcingChain]);
        },
        ratingTimeoutMilliseconds
    );

    it('should rate an already solved board at the cheapest technique value', () => {
        expect.assertions(1);

        expect(ratePuzzle(solvedBoard)).toEqual({
            rating: 1.0,
            hardestTechnique: SolutionTechniqueEnum.FullHouse,
            isCeiling: false
        });
    });

    it(
        'should return identical results for repeated calls with the same board string',
        () => {
            expect.assertions(3);

            expect(ratePuzzle(xWingBoard)).toEqual(ratePuzzle(xWingBoard));
            expect(ratePuzzle(hiddenSingleBoard)).toEqual(ratePuzzle(hiddenSingleBoard));
            expect(ratePuzzle(stuckInfinityBoard)).toEqual(ratePuzzle(stuckInfinityBoard));
        },
        ratingTimeoutMilliseconds
    );
});
