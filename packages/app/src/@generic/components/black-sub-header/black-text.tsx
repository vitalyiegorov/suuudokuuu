import { use } from 'react';
import { Text } from 'react-native';

import { ThemeContext } from '../../context/theme.context';

import { BlackSubHeaderStyles } from './black-sub-header.styles';

import type { TextProps } from 'react-native';

export const BlackSubHeader = ({ style, ...props }: TextProps) => {
    const { theme } = use(ThemeContext);

    return <Text allowFontScaling={false} style={[BlackSubHeaderStyles.container, { color: theme.colors.black }, style]} {...props} />;
};
