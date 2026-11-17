import { solveLinearSystem } from './solve-linear-system.util';

import type { PointInterface } from '../interfaces/point.interface';

export const solveHomography = (source: readonly PointInterface[], target: readonly PointInterface[]): Float64Array | null => {
    const solution = solveLinearSystem(
        source.flatMap((point, index) => {
            const { x, y } = point;
            const projected = target[index];

            return [
                [x, y, 1, 0, 0, 0, -projected.x * x, -projected.x * y, projected.x],
                [0, 0, 0, x, y, 1, -projected.y * x, -projected.y * y, projected.y]
            ];
        })
    );

    return solution === null ? null : Float64Array.from([...solution, 1]);
};
