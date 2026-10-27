import type { GridRecognitionKindEnum } from '../enums/grid-recognition-kind.enum';

interface GridNotFoundInterface {
    readonly kind: GridRecognitionKindEnum.GRID_NOT_FOUND;
}

interface RecognizedGridInterface {
    readonly kind: GridRecognitionKindEnum.RECOGNIZED;
    readonly puzzleString: string;
    readonly confidences: readonly number[];
    readonly alternatives: readonly (number | null)[];
}

export type GridRecognitionType = GridNotFoundInterface | RecognizedGridInterface;
