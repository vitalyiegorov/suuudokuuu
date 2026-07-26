import type { CellTimelineEventInterface, MarkerTimelineEventInterface, PayloadTimelineEventInterface } from '@suuudokuuu/encoder';
import type { SolutionTechniqueEnum } from '@suuudokuuu/solver';

type GameCellTimelineEventInterface = CellTimelineEventInterface & { technique?: SolutionTechniqueEnum };

export type GameTimelineEventInterface = GameCellTimelineEventInterface | PayloadTimelineEventInterface | MarkerTimelineEventInterface;
