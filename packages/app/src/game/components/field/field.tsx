import { isEmptyScoredCells } from '@suuudokuuu/generator';
import { type Ref, use, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getCellKey } from '../../../@generic/utils/get-cell-key.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { useCellFontSize } from '../../hooks/use-cell-font-size.hook';
import { gameCandidatesSelector, gameShowAutoCandidatesSelector } from '../../store/game.selectors';
import { gameGetCellKeysToAnimate } from '../../utils/game-get-cell-keys-to-animate.util';
import { FieldCell } from '../field-cell/field-cell';
import { FieldCellCandidates } from '../field-cell-candidates/field-cell-candidates';
import { FieldCellText } from '../field-cell-text/field-cell-text';

import { FieldStyles as styles } from './field.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';

const textAnimationConfig = { duration: 6 * animationDurationConstant };
const FONT_SIZE_MULTIPLIER = 1.5;

export interface FieldRef {
    triggerAnimation: OnEventFn<ScoredCellsInterface>;
}

interface Props {
    readonly cellSize: number;
    readonly selectedCell?: CellInterface;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly ref: Ref<FieldRef>;
}

export const Field = ({ cellSize, selectedCell, onSelect, ref }: Props) => {
    const { sudoku } = use(GameContext);
    const { theme } = use(ThemeContext);

    const showAutoCandidates = useAppSelector(gameShowAutoCandidatesSelector);
    const candidates = useAppSelector(gameCandidatesSelector);
    const fontSize = useCellFontSize(cellSize);

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

    useImperativeHandle(ref, () => ({
        triggerAnimation: (scoredCells: ScoredCellsInterface) => {
            if (isEmptyScoredCells(scoredCells)) {
                return;
            }

            const runAnimation = () => {
                setAnimatedCells(gameGetCellKeysToAnimate(sudoku, scoredCells));

                textAnimation.value = withSequence(withTiming(1, textAnimationConfig), withTiming(0, { duration: 0 }));
            };

            // HINT: We always immediately reset previous animation before starting a new one
            textAnimation.value = withTiming(0, { duration: 0 }, () => {
                scheduleOnRN(runAnimation);
            });
        }
    }));

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
                                cellSize={cellSize}
                                isActive={isActive}
                                isActiveValue={isActiveValue}
                                isEmpty={isEmpty}
                                isHighlighted={isHighlighted}
                                isWrong={isWrong}
                                key={`cell-${cell.y}-${cell.x}`}
                                onSelect={onSelect}
                            >
                                {shouldShowCandidates ? (
                                    <FieldCellCandidates
                                        activeValue={selectedCell?.value}
                                        candidates={cellCandidates}
                                        cellSize={cellSize}
                                    />
                                ) : null}
                                <FieldCellText
                                    cell={cell}
                                    cellSize={cellSize}
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
