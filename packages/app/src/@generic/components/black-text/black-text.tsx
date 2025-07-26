import { use } from 'react';
import { Text } from 'react-native';

import { ThemeContext } from '../../context/theme.context';

import { BlackTextStyles } from './black-text.styles';

import type { TextProps } from 'react-native';

export const BlackText = ({ style, ...props }: TextProps) => {
    const { theme } = use(ThemeContext);

    return <Text style={[BlackTextStyles.container, { color: theme.colors.black }, style]} {...props} />;
};
