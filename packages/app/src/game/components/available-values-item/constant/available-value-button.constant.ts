import { GameNumberInputButtonSizeConstant } from '../../constants/dimensions.contant';

export const AvailableValueButtonSize = GameNumberInputButtonSizeConstant;
export const AvailableValueProgressStrokeWidth = 3;
export const AvailableValueProgressCenter = AvailableValueButtonSize / 2;
export const AvailableValueProgressRadius = AvailableValueProgressCenter - AvailableValueProgressStrokeWidth / 2;
export const AvailableValueProgressCircumference = 2 * Math.PI * AvailableValueProgressRadius;
export const AvailableValueProgressRingTransform = `rotate(-90,${AvailableValueProgressCenter},${AvailableValueProgressCenter})`;
