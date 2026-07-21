import { View } from 'react-native';

import { techniqueGlyphConstant } from '../../constants/technique-glyph.constant';

import { TechniqueGlyphStyles as styles } from './technique-glyph.styles';

import type { SolutionTechniqueEnum } from '@suuudokuuu/solver';
import type { ViewStyle } from 'react-native';

const GRID_ROWS = [0, 1, 2];
const GRID_COLUMNS = [0, 1, 2];
const GRID_SIZE = 3;
const DEFAULT_GAP = 2;

interface Props {
    readonly technique: SolutionTechniqueEnum;
    readonly litColor: string;
    readonly dimColor: string;
    readonly size: number;
    readonly gap?: number;
}

export const TechniqueGlyph = ({ technique, litColor, dimColor, size, gap = DEFAULT_GAP }: Props) => {
    const pattern = techniqueGlyphConstant[technique];

    const containerStyle: ViewStyle = { gap, height: size, width: size };
    const rowStyles = [styles.row, { gap }];

    return (
        <View style={containerStyle}>
            {GRID_ROWS.map(row => (
                <View key={row} style={rowStyles}>
                    {GRID_COLUMNS.map(column => {
                        const index = row * GRID_SIZE + column;
                        const cellColor = pattern.includes(index) ? litColor : dimColor;
                        const cellStyle = [styles.cell, { backgroundColor: cellColor }];

                        return <View key={column} style={cellStyle} />;
                    })}
                </View>
            ))}
        </View>
    );
};
