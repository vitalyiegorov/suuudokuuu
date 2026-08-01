import { canSee } from './can-see.util';

import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
import type { TechniqueSearchTargetInterface } from '../interfaces/technique-search-target.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export const getTargetEliminations = (
    context: CandidateContext,
    endpoint: CellInterface,
    target: TechniqueSearchTargetInterface,
    value: number
): CandidateEliminationInterface[] => (canSee(context, endpoint, target.cell) ? [{ cell: target.cell, value }] : []);
