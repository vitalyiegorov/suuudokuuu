import { Text, View } from 'react-native';

import { DonateButton } from '../donate-button/donate-button';

import { DonationStyles as styles } from './donation.styles';

interface Props {
    readonly type: 'loser' | 'paused' | 'winner';
}

// TODO: Add different random texts based on difficulty and results
const getText = (type: Props['type']) => {
    if (type === 'winner') {
        return 'You won and Ukraine needs to!\n\nEvery 1$ donation matters!';
    } else if (type === 'loser') {
        return 'You lost but Ukraine must win!\n\nEvery 1$ donation matters!';
    }

    return 'While you were away Ukraine continued its fight for freedom!\n\nEvery 1$ donation matters!';
};

export const Donation = ({ type }: Props) => (
    <View style={styles.donation}>
        <Text style={styles.donationText}>
            {getText(type)}
        </Text>

        <DonateButton />
    </View>
);
