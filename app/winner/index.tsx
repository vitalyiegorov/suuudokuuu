import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { Header } from '../../components/header/header';
import { PageHeader } from '../../components/page-header/page-header';
import { PlayAgainButton } from '../../components/play-again-button/play-again-button';
import { appRootScoreSelector } from '../../store/app-root/app-root.selectors';

import { WinnerStyles as styles } from './winner.styles';

export default function Winner() {
    const score = useSelector(appRootScoreSelector);

    return (
        <View style={styles.container}>
            <PageHeader title="Winner!" />
            <Header text="Winner-winner, chicken dinner!" />
            <Header text={`You have scored: ${score} points`} />
            <PlayAgainButton />
        </View>
    );
}
