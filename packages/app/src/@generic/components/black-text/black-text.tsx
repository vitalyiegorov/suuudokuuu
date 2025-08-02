import { use } from 'react';
import { Text } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { BlackTextStyles } from './black-text.styles';

import type { TextProps } from 'react-native';

export const BlackText = ({ style, ...props }: TextProps) => {
    const { theme } = use(ThemeContext);

    const styles = [BlackTextStyles.container, { color: theme.text.main }, style];

    return <Text allowFontScaling={false} style={styles} {...props} />;
};
