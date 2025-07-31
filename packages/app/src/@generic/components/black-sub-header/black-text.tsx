import { use } from 'react';
import { Text } from 'react-native';

import { ThemeContext } from '../../context/theme.context';

import { BlackSubHeaderStyles } from './black-sub-header.styles';

import type { TextProps } from 'react-native';

export const BlackSubHeader = ({ style, ...props }: TextProps) => {
    const { theme } = use(ThemeContext);

    const styles = [BlackSubHeaderStyles.container, { color: theme.text.main }, style];

    return <Text allowFontScaling={false} style={styles} {...props} />;
};
