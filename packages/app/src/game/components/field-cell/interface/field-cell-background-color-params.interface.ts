import type { BWDarkTheme } from '../../../../theme/themes/bw.theme';

export interface FieldCellBackgroundColorParamsInterface {
    readonly isActiveValue: boolean;
    readonly isCellHighlighted: boolean;
    readonly isEmpty: boolean;
    readonly isWrong: boolean;
    readonly showAreas: boolean;
    readonly showFilledNumbers: boolean;
    readonly showIdenticalNumbers: boolean;
    readonly theme: typeof BWDarkTheme;
}
