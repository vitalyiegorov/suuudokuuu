import { use } from 'react';
import { Text, type TextProps } from 'react-native';

import { ThemeContext } from '../../context/theme.context';

import { HeaderStyles as styles } from './header.styles';

interface Props extends TextProps {
    readonly text: string;
}

export const Header = ({ text, ...props }: Props) => {
    const { theme } = use(ThemeContext);

    return (
        <Text allowFontScaling={false} style={[styles.container, { color: theme.colors.black }]} {...props}>
            {text}
        </Text>
    );
};
