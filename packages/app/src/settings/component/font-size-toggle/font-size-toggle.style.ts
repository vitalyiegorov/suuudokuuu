import { StyleSheet } from 'react-native';

export const FontSizeToggleStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        width: 50,
        zIndex: 1
    },
    label: {
        fontSize: 16,
        fontWeight: '500'
    },
    selectedLabel: {
        fontWeight: '700'
    },
    slider: {
        borderRadius: 25,
        elevation: 3,
        height: 44,
        position: 'absolute',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        top: 3,
        width: 74
    },
    toggleContainer: {
        borderRadius: 25,
        flexDirection: 'row',
        height: 50,
        marginTop: 10,
        overflow: 'hidden',
        position: 'relative'
    }
});
