import { View } from 'react-native';

import { BlackButton } from '../../components/black-button/black-button';
import { Header } from '../../components/header/header';
import { PageHeader } from '../../components/page-header/page-header';

import { WinnerStyles as styles } from './winner.styles';

export default function Winner() {
    return (
        <View style={styles.container}>
            <PageHeader title="Winner!" />
            <Header text="Winner-winner, chicken dinner!" />
            <BlackButton text={'Play again'} href={'/'} />
        </View>
    );
}
