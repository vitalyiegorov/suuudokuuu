import { cs, type OnEventFn } from '@rnw-community/shared';
import { Pressable, Text, View } from 'react-native';

import { AvailableValuesItemStyles as styles } from './available-values-item.styles';

interface Props {
    value: number;
    isActive: boolean;
    progress: number;
    onSelect: OnEventFn<number>;
}

// TODO: Add animation when wrong value is selected
// TODO: Add animation when correct value is selected
export const AvailableValuesItem = ({ value, isActive, onSelect, progress }: Props) => {
    const handlePress = () => onSelect(value);

    const buttonStyles = [styles.button, cs(isActive, styles.wrapperActive)];
    const textStyles = [styles.text, cs(isActive, styles.textActive)];
    const progressStyles = [styles.progress, { width: `${progress}%` }];

    return (
        <View style={styles.container}>
            <Pressable key={value} style={buttonStyles} onPress={handlePress}>
                <Text style={textStyles}>{value}</Text>
            </Pressable>
            <View style={progressStyles} />
        </View>
    );
};
