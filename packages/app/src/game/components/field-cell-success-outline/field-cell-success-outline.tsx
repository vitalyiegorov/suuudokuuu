import { use } from 'react';
import { View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { FieldCellSuccessOutlineStyles as styles } from './field-cell-success-outline.styles';

export const FieldCellSuccessOutline = () => {
    const { theme } = use(ThemeContext);

    const outlineStyle = [styles.outline, { borderColor: theme.colors.board.selected }];

    return <View accessible={false} aria-hidden pointerEvents="none" style={outlineStyle} />;
};
