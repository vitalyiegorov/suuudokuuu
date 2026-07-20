import { StyleSheet } from 'react-native';

export const GameResultPageStyles = StyleSheet.create({
    chromeContent: {
        alignItems: 'center'
    },
    content: {
        alignItems: 'center',
        flexGrow: 1,
        gap: 14,
        justifyContent: 'space-between',
        maxWidth: 560,
        paddingHorizontal: 18,
        paddingTop: 34,
        width: '100%'
    },
    scrollContent: {
        alignItems: 'center',
        flexGrow: 1,
        width: '100%'
    },
    scrollView: {
        flex: 1,
        width: '100%'
    }
});
