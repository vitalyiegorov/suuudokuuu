import type { ForcingImplicationKindEnum } from '../enums/forcing-implication-kind.enum';
import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export type ForcingImplicationType =
    | {
          readonly kind: ForcingImplicationKindEnum.ASSIGNMENT;
          readonly cell: CellInterface;
          readonly value: number;
          readonly reasonIndex?: number;
      }
    | {
          readonly kind: ForcingImplicationKindEnum.PEER_REMOVAL;
          readonly cell: CellInterface;
          readonly value: number;
          readonly source: Readonly<CandidateEliminationInterface>;
      }
    | {
          readonly kind: ForcingImplicationKindEnum.NAKED_SINGLE | ForcingImplicationKindEnum.HIDDEN_SINGLE;
          readonly cell: CellInterface;
          readonly value: number;
          readonly supportCells: readonly CellInterface[];
          readonly prefixLength: number;
      };
