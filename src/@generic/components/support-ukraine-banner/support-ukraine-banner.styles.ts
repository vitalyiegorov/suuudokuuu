import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/theme';

export const SupportUkraineBannerStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: Colors.black,
        flexDirection: 'row',
        height: 40,
        justifyContent: 'center'
    },
    text: {
        color: Colors.white,
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        fontWeight: 'bold'
    }
});
