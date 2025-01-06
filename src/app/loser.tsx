import { StyleSheet, View } from 'react-native';

import { Donation, Header, PageHeader, PlayAgainButton } from '../@generic';

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
