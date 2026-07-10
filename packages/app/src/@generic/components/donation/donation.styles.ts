import { StyleSheet } from 'react-native-unistyles';

export const DonationStyles = StyleSheet.create(theme => ({
    donation: {
        borderWidth: 1,
        marginVertical: theme.spacing.lg,
        paddingVertical: 10,
        width: 200
    },
    donationText: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center'
    }
}));
