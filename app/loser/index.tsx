import { View } from 'react-native';

import { Header } from '../../components/header/header';
import { PageHeader } from '../../components/page-header/page-header';
import { PlayAgainButton } from '../../components/play-again-button/play-again-button';

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
