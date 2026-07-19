import { StyleSheet } from 'react-native';

export const ChallengeResultScreenStyles = StyleSheet.create({
    actions: {
        alignItems: 'center',
        gap: 10,
        maxWidth: 560,
        width: '100%'
    },
    chromeContent: {
        alignItems: 'center'
    },
    content: {
        alignItems: 'center',
        gap: 16,
        maxWidth: 560,
        width: '100%'
    },
    footerChrome: {
        paddingBottom: 18,
        paddingHorizontal: 18,
        paddingTop: 12
    },
    headerChrome: {
        paddingBottom: 0,
        paddingHorizontal: 18,
        paddingTop: 12
    },
    scrollContent: {
        alignItems: 'center',
        flexGrow: 1,
        gap: 16,
        paddingHorizontal: 18,
        width: '100%'
    },
    scrollView: {
        flex: 1,
        width: '100%'
    }
});
