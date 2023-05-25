import { View } from 'react-native';

import { Header } from '../../components/header/header';
import { PageHeader } from '../../components/page-header/page-header';
import { PlayAgainButton } from '../../components/play-again-button/play-again-button';

import { WinnerStyles as styles } from './winner.styles';

export default function Winner() {
    return (
        <View style={styles.container}>
            <PageHeader title="Winner!" />
            <Header text="Winner-winner, chicken dinner!" />
            <PlayAgainButton />
        </View>
    );
}
