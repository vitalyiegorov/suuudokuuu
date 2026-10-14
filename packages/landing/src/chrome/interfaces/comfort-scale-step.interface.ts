import type { ComfortScaleStepEnum } from '../enums/comfort-scale-step.enum';

export interface ComfortScaleStepInterface {
    id: ComfortScaleStepEnum;
    symbol: string;
    scale: number;
}
