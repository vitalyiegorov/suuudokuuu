import { StyleSheet, View } from 'react-native';

import { Donation } from '../@generic/components/donation/donation';
import { Header } from '../@generic/components/header/header';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { PlayAgainButton } from '../@generic/components/play-again-button/play-again-button';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        gap: 20,
        justifyContent: 'center'
    }
});

export default function LoserPage() {
    return (
        <View style={styles.container}>
            <PageHeader title="Looooooser! =)" />
            <Header text={'Better luck next time!\nLoooooser =)'} />

            <Donation type="loser" />

            <PlayAgainButton />
        </View>
    );
}
