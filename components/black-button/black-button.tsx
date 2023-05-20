import { Pressable, type PressableProps, type StyleProp, Text, type TextProps, type ViewStyle } from 'react-native';

import { BlackButtonStyles as styles } from './black-button.styles';

interface Props extends PressableProps {
    text: string;
    styleText?: TextProps['style'];
}

export const BlackButton = ({ text, style, styleText, ...props }: Props) => {
    const wrapperStyles = [styles.button, style] as StyleProp<ViewStyle>;
    const textStyles = [styles.buttonText, styleText];

    return (
        <Pressable style={wrapperStyles} {...props}>
            <Text style={textStyles}>{text}</Text>
        </Pressable>
    );
};
