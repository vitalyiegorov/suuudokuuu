import { StyleSheet } from 'react-native';

export const ReplayScreenBottomInset = 24;

export const ReplayScreenStyles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        flex: 1,
        gap: 18,
        maxWidth: 430,
        paddingHorizontal: 20,
        paddingTop: 18,
        width: '100%'
    },
    scroll: {
        flex: 1
    },
    scrollContent: {
        gap: 18
    },
    fieldWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 260
    }
});
