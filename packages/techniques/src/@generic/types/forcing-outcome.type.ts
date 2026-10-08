import type { ForcingOutcomeKindEnum } from '../enums/forcing-outcome-kind.enum';
import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export type ForcingContradictionType =
    | { readonly kind: ForcingOutcomeKindEnum.EMPTY_CELL; readonly cell: CellInterface }
    | { readonly kind: ForcingOutcomeKindEnum.NO_POSITION; readonly unitCells: readonly CellInterface[]; readonly value: number }
    | { readonly kind: ForcingOutcomeKindEnum.ASSIGNMENT_CONFLICT; readonly cell: CellInterface; readonly value: number };

export type ForcingOutcomeType =
    | ForcingContradictionType
    | { readonly kind: ForcingOutcomeKindEnum.COMMON_PLACEMENT; readonly cell: CellInterface; readonly value: number }
    | { readonly kind: ForcingOutcomeKindEnum.COMMON_ELIMINATIONS; readonly eliminations: readonly CandidateEliminationInterface[] };
