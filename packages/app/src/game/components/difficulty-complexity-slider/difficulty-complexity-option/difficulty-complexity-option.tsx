import { useLingui } from '@lingui/react/macro';
import { Pressable } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { getDifficultyMessage } from '../../../../@generic/utils/get-difficulty-message.util';

import { DifficultyComplexityOptionSelectors } from './difficulty-complexity-option.selectors';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly labelStyle: StyleProp<TextStyle>;
    readonly onPress: () => void;
    readonly style: StyleProp<ViewStyle>;
}

export const DifficultyComplexityOption = ({ difficulty, labelStyle, onPress, style }: Props) => {
    const { t } = useLingui();

    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress}
            style={style}
            testID={`${DifficultyComplexityOptionSelectors.Option}.${difficulty}`}
        >
            <BlackText numberOfLines={1} style={labelStyle}>
                {t(getDifficultyMessage(difficulty))}
            </BlackText>
        </Pressable>
    );
};
