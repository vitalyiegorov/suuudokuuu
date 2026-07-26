import { StyleSheet } from 'react-native-unistyles';

export const PauseScreenBoardPreviewStyles = StyleSheet.create(() => ({
    cell: {
        borderRadius: 2.25,
        height: 7.5,
        width: 7.5
    },
    container: {
        borderRadius: 15,
        gap: 1.75,
        overflow: 'hidden',
        padding: 2
    },
    row: {
        flexDirection: 'row',
        gap: 1.75
    }
}));
