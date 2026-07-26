import { StyleSheet } from 'react-native-unistyles';

export const CellStyles = StyleSheet.create(theme => ({
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
        outlineWidth: 0,
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            },
            '_focus-visible': {
                outlineColor: theme.colors.black,
                outlineOffset: 2,
                outlineStyle: 'solid',
                outlineWidth: 2
            }
        }
    })
}));
