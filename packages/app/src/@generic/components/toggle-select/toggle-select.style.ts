import { StyleSheet } from 'react-native';

export const ToggleSelectStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        zIndex: 1
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center'
    },
    selectedLabel: {
        fontWeight: '700'
    },
    slider: {
        borderRadius: 40,
        elevation: 3,
        position: 'absolute',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2
    },
    toggleContainer: {
        borderRadius: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        overflow: 'hidden',
        position: 'relative'
    }
});
