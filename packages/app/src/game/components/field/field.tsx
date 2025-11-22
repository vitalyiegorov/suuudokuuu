import { isEmptyScoredCells } from '@suuudokuuu/generator';
import { use, useEffect, useState } from 'react';
import { View } from 'react-native';
import {
    cancelAnimation,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getCellKey } from '../../../@generic/utils/get-cell-key.util';
import { settingsFontSizeMultiplierSelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { gameCandidatesSelector, gameShowAutoCandidatesSelector } from '../../store/game.selectors';
import { CellFontSizeConstant } from '../constants/dimensions.contant';
import { FieldCell } from '../field-cell/field-cell';
import { FieldCellCandidates } from '../field-cell-candidates/field-cell-candidates';
import { FieldCellText } from '../field-cell-text/field-cell-text';

import { FieldStyles as styles } from './field.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';

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

    const showAutoCandidates = useAppSelector(gameShowAutoCandidatesSelector);
    const candidates = useAppSelector(gameCandidatesSelector);
    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);
    const fontSize = CellFontSizeConstant * fontSizeMultiplier;

    const [animatedCells, setAnimatedCells] = useState(new Set<string>());

    const textAnimation = useSharedValue(0);
    const textAnimatedStyles = useAnimatedStyle(() => ({
        color: interpolateColor(
            textAnimation.value,
            [0, 0.5, 1],
            [theme.colors.black, theme.colors.cell.highlightedText, theme.colors.black]
        ),
        fontSize: interpolate(textAnimation.value, [0, 0.5, 1], [fontSize, fontSize * FONT_SIZE_MULTIPLIER, fontSize]),
        transform: [{ rotate: `${interpolate(textAnimation.value, [0, 1], [0, 360])}deg` }]
    }));

    // TODO: Can we implement this without useEffect?
    useEffect(() => {
        const newAnimatedCells = new Set<string>();
        if (!isEmptyScoredCells(scoredCells)) {
            cancelAnimation(textAnimation);

            sudoku.Field.forEach(row => {
                row.forEach(cell => {
                    if (sudoku.isScoredCell(cell, scoredCells)) {
                        newAnimatedCells.add(getCellKey(cell));
                    }
                });
            });

            setAnimatedCells(newAnimatedCells);

            // eslint-disable-next-line react-hooks/immutability
            textAnimation.value = withSequence(withTiming(1, textAnimationConfig), withTiming(0, { duration: 0 }));
        }
    }, [scoredCells, sudoku, textAnimation]);

    return (
        <View style={styles.wrapper}>
            {sudoku.Field.map(row => (
                <View key={`row-${row[0].y}`} style={styles.row}>
                    {row.map(cell => {
                        const isActive = sudoku.isSameCell(cell, selectedCell);
                        const isActiveValue = sudoku.isSameCellValue(cell, selectedCell);
                        const isHighlighted = sudoku.isCellHighlighted(cell, selectedCell);
                        const isWrong = sudoku.isCellWrong(cell, selectedCell);
                        const isEmpty = sudoku.isBlankCell(cell);

                        const cellCandidates = showAutoCandidates ? sudoku.getCellCandidates(cell) : (candidates[getCellKey(cell)] ?? []);
                        const shouldShowCandidates = isEmpty && cellCandidates.length > 0;

                        return (
                            <FieldCell
                                cell={cell}
                                isActive={isActive}
                                isActiveValue={isActiveValue}
                                isEmpty={isEmpty}
                                isHighlighted={isHighlighted}
                                isWrong={isWrong}
                                key={`cell-${cell.y}-${cell.x}`}
                                onSelect={onSelect}
                            >
                                {shouldShowCandidates ? (
                                    <FieldCellCandidates activeValue={selectedCell?.value} candidates={cellCandidates} />
                                ) : null}
                                <FieldCellText
                                    cell={cell}
                                    hasAnimation={animatedCells.has(getCellKey(cell))}
                                    isActive={isActive}
                                    isActiveValue={isActiveValue}
                                    isEmpty={isEmpty}
                                    isHighlighted={isHighlighted}
                                    showAutoCandidates={shouldShowCandidates}
                                    textAnimatedStyle={textAnimatedStyles}
                                />
                            </FieldCell>
                        );
                    })}
                </View>
            ))}
        </View>
    );
};
