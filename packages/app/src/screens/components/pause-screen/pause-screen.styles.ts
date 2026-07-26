import { StyleSheet } from 'react-native-unistyles';

const PauseScreenContentMaxWidth = 560;

export const PauseScreenStyles = StyleSheet.create(() => ({
    asideColumn: {
        gap: 14,
        width: '100%'
    },
    container: {
        flex: 1
    },
    content: {
        alignItems: 'stretch',
        alignSelf: 'center',
        flexDirection: 'column',
        flexGrow: 1,
        gap: 14,
        justifyContent: 'space-between',
        maxWidth: PauseScreenContentMaxWidth,
        paddingHorizontal: 18,
        paddingTop: 16,
        width: '100%'
    },
    summaryColumn: {
        gap: 14,
        width: '100%'
    }
}));
