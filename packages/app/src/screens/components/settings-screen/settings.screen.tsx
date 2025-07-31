import { useLingui } from '@lingui/react/macro';
import { ScrollView, View } from 'react-native';

import { Header } from '../../../@generic/components/header/header';
import { PageHeader } from '../../../@generic/components/page-header/page-header';
import { ReturnButton } from '../../../@generic/components/return-button/return-button';
import { SettingsSwitch } from '../../../settings/component/settings-switch/settings-switch';

import { SettingsScreenStyles as styles } from './settings-screen.styles';

export const SettingsScreen = () => {
    const { t } = useLingui();

    return (
        <View style={styles.container}>
            <PageHeader title={t`Settings`} />

            <Header text={t`Settings`} />

            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false} style={styles.scrollView}>
                <SettingsSwitch setting="hasTimer" title={t`Timer`} />
                <SettingsSwitch setting="hasVibration" title={t`Vibration`} />
                <SettingsSwitch
                    description={t`Highlight block, column, row for a selected cell`}
                    setting="showAreas"
                    title={t`Highlight areas`}
                />
                <SettingsSwitch
                    description={t`Highlight repeated numbers in a block, column, row`}
                    setting="showIdenticalNumbers"
                    title={t`Highlight identical numbers`}
                />
                <SettingsSwitch
                    description={t`Show animated effects when a grid, row, column, block is completed`}
                    setting="showComboAnimation"
                    title={t`Show combo animation`}
                />
            </ScrollView>

            <ReturnButton />
        </View>
    );
};
