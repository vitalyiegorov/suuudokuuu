import { StyleSheet } from 'react-native';

export const StickyFooterBandStyles = StyleSheet.create({
    container: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        zIndex: 3
    },
    content: {
        zIndex: 3
    }
});
