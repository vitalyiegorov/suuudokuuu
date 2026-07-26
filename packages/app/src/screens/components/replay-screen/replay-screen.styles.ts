import { StyleSheet } from 'react-native-unistyles';

export const ReplayScreenStyles = StyleSheet.create(theme => ({
    container: {
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'column',
        gap: 18,
        maxWidth: theme.contentWidth.standard,
        paddingBottom: 18,
        paddingHorizontal: 20,
        paddingTop: 18,
        width: '100%'
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        gap: 18
    },
    fieldWrapper: {
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1,
        justifyContent: 'center',
        minHeight: 0,
        minWidth: 0
    },
    controlsColumn: {
        flexGrow: 0,
        flexShrink: 0,
        gap: 18,
        justifyContent: 'center'
    }
}));
