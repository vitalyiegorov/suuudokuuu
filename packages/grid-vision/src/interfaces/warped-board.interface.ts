import type { BinaryImageInterface } from './binary-image.interface';

export interface WarpedBoardInterface {
    readonly homography: Float64Array;
    readonly mask: BinaryImageInterface;
    readonly isDarkInk: boolean;
}
