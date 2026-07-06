import { expect } from '@jest/globals';

import type { TechniqueEliminationExpectationInterface } from '../interfaces/technique-elimination-expectation.spec.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';

export const expectTechniqueElimination = (
    results: TechniqueResultInterface[],
    expectation: TechniqueEliminationExpectationInterface
): void => {
    expect(results).toContainEqual(
        expect.objectContaining({
            technique: expectation.technique,
            eliminations: expect.arrayContaining([
                expect.objectContaining({
                    cell: expect.objectContaining({ x: expectation.columnIndex, y: expectation.rowIndex }),
                    value: expectation.value
                })
            ])
        })
    );
};
