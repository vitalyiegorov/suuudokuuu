import { MaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';
import { Text } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { BlackTextStyles } from './black-text.styles';

import type { TextProps } from 'react-native';

interface Props extends TextProps {}

export const BlackText = ({ style, ...props }: Props) => {
    const { theme } = use(ThemeContext);
    const textStyles = [BlackTextStyles.text, { color: theme.colors.text.primary }, style];

    return <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={textStyles} {...props} />;
};
