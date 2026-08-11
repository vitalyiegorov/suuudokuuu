import { describe, expect, it } from '@jest/globals';
import { seTechniqueRatings } from '@suuudokuuu/rating';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { historyGetTechniqueUsageList } from './history-get-technique-usage.util';

describe('historyGetTechniqueUsageList', () => {
    it('should return an empty list when no technique has been used', () => {
        expect.assertions(1);

        expect(historyGetTechniqueUsageList({})).toStrictEqual([]);
    });

    it('should omit techniques with a zero or missing count', () => {
        expect.assertions(1);

        const usageList = historyGetTechniqueUsageList({ [SolutionTechniqueEnum.FullHouse]: 0 });

        expect(usageList).toStrictEqual([]);
    });

    it('should sort used techniques by SE value descending', () => {
        expect.assertions(1);

        const usageList = historyGetTechniqueUsageList({
            [SolutionTechniqueEnum.FullHouse]: 5,
            [SolutionTechniqueEnum.XYWing]: 2,
            [SolutionTechniqueEnum.NakedSingle]: 3
        });

        expect(usageList).toStrictEqual([
            { technique: SolutionTechniqueEnum.XYWing, count: 2, seValue: seTechniqueRatings[SolutionTechniqueEnum.XYWing] },
            { technique: SolutionTechniqueEnum.NakedSingle, count: 3, seValue: seTechniqueRatings[SolutionTechniqueEnum.NakedSingle] },
            { technique: SolutionTechniqueEnum.FullHouse, count: 5, seValue: seTechniqueRatings[SolutionTechniqueEnum.FullHouse] }
        ]);
    });

    it('should tie-break equal SE values by ascending technique ordinal', () => {
        expect.assertions(1);

        const usageList = historyGetTechniqueUsageList({
            [SolutionTechniqueEnum.CellForcingChain]: 1,
            [SolutionTechniqueEnum.RegionForcingChain]: 1
        });

        expect(usageList.map(usage => usage.technique)).toStrictEqual([
            SolutionTechniqueEnum.CellForcingChain,
            SolutionTechniqueEnum.RegionForcingChain
        ]);
    });
});
