import type { BWDarkTheme } from '../../../../theme/themes/bw.theme';

export interface FieldCellBackgroundColorParamsInterface {
    readonly isActive: boolean;
    readonly isActiveValue: boolean;
    readonly isCellHighlighted: boolean;
    readonly isEmpty: boolean;
    readonly isPatternCell: boolean;
    readonly isTargetCell: boolean;
    readonly isWrong: boolean;
    readonly showAreas: boolean;
    readonly showFilledNumbers: boolean;
    readonly showIdenticalNumbers: boolean;
    readonly theme: typeof BWDarkTheme;
}
