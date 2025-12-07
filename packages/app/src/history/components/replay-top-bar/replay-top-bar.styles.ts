import { StyleSheet } from 'react-native';

export const ReplayTopBarStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    closeButton: {
        paddingVertical: 8,
        paddingHorizontal: 12
    }
});
