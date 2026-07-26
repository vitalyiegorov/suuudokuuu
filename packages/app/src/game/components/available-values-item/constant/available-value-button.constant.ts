import { PanelControlSizeConstant } from '../../../constant/panel-control-size.constant';

const AvailableValueProgressViewBoxSize = PanelControlSizeConstant;
export const AvailableValueProgressStrokeWidth = 3;
export const AvailableValueProgressCenter = AvailableValueProgressViewBoxSize / 2;
export const AvailableValueProgressRadius = AvailableValueProgressCenter - AvailableValueProgressStrokeWidth / 2;
export const AvailableValueProgressCircumference = 2 * Math.PI * AvailableValueProgressRadius;
export const AvailableValueProgressRingTransform = `rotate(-90,${AvailableValueProgressCenter},${AvailableValueProgressCenter})`;
export const AvailableValueProgressViewBox = `0 0 ${AvailableValueProgressViewBoxSize} ${AvailableValueProgressViewBoxSize}`;
