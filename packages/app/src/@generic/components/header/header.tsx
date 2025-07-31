import { use } from 'react';
import { Text, type TextProps } from 'react-native';

import { ThemeContext } from '../../context/theme.context';

import { HeaderStyles as styles } from './header.styles';

interface Props extends TextProps {
    readonly text: string;
}

export const Header = ({ text, style, ...props }: Props) => {
    const { theme } = use(ThemeContext);

    const textStyles = [styles.container, { color: theme.text.main }, style];

    return (
        <Text allowFontScaling={false} style={textStyles} {...props}>
            {text}
        </Text>
    );
};
