import { DifficultyEnum } from '@suuudokuuu/generator';
import { useState } from 'react';
import { View } from 'react-native';

import { BlackButton } from '../black-button/black-button';

import { DifficultySelectStyles as styles } from './difficulty-select.styles';

import type { OnEventFn } from '@rnw-community/shared';

interface Props {
    readonly onSelect: OnEventFn<DifficultyEnum>;
}

export const DifficultySelect = ({ onSelect }: Props) => {
    const [isLoading, setIsLoading] = useState(false);

    const handlePress = (difficulty: DifficultyEnum) => () => {
        setIsLoading(true);
        onSelect(difficulty);
    };

    return (
        <View style={styles.wrapper}>
            {Object.values(DifficultyEnum).map(difficulty => (
                <BlackButton isLoading={isLoading} key={difficulty} onPress={handlePress(difficulty)} text={difficulty} />
            ))}
        </View>
    );
};
