import { useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { Header } from '../../../@generic/components/header/header';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';

import { DifficultySelectStyles as styles } from './difficulty-select.styles';

import type { OnEventFn } from '@rnw-community/shared';

interface Props {
    readonly onSelect: OnEventFn<DifficultyEnum>;
    readonly isLoading?: boolean;
    readonly hellPuzzlesCount?: number;
}

export const DifficultySelect = ({ onSelect, isLoading = false, hellPuzzlesCount = 0 }: Props) => {
    const { t } = useLingui();

    const handlePress = (difficulty: DifficultyEnum) => () => {
        onSelect(difficulty);
    };

    const difficulties = Object.values(DifficultyEnum).filter(difficulty => {
        // Only show Hell if there are puzzles available
        if (difficulty === DifficultyEnum.Hell) {
            return hellPuzzlesCount > 0;
        }
        
return true;
    });

    return (
        <View style={styles.wrapper}>
            <Header text={t`Choose your difficulty`} />

            {difficulties.map(difficulty => {
                const isHell = difficulty === DifficultyEnum.Hell;
                const text = isHell ? `${getDifficultyText(difficulty)} (${hellPuzzlesCount})` : getDifficultyText(difficulty);

                return (
                    <BlackButton
                        isLoading={isLoading}
                        key={difficulty}
                        onPress={handlePress(difficulty)}
                        style={styles.button}
                        text={text}
                    />
                );
            })}
        </View>
    );
};
