import { useAtomRefresh } from '@effect/atom-react/Hooks';
import { Trans, useLingui } from '@lingui/react/macro';
import { Button, Text, View } from 'react-native';

import { databaseBootAtom } from '../../utils/database-query-atom.util';

import { BootFailureStyles as styles } from './boot-failure.styles';

export const BootFailure = () => {
    const { t } = useLingui();
    const retryBoot = useAtomRefresh(databaseBootAtom);

    return (
        <View style={styles.container}>
            <Text accessibilityRole="alert" style={styles.message}>
                <Trans>Unable to load your game</Trans>
            </Text>
            <Button onPress={retryBoot} title={t`Try again`} />
        </View>
    );
};
