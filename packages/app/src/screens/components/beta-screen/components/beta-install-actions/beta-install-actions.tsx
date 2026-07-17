import { useLingui } from '@lingui/react/macro';
import * as Linking from 'expo-linking';
import { LucideDownload } from 'lucide-react-native';
import { Alert, View } from 'react-native';

import { AppLinkButton } from '../../../../../@generic/components/app-link-button/app-link-button';
import { BetaScreenSelectors } from '../../beta-screen.selectors';
import { BetaAndroidInstallUrl, BetaIosInstallUrl } from '../../constant/beta-url.constant';

import { BetaInstallActionsStyles as styles } from './beta-install-actions.styles';

export const BetaInstallActions = () => {
    const { t } = useLingui();

    const handleOpenError = () => {
        Alert.alert(t`Unable to start installation`, t`The install link could not be opened. Check your browser settings and try again.`);
    };
    const handleIosPress = () => {
        Linking.openURL(BetaIosInstallUrl).catch(handleOpenError);
    };
    const handleAndroidPress = () => {
        Linking.openURL(BetaAndroidInstallUrl).catch(handleOpenError);
    };

    return (
        <View style={styles.container}>
            <AppLinkButton
                accessibilityHint={t`Opens the registered-device installation prompt`}
                accessibilityLabel={t`Install the iOS development build`}
                accessibilityRole="link"
                icon={LucideDownload}
                onPress={handleIosPress}
                style={styles.button}
                testID={BetaScreenSelectors.IosInstallButton}
                text={t`Install on iOS`}
            />
            <AppLinkButton
                accessibilityHint={t`Downloads the Android development APK`}
                accessibilityLabel={t`Download the Android development build`}
                accessibilityRole="link"
                icon={LucideDownload}
                onPress={handleAndroidPress}
                style={styles.button}
                testID={BetaScreenSelectors.AndroidInstallButton}
                text={t`Download for Android`}
                variant="secondary"
            />
        </View>
    );
};
