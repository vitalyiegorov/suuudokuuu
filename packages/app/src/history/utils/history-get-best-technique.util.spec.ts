import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { historyGetBestTechnique } from './history-get-best-technique.util';

describe('historyGetBestTechnique', () => {
    it('should return undefined when no technique has been used', () => {
        expect.assertions(1);

        expect(historyGetBestTechnique([])).toBeUndefined();
    });

    it('should return the highest-SE technique, assuming the list is already sorted descending', () => {
        expect.assertions(1);

        const usageList = [
            { technique: SolutionTechniqueEnum.XYWing, count: 2, seValue: 4.2 },
            { technique: SolutionTechniqueEnum.FullHouse, count: 5, seValue: 1.0 }
        ];

        expect(historyGetBestTechnique(usageList)).toStrictEqual(usageList[0]);
    });
});
