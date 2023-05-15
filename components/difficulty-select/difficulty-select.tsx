import { type OnEventFn } from '@rnw-community/shared';
import { Pressable, View, Text } from 'react-native';

import { DifficultyEnum } from '../../enums/difficulty.enum';

import { DifficultySelectStyles as styles } from './difficulty-select.styles';

interface Props {
    onSelect: OnEventFn<DifficultyEnum>;
}

export const DifficultySelect = ({ onSelect }: Props) => {
    const handlePress = (difficulty: DifficultyEnum) => () => void onSelect(difficulty);

    return (
        <View style={styles.wrapper}>
            {Object.values(DifficultyEnum).map(difficulty => (
                <Pressable key={difficulty} style={styles.option} onPress={handlePress(difficulty)}>
                    <Text style={styles.optionText}>{difficulty}</Text>
                </Pressable>
            ))}
        </View>
    );
};
