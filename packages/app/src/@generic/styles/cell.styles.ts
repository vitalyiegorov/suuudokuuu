import { StyleSheet } from 'react-native-unistyles';

export const CellStyles = StyleSheet.create(() => ({
    container: (cellSize: number) => ({
        alignItems: 'center',
        borderLeftWidth: 1,
        borderStyle: 'solid',
        borderTopWidth: 1,
        fontFamily: 'Inter_500Medium',
        height: cellSize,
        justifyContent: 'center',
        position: 'relative',
        width: cellSize,
        outlineOffset: 0,
        outlineWidth: 0
    })
}));
