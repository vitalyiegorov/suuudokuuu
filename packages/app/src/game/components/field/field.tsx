import { isEmptyScoredCells } from '@suuudokuuu/generator';
import { use, useEffect, useState } from 'react';
import { View } from 'react-native';
import { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { ThemeContext } from '../../../@generic/context/theme.context';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { GameContext } from '../../context/game.context';
import { gameHasCandidatesSelector } from '../../store/game.selectors';
import { CellFontSizeConstant } from '../constants/dimensions.contant';
import { FieldCell } from '../field-cell/field-cell';

import { FieldStyles as styles } from './field.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';

const getCellKey = (cell: CellInterface) => `${cell.y}-${cell.x}`;

const textAnimationConfig = { duration: 6 * animationDurationConstant };
const FONT_SIZE_MULTIPLIER = 1.5;

interface Props {
    readonly selectedCell?: CellInterface;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly scoredCells: ScoredCellsInterface;
}

export const Field = ({ selectedCell, onSelect, scoredCells }: Props) => {
    const { sudoku } = use(GameContext);
    const { theme } = use(ThemeContext);

    const hasCandidates = useAppSelector(gameHasCandidatesSelector);

    const [animatedCells, setAnimatedCells] = useState(new Set<string>());

    const textAnimation = useSharedValue(0);
    const textAnimatedStyles = useAnimatedStyle(() => ({
        color: interpolateColor(
            textAnimation.value,
            [0, 0.5, 1],
            [theme.colors.black, theme.colors.cell.highlightedText, theme.colors.black]
        ),
        fontSize: interpolate(
            textAnimation.value,
            [0, 0.5, 1],
            [CellFontSizeConstant, CellFontSizeConstant * FONT_SIZE_MULTIPLIER, CellFontSizeConstant]
        ),
        transform: [{ rotate: `${interpolate(textAnimation.value, [0, 1], [0, 360])}deg` }]
    }));

    // TODO: Can we implement this without useEffect?
    useEffect(() => {
        const newAnimatedCells = new Set<string>();
        if (!isEmptyScoredCells(scoredCells)) {
            sudoku.Field.forEach(row => {
                row.forEach(cell => {
                    if (sudoku.isScoredCell(cell, scoredCells)) {
                        newAnimatedCells.add(getCellKey(cell));
                    }
                });
            });

            setAnimatedCells(newAnimatedCells);

            textAnimation.value = withSequence(withTiming(1, textAnimationConfig), withTiming(0, { duration: 0 }));
        }
    }, [scoredCells, sudoku, textAnimation]);

    return (
        <View style={styles.wrapper}>
            {sudoku.Field.map(row => (
                <View key={`row-${row[0].y}`} style={styles.row}>
                    {row.map(cell => (
                        <FieldCell
                            cell={cell}
                            hasAnimation={animatedCells.has(getCellKey(cell))}
                            hasCandidates={hasCandidates}
                            isActive={sudoku.isSameCell(cell, selectedCell)}
                            isActiveValue={sudoku.isSameCellValue(cell, selectedCell)}
                            isHighlighted={sudoku.isCellHighlighted(cell, selectedCell)}
                            isWrong={sudoku.isCellWrong(cell, selectedCell)}
                            key={`cell-${cell.y}-${cell.x}`}
                            onSelect={onSelect}
                            textAnimatedStyle={textAnimatedStyles}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};
