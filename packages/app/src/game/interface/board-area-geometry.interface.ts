import type { BoardGeometryInterface } from './board-geometry.interface';
import type { LayoutChangeEvent } from 'react-native';

export interface BoardAreaGeometryInterface extends BoardGeometryInterface {
    readonly onBoardAreaLayout: (event: LayoutChangeEvent) => void;
}
