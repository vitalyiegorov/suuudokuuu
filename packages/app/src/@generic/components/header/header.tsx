import { Text, type TextProps } from 'react-native';

import { HeaderStyles as styles } from './header.styles';

interface Props extends TextProps {
    readonly text: string;
}

export const Header = ({ text, ...props }: Props) => (
    <Text
        style={styles.container}
        {...props}
    >
        {text}
    </Text>
);
