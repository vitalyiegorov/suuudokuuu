import { use } from 'react';
import { View, useWindowDimensions } from 'react-native';

import { useAppSelector } from '../../../../@generic/hooks/use-app-selector.hook';
import { AvailableValuesItem } from '../../../../game/components/available-values-item/available-values-item';
import { CandidateInputItem } from '../../../../game/components/candidate-input-item/candidate-input-item';
import { GameNumpadDigitsConstant } from '../../../../game/constant/game-numpad-digits.constant';
import { GameContext } from '../../../../game/context/game.context';
import { gameGetRemainingDigitCounts } from '../../../../game/utils/game-get-remaining-digit-counts.util';
import { settingsFontSizeMultiplierSelector, settingsKeySelector } from '../../../../settings/store/settings.selectors';

import { GameNumpadStyles as styles } from './game-numpad.styles';

import type { AvailableValuesItemRef } from '../../../../game/components/available-values-item/available-values-item';
import type { CellInterface } from '@suuudokuuu/generator';

const GameNumpadExhaustedProgress = 100;

interface Props {
    readonly availableValuesRefsHandler: (value: number) => (ref: AvailableValuesItemRef | null) => void;
    readonly onSelectValue: (value: number) => void;
    readonly selectedCell: CellInterface | undefined;
}

export const GameNumpad = ({ availableValuesRefsHandler, onSelectValue, selectedCell }: Props) => {
    const { engine, snapshot } = use(GameContext);
    const { fontScale } = useWindowDimensions();
    const keepExhaustedDigits = useAppSelector(settingsKeySelector('keepExhaustedDigits'));
    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);

    const sudoku = engine.Sudoku;
    const { inputMode } = snapshot;
    const canPress = sudoku.isBlankCell(selectedCell);
    const numpadDigits = keepExhaustedDigits ? GameNumpadDigitsConstant : sudoku.PossibleValues;
    const digitTextStyle = styles.digitText(fontSizeMultiplier, fontScale);
    const remainingDigitCounts = gameGetRemainingDigitCounts(snapshot.field);

    return (
        <View style={styles.numpad}>
            {numpadDigits.map(value => {
                const isExhausted = !sudoku.PossibleValues.includes(value);
                const valueProgress = isExhausted ? GameNumpadExhaustedProgress : sudoku.getValueProgress(value);
                const remaining = remainingDigitCounts.get(value) ?? 0;

                return inputMode === 'candidate' ? (
                    <CandidateInputItem
                        canPress={canPress}
                        digitTextStyle={digitTextStyle}
                        isExhausted={isExhausted}
                        key={`candidate-value-${value}`}
                        onSelect={onSelectValue}
                        remaining={remaining}
                        selectedCell={selectedCell}
                        sizeStyle={styles.digit}
                        value={value}
                    />
                ) : (
                    <AvailableValuesItem
                        canPress={canPress}
                        correctValue={sudoku.getCorrectValue(selectedCell)}
                        digitTextStyle={digitTextStyle}
                        isExhausted={isExhausted}
                        key={`possible-value-${value}`}
                        onSelect={onSelectValue}
                        progress={valueProgress}
                        ref={availableValuesRefsHandler(value)}
                        remaining={remaining}
                        sizeStyle={styles.digit}
                        value={value}
                    />
                );
            })}
        </View>
    );
};
