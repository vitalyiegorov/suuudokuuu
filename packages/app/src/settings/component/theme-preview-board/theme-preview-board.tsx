import { Text, View } from 'react-native';

import { ThemePreviewBoardStyles as styles } from './theme-preview-board.styles';

import type { ThemeInterface } from '@suuudokuuu/ui/theme';

interface Props {
    readonly colors: ThemeInterface['colors'];
    readonly testID?: string;
}

export const ThemePreviewBoard = ({ colors, testID }: Props) => {
    const sampleCells = [
        { backgroundColor: colors.board.filled, color: colors.numpad.text, value: '5' },
        { backgroundColor: colors.surface.subtle, color: colors.surface.subtleText, value: '3' },
        { backgroundColor: colors.board.selected, color: colors.board.selectedText, value: '7' },
        { backgroundColor: colors.board.sameValue, color: colors.board.sameValueText, value: '7' },
        { backgroundColor: colors.board.error, color: colors.dangerText, value: '1' }
    ];
    const sampleNumpadChips = [
        { backgroundColor: colors.numpad.track, color: colors.numpad.text, value: '2' },
        { backgroundColor: colors.numpad.trackFilled, color: colors.numpad.trackFilledText, value: '7' }
    ];
    const containerStyles = [styles.container, { backgroundColor: colors.background }];
    const candidateCellStyles = [styles.cell, { backgroundColor: colors.candidate.fill, borderColor: colors.surface.border }];

    return (
        <View style={containerStyles} testID={testID}>
            <View style={styles.row}>
                {sampleCells.map((cell, cellIndex) => {
                    const cellStyles = [styles.cell, { backgroundColor: cell.backgroundColor, borderColor: colors.surface.border }];
                    const cellTextStyles = [styles.cellText, { color: cell.color }];

                    return (
                        <View key={`cell-${cell.value}-${cellIndex}`} style={cellStyles}>
                            <Text allowFontScaling={false} style={cellTextStyles}>
                                {cell.value}
                            </Text>
                        </View>
                    );
                })}
                <View style={candidateCellStyles}>
                    <View style={styles.candidateGrid}>
                        {['1', '4', '9'].map(candidate => {
                            const candidateTextStyles = [styles.candidateText, { color: colors.candidate.text }];

                            return (
                                <Text allowFontScaling={false} key={candidate} style={candidateTextStyles}>
                                    {candidate}
                                </Text>
                            );
                        })}
                    </View>
                </View>
            </View>

            <View style={styles.row}>
                {sampleNumpadChips.map(chip => {
                    const chipStyles = [styles.numpadChip, { backgroundColor: chip.backgroundColor, borderColor: colors.surface.border }];
                    const chipTextStyles = [styles.cellText, { color: chip.color }];

                    return (
                        <View key={`chip-${chip.value}`} style={chipStyles}>
                            <Text allowFontScaling={false} style={chipTextStyles}>
                                {chip.value}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
