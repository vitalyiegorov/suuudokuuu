import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/theme';

export const DonationStyles = StyleSheet.create({
    donation: {
        borderBottomColor: Colors.black,
        borderTopColor: Colors.black,
        borderWidth: 1,
        marginVertical: 20,
        paddingVertical: 10,
        width: 200
    },
    donationText: {
        color: Colors.black,
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center'
    }
});
