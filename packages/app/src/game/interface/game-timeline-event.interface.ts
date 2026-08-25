import type { CellTimelineEventInterface, MarkerTimelineEventInterface, PayloadTimelineEventInterface } from '@suuudokuuu/encoder';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export type GameCellTimelineEventInterface = CellTimelineEventInterface & { technique?: SolutionTechniqueEnum; score?: number };

export type GameTimelineEventInterface = GameCellTimelineEventInterface | PayloadTimelineEventInterface | MarkerTimelineEventInterface;
