import { isDefined } from '@rnw-community/shared';

import { getCommonPeerEliminations } from './get-common-peer-eliminations.util';
import { getTargetEliminations } from './get-target-eliminations.util';
import { isSameCell } from './is-same-cell.util';

import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
import type { TechniqueSearchTargetInterface } from '../interfaces/technique-search-target.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export const getChainEndpointEliminations = (
    context: CandidateContext,
    path: CellInterface[],
    value: number,
    target?: TechniqueSearchTargetInterface
): CandidateEliminationInterface[] => {
    const [firstCell] = path;
    const lastCell = path[path.length - 1];

    if (!isDefined(firstCell) || !isDefined(lastCell)) {
        return [];
    }

    if (target && path.some(cell => isSameCell(cell, target.cell))) {
        return [];
    }

    return target
        ? getTargetEliminations(context, lastCell, target, value)
        : getCommonPeerEliminations(context, [firstCell, lastCell], value, path);
};
