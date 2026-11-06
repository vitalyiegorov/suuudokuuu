import { StyleSheet } from 'react-native-unistyles';

export const ImportBoardCellStyles = StyleSheet.create({
    entry: { fontWeight: '400' },
    clue: { fontWeight: '700' },
    uncertainty: {
        ...StyleSheet.absoluteFill,
        margin: 3,
        borderWidth: 2,
        borderStyle: 'dotted'
    },
    ring: {
        ...StyleSheet.absoluteFill,
        borderWidth: 3
    }
});
