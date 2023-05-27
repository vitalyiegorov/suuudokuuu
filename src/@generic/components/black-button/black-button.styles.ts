import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/theme';

export const BlackButtonStyles = StyleSheet.create({
    button: {
        backgroundColor: Colors.black,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    buttonText: {
        color: Colors.white,
        textAlign: 'center'
    }
});
