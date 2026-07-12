import { Pressable } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { getDifficultyText } from '../../../../@generic/utils/get-difficulty-text.util';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly labelStyle: StyleProp<TextStyle>;
    readonly onPress: () => void;
    readonly style: StyleProp<ViewStyle>;
}

export const DifficultyComplexityOption = ({ difficulty, labelStyle, onPress, style }: Props) => (
    <Pressable accessibilityRole="button" onPress={onPress} style={style}>
        <BlackText numberOfLines={1} style={labelStyle}>
            {getDifficultyText(difficulty)}
        </BlackText>
    </Pressable>
);
