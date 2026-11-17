import type { GridRecognitionKindEnum } from '../enums/grid-recognition-kind.enum';
import type { GridRegionInterface } from '../interfaces/grid-region.interface';

interface GridNotFoundInterface {
    readonly kind: GridRecognitionKindEnum.GRID_NOT_FOUND;
}

interface LocatedGridInterface {
    readonly kind: GridRecognitionKindEnum.LOCATED;
    readonly closerRegion: GridRegionInterface;
}

interface RecognizedGridInterface {
    readonly kind: GridRecognitionKindEnum.RECOGNIZED;
    readonly puzzleString: string;
    readonly handwritten: readonly boolean[];
    readonly confidences: readonly number[];
    readonly probabilities: readonly (readonly number[] | null)[];
}

export type GridRecognitionType = GridNotFoundInterface | LocatedGridInterface | RecognizedGridInterface;
