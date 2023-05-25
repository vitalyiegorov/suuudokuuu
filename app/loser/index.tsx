import { View } from 'react-native';

import { BlackButton } from '../../components/black-button/black-button';
import { Header } from '../../components/header/header';
import { PageHeader } from '../../components/page-header/page-header';
import { useAppDispatch } from '../../hooks/redux.hook';
import { appRootResetAction } from '../../store/app-root/app-root.actions';

import { LoserStyles as styles } from './loser.styles';

export default function Loser() {
    const dispatch = useAppDispatch();

    const handlePlayAgain = () => {
        dispatch(appRootResetAction);
    };

    return (
        <View style={styles.container}>
            <PageHeader title="Looooooser! =)" />
            <Header text="Better next time! Loooooser =)" />
            <BlackButton text={'Play again'} onPress={handlePlayAgain} href={'/'} />
        </View>
    );
}
