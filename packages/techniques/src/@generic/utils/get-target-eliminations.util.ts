import { canSee } from './can-see.util';

import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
import type { TechniqueSearchTargetInterface } from '../interfaces/technique-search-target.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export const getTargetEliminations = (
    endpoint: CellInterface,
    target: TechniqueSearchTargetInterface,
    value: number
): CandidateEliminationInterface[] => (canSee(endpoint, target.cell) ? [{ cell: target.cell, value }] : []);
