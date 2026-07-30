import { Text, View } from 'react-native';

import { ThemePreviewBoardStyles as styles } from './theme-preview-board.styles';

import type { ThemeInterface } from '@suuudokuuu/ui/theme';

interface Props {
    readonly colors: ThemeInterface['colors'];
    readonly testID?: string;
}

export const ThemePreviewBoard = ({ colors, testID }: Props) => {
    const sampleCells = [
        { backgroundColor: colors.cell.filled, color: colors.value.text, value: '5' },
        { backgroundColor: colors.cell.highlighted, color: colors.cell.highlightedText, value: '3' },
        { backgroundColor: colors.cell.active, color: colors.cell.activeText, value: '7' },
        { backgroundColor: colors.cell.activeValue, color: colors.cell.activeValueText, value: '7' },
        { backgroundColor: colors.cell.error, color: colors.redFillText, value: '1' }
    ];
    const sampleNumpadChips = [
        { backgroundColor: colors.value.progress, color: colors.value.text, value: '2' },
        { backgroundColor: colors.value.progressActive, color: colors.value.progressActiveText, value: '7' }
    ];
    const containerStyles = [styles.container, { backgroundColor: colors.background }];
    const candidateCellStyles = [styles.cell, { backgroundColor: colors.candidate.bg, borderColor: colors.candidate.border }];

    return (
        <View style={containerStyles} testID={testID}>
            <View style={styles.row}>
                {sampleCells.map((cell, cellIndex) => {
                    const cellStyles = [styles.cell, { backgroundColor: cell.backgroundColor, borderColor: colors.value.border }];
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
                    const chipStyles = [styles.numpadChip, { backgroundColor: chip.backgroundColor, borderColor: colors.value.border }];
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
