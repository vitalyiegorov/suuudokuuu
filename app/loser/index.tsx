import { View } from 'react-native';

import { Header } from '../../src/@generic/components/header/header';
import { PageHeader } from '../../src/@generic/components/page-header/page-header';
import { PlayAgainButton } from '../../src/@generic/components/play-again-button/play-again-button';

import { LoserStyles as styles } from './loser.styles';

export default function Loser() {
    return (
        <View style={styles.container}>
            <PageHeader title="Looooooser! =)" />

            <Header text="Better next time! Loooooser =)" />

            <PlayAgainButton />
        </View>
    );
}
