import { useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { View } from 'react-native';

import { BlackButton } from '../black-button/black-button';

import { DifficultySelectStyles as styles } from './difficulty-select.styles';

import type { OnEventFn } from '@rnw-community/shared';

interface Props {
    readonly onSelect: OnEventFn<DifficultyEnum>;
    readonly isLoading?: boolean;
}

export const DifficultySelect = ({ onSelect, isLoading = false }: Props) => {
    const { t } = useLingui();

    const handlePress = (difficulty: DifficultyEnum) => () => {
        onSelect(difficulty);
    };

    const getTitle = (difficulty: DifficultyEnum): string => {
        switch (difficulty) {
            case DifficultyEnum.Easy:
                return t`Easy`;
            case DifficultyEnum.Medium:
                return t`Medium`;
            case DifficultyEnum.Hard:
                return t`Hard`;
            case DifficultyEnum.Newbie:
                return t`Newbie`;
            case DifficultyEnum.Nightmare:
                return t`Nightmare`;
            default:
                return t`Unknown`;
        }
    };

    return (
        <View style={styles.wrapper}>
            {Object.values(DifficultyEnum).map(difficulty => (
                <BlackButton isLoading={isLoading} key={difficulty} onPress={handlePress(difficulty)} text={getTitle(difficulty)} />
            ))}
        </View>
    );
};
