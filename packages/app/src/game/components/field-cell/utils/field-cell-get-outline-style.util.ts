import type { FieldCellOutlineStyleParamsInterface } from '../interface/field-cell-outline-style-params.interface';
import type { ViewStyle } from 'react-native';

const ErrorOutlineWidth = 3;

export const fieldCellGetOutlineStyle = ({ isWrong, theme }: FieldCellOutlineStyleParamsInterface): ViewStyle | null =>
    theme.hasErrorOutline && isWrong ? { borderColor: theme.colors.ink, borderWidth: ErrorOutlineWidth } : null;
