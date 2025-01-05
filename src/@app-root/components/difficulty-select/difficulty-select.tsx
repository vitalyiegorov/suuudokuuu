import { View } from 'react-native';

import type { OnEventFn } from '@rnw-community/shared';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { DifficultyEnum } from '../../../@generic/enums/difficulty.enum';

import { DifficultySelectStyles as styles } from './difficulty-select.styles';

interface Props {
    readonly onSelect: OnEventFn<DifficultyEnum>;
}

export const DifficultySelect = ({ onSelect }: Props) => {
    const handlePress = (difficulty: DifficultyEnum) => () => void onSelect(difficulty);

    return (
        <View style={styles.wrapper}>
            {Object.values(DifficultyEnum).map(difficulty => (
                <BlackButton key={difficulty} onPress={handlePress(difficulty)} text={difficulty} />
            ))}
        </View>
    );
};
