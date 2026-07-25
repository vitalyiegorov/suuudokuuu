import { StyleSheet } from 'react-native';

export const CollapsibleChromePageStyles = StyleSheet.create({
    largeTitle: {
        fontSize: 31,
        marginBottom: 0,
        textAlign: 'left',
        transform: [{ translateY: 2 }]
    },
    smallTitle: {
        fontSize: 17,
        marginBottom: 0,
        transform: [{ translateY: 3 }]
    }
});
