import type { ColoredComponentInterface } from './colored-component.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export interface ColoringScanInterface extends ColoredComponentInterface {
    readonly adjacencyByKey: Map<string, Set<string>>;
    readonly allCellsByKey: Map<string, CellInterface>;
    readonly pendingKeys: string[];
    readonly visitedKeys: Set<string>;
}
