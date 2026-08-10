import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import {
    SE_CHAIN_LENGTH_THRESHOLDS,
    SE_CHAIN_RATING_MAXIMUM,
    SE_FORCING_CHAIN_RATING_MAXIMUM
} from '../constants/se-chain-rating.constant';
import { seTechniqueRatings } from '../constants/se-technique-rating.constant';

import { getStepRating } from './get-step-rating.util';

import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const cell = { x: 0, y: 0, group: 0, value: 0 };

const longestThreshold = SE_CHAIN_LENGTH_THRESHOLDS[SE_CHAIN_LENGTH_THRESHOLDS.length - 1];

const xChainRatingsAtThresholds = ['6.6', '6.7', '6.8', '6.9', '7.0', '7.1', '7.2', '7.3', '7.4', '7.5'];
const xChainRatingsPastThresholds = ['6.7', '6.8', '6.9', '7.0', '7.1', '7.2', '7.3', '7.4', '7.5', '7.6'];
const xyChainRatingsAtThresholds = ['7.0', '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.6', '7.6', '7.6'];
const xyChainRatingsPastThresholds = ['7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.6', '7.6', '7.6', '7.6'];
const nishioRatingsAtThresholds = ['7.5', '7.6', '7.7', '7.8', '7.9', '8.0', '8.1', '8.2', '8.3', '8.4'];
const multipleForcingRatingsAtThresholds = ['8.0', '8.1', '8.2', '8.3', '8.4', '8.5', '8.5', '8.5', '8.5', '8.5'];

const createStep = (technique: SolutionTechniqueEnum, chainLength = 0): TechniqueResultInterface => ({
    technique,
    cell,
    value: 1,
    kind: 'elimination',
    eliminations: [{ cell, value: 1 }],
    reasonCells: [cell],
    ...(chainLength > 0 && { chainLength })
});

const createBandCases = (expectedRatings: string[], lengthOffset: number): [number, string][] =>
    SE_CHAIN_LENGTH_THRESHOLDS.map((threshold, index) => [threshold + lengthOffset, expectedRatings[index]]);

describe('getStepRating', () => {
    it.each(createBandCases(xChainRatingsAtThresholds, 0))('should price an X-Chain of %i cells at %s', (chainLength, expectedRating) => {
        expect.assertions(1);

        expect(getStepRating(createStep(SolutionTechniqueEnum.XChain, chainLength)).toFixed(1)).toBe(expectedRating);
    });

    it.each(createBandCases(xChainRatingsPastThresholds, 1))(
        'should price an X-Chain of %i cells one increment higher at %s',
        (chainLength, expectedRating) => {
            expect.assertions(1);

            expect(getStepRating(createStep(SolutionTechniqueEnum.XChain, chainLength)).toFixed(1)).toBe(expectedRating);
        }
    );

    it.each(createBandCases(xyChainRatingsAtThresholds, 0))('should price an XY-Chain of %i cells at %s', (chainLength, expectedRating) => {
        expect.assertions(1);

        expect(getStepRating(createStep(SolutionTechniqueEnum.XYChain, chainLength)).toFixed(1)).toBe(expectedRating);
    });

    it.each(createBandCases(xyChainRatingsPastThresholds, 1))(
        'should price an XY-Chain of %i cells one increment higher at %s',
        (chainLength, expectedRating) => {
            expect.assertions(1);

            expect(getStepRating(createStep(SolutionTechniqueEnum.XYChain, chainLength)).toFixed(1)).toBe(expectedRating);
        }
    );

    it.each(createBandCases(nishioRatingsAtThresholds, 0))(
        'should price a Nishio forcing chain of %i cells at %s',
        (chainLength, expectedRating) => {
            expect.assertions(1);

            expect(getStepRating(createStep(SolutionTechniqueEnum.NishioForcingChain, chainLength)).toFixed(1)).toBe(expectedRating);
        }
    );

    it.each(createBandCases(multipleForcingRatingsAtThresholds, 0))(
        'should price a cell forcing chain of %i cells at %s',
        (chainLength, expectedRating) => {
            expect.assertions(1);

            expect(getStepRating(createStep(SolutionTechniqueEnum.CellForcingChain, chainLength)).toFixed(1)).toBe(expectedRating);
        }
    );

    it.each(createBandCases(multipleForcingRatingsAtThresholds, 0))(
        'should price a region forcing chain of %i cells at %s',
        (chainLength, expectedRating) => {
            expect.assertions(1);

            expect(getStepRating(createStep(SolutionTechniqueEnum.RegionForcingChain, chainLength)).toFixed(1)).toBe(expectedRating);
        }
    );

    it('should never price a forcing chain above the forcing chain band maximum', () => {
        expect.assertions(3);

        expect(getStepRating(createStep(SolutionTechniqueEnum.NishioForcingChain, longestThreshold * 2))).toBe(
            SE_FORCING_CHAIN_RATING_MAXIMUM
        );
        expect(getStepRating(createStep(SolutionTechniqueEnum.CellForcingChain, longestThreshold * 2))).toBe(
            SE_FORCING_CHAIN_RATING_MAXIMUM
        );
        expect(getStepRating(createStep(SolutionTechniqueEnum.RegionForcingChain, longestThreshold * 2))).toBe(
            SE_FORCING_CHAIN_RATING_MAXIMUM
        );
    });

    it('should carry the cheapest forcing chain base to the forcing band maximum', () => {
        expect.assertions(1);

        expect(getStepRating(createStep(SolutionTechniqueEnum.NishioForcingChain, longestThreshold + 1))).toBe(
            SE_FORCING_CHAIN_RATING_MAXIMUM
        );
    });

    it('should price the shortest possible chain at its technique base value', () => {
        expect.assertions(2);

        const [shortestThreshold] = SE_CHAIN_LENGTH_THRESHOLDS;

        expect(getStepRating(createStep(SolutionTechniqueEnum.XChain, shortestThreshold))).toBe(
            seTechniqueRatings[SolutionTechniqueEnum.XChain]
        );
        expect(getStepRating(createStep(SolutionTechniqueEnum.XYChain, shortestThreshold))).toBe(
            seTechniqueRatings[SolutionTechniqueEnum.XYChain]
        );
    });

    it('should never price a chain above the chain band maximum', () => {
        expect.assertions(2);

        expect(getStepRating(createStep(SolutionTechniqueEnum.XYChain, longestThreshold * 2))).toBe(SE_CHAIN_RATING_MAXIMUM);
        expect(getStepRating(createStep(SolutionTechniqueEnum.XChain, longestThreshold * 2))).toBe(SE_CHAIN_RATING_MAXIMUM);
    });

    it('should grow monotonically with the chain length', () => {
        expect.assertions(1);

        const ratings = Array.from({ length: longestThreshold + 2 }, (_, index) =>
            getStepRating(createStep(SolutionTechniqueEnum.XChain, index + 1))
        );
        const decreasingRatings = ratings.filter((rating, index) => index > 0 && rating < ratings[index - 1]);

        expect(decreasingRatings).toEqual([]);
    });

    it('should fall back to the technique base value when a chain step carries no length', () => {
        expect.assertions(2);

        expect(getStepRating(createStep(SolutionTechniqueEnum.XChain))).toBe(seTechniqueRatings[SolutionTechniqueEnum.XChain]);
        expect(getStepRating(createStep(SolutionTechniqueEnum.XYChain))).toBe(seTechniqueRatings[SolutionTechniqueEnum.XYChain]);
    });

    it('should price techniques outside the length-rated chain band at their flat value', () => {
        expect.assertions(3);

        const [shortestThreshold] = SE_CHAIN_LENGTH_THRESHOLDS;

        expect(getStepRating(createStep(SolutionTechniqueEnum.AIC, shortestThreshold))).toBe(seTechniqueRatings[SolutionTechniqueEnum.AIC]);
        expect(getStepRating(createStep(SolutionTechniqueEnum.SimpleColoring, shortestThreshold))).toBe(
            seTechniqueRatings[SolutionTechniqueEnum.SimpleColoring]
        );
        expect(getStepRating(createStep(SolutionTechniqueEnum.NakedPair))).toBe(seTechniqueRatings[SolutionTechniqueEnum.NakedPair]);
    });
});
