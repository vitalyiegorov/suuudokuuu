import type { BinaryImageInterface } from './binary-image.interface';
import type { GrayImageInterface } from './gray-image.interface';
import type { PointInterface } from './point.interface';

export interface WarpedBoardInterface {
    readonly corners: readonly PointInterface[];
    readonly homography: Float64Array;
    readonly gray: GrayImageInterface;
    readonly mask: BinaryImageInterface;
    readonly isDarkInk: boolean;
}
