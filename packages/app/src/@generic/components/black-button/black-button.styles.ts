import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/theme';

export const BlackButtonStyles = StyleSheet.create({
    button: {
        backgroundColor: Colors.black,
        outlineOffset: 0,
        outlineWidth: 0,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    buttonActive: {
        backgroundColor: Colors.white
    },
    buttonText: {
        color: Colors.white,
        textAlign: 'center'
    }
});
