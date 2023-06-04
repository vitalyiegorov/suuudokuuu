import { View } from 'react-native';

import { Donation, Header, PageHeader, PlayAgainButton } from '../../src/@generic';

import { LoserStyles as styles } from './loser.styles';

export default function Loser() {
    return (
        <View style={styles.container}>
            <PageHeader title="Looooooser! =)" />
            <Header text={'Better luck next time!\nLoooooser =)'} />

            <Donation type="loser" />

            <PlayAgainButton />
        </View>
    );
}
