import { Pressable, View } from 'react-native';

import { useUiTheme } from '../../theme/hooks/use-ui-theme.hook';

import { AppToggleStyles as styles } from './app-toggle.styles';
import { AppToggleDisabledOpacity } from './constant/app-toggle-disabled-opacity.constant';

interface Props {
    readonly disabled?: boolean;
    readonly onValueChange: (value: boolean) => void;
    readonly testID?: string;
    readonly value: boolean;
}

export const AppToggle = ({ disabled = false, onValueChange, testID, value }: Props) => {
    const { theme } = useUiTheme();
    const handlePress = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };
    const trackColor = value ? theme.colors.black : theme.colors.value.progress;
    const trackStyles = [styles.track, { backgroundColor: trackColor, opacity: disabled ? AppToggleDisabledOpacity : 1 }];
    const thumbStyles = [styles.thumb, { backgroundColor: theme.colors.white }, value ? styles.thumbEnabled : styles.thumbDisabled];
    const accessibilityState = { checked: value, disabled };

    return (
        <Pressable
            accessibilityRole="switch"
            accessibilityState={accessibilityState}
            onPress={handlePress}
            style={styles.pressable}
            testID={testID}
        >
            <View style={trackStyles}>
                <View style={thumbStyles} />
            </View>
        </Pressable>
    );
};
