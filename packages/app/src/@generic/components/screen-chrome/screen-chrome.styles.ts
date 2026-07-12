import { StyleSheet } from 'react-native';

export const ScreenChromeStyles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    content: {
        flex: 1,
        width: '100%'
    },
    footer: {
        alignItems: 'center',
        bottom: 0,
        left: 0,
        paddingBottom: 8,
        paddingHorizontal: 20,
        paddingTop: 12,
        position: 'absolute',
        right: 0,
        zIndex: 4
    },
    header: {
        alignItems: 'center',
        left: 0,
        paddingBottom: 12,
        paddingHorizontal: 20,
        paddingTop: 20,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 4
    }
});
