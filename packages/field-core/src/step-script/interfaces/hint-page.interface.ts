import type { HintLevelEnum } from '../enums/hint-level.enum';

export interface HintPageInterface {
    readonly hintLevel: HintLevelEnum;
    readonly stepIndex: number;
    readonly revealedImplicationCount: number;
}
