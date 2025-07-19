import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/theme';

export const SupportUkraineBannerStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: Colors.black,
        height: 40,
        justifyContent: 'center'
    },
    link: {},
    text: {
        color: Colors.white,
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        fontWeight: 'bold'
    }
});
