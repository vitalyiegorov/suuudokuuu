import { Text, View } from 'react-native';

import { DonateButton } from '../donate-button/donate-button';

import { DonationStyles as styles } from './donation.styles';

interface Props {
    isWinner: boolean;
}

// TODO: Add different random texts based on difficulty and results
const getText = (isWinner: boolean) => {
    if (isWinner) {
        return 'You won and Ukraine needs to! Every 1$ donation matters!';
    }

    return 'You lost but Ukraine must win! Every 1$ donation matters!';
};

export const Donation = ({ isWinner }: Props) => (
    <View style={styles.donation}>
        <Text style={styles.donationText}>{getText(isWinner)}</Text>
        <DonateButton />
    </View>
);
