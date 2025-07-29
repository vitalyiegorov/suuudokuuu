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
}

export const DifficultySelect = ({ onSelect, isLoading = false }: Props) => {
    const { t } = useLingui();

    const handlePress = (difficulty: DifficultyEnum) => () => {
        onSelect(difficulty);
    };

    return (
        <View style={styles.wrapper}>
            <Header text={t`Choose your difficulty`} />

            {Object.values(DifficultyEnum).map(difficulty => (
                <BlackButton
                    isLoading={isLoading}
                    key={difficulty}
                    onPress={handlePress(difficulty)}
                    style={styles.button}
                    text={getDifficultyText(difficulty)}
                />
            ))}
        </View>
    );
};
