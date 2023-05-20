import { isNotEmptyString } from '@rnw-community/shared';
import { useRouter } from 'expo-router';
import {
    type GestureResponderEvent,
    Pressable,
    type PressableProps,
    type StyleProp,
    Text,
    type TextProps,
    type ViewStyle
} from 'react-native';

import { BlackButtonStyles as styles } from './black-button.styles';

interface Props extends PressableProps {
    text: string;
    styleText?: TextProps['style'];
    href?: string;
}

export const BlackButton = ({ text, style, href, styleText, onPress, ...props }: Props) => {
    const router = useRouter();

    const wrapperStyles = [styles.button, style] as StyleProp<ViewStyle>;
    const textStyles = [styles.buttonText, styleText];

    const handlePress = (event: GestureResponderEvent) => {
        onPress?.(event);

        if (isNotEmptyString(href)) {
            router.push(href);
        }
    };

    return (
        <Pressable style={wrapperStyles} onPress={handlePress} {...props}>
            <Text style={textStyles}>{text}</Text>
        </Pressable>
    );
};
