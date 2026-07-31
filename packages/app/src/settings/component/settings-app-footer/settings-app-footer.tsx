import { Trans, useLingui } from '@lingui/react/macro';
import { Link } from 'expo-router';
import { use } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { UkraineFlagIcon } from '../../../@generic/components/ukraine-flag-icon/ukraine-flag-icon';
import { donationLinkConstant } from '../../../@generic/constants/donation.constant';
import { getBrand } from '../../../@generic/utils/get-brand.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { settingsAppFooterGetSupportLinkColors } from '../../utils/settings-app-footer-get-support-link-colors.util';

import { SettingsAppFooterSelectors } from './settings-app-footer.selectors';
import { SettingsAppFooterStyles as styles } from './settings-app-footer.styles';

interface Props {
    readonly version: string;
}

export const SettingsAppFooter = ({ version }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const { appName } = getBrand();
    const versionLabel = t`${appName} · v${version}`;
    const supportLinkColors = settingsAppFooterGetSupportLinkColors(theme);
    const supportButtonStyle = StyleSheet.flatten([
        styles.supportButton,
        {
            backgroundColor: supportLinkColors.backgroundColor,
            borderColor: supportLinkColors.borderColor
        }
    ]);
    const actionStyle = StyleSheet.flatten([
        styles.action,
        {
            backgroundColor: theme.colors.surface.subtle,
            borderColor: theme.colors.surface.border
        }
    ]);
    const supportTextStyles = [styles.supportText, { color: supportLinkColors.textColor }];
    const actionTextStyles = [styles.actionText, { color: theme.colors.surface.subtleText }];
    const versionStyles = [styles.version, { color: theme.colors.text.hint }];

    return (
        <View style={styles.container}>
            <Link asChild href={donationLinkConstant} testID={SettingsAppFooterSelectors.SupportUkraineLink}>
                <Pressable
                    accessibilityLabel={t`Support Ukraine`}
                    accessibilityRole="link"
                    style={supportButtonStyle}
                    testID={SettingsAppFooterSelectors.SupportUkraineLink}
                >
                    <BlackText numberOfLines={1} style={supportTextStyles}>
                        <Trans>Support Ukraine</Trans>
                    </BlackText>
                    <UkraineFlagIcon />
                </Pressable>
            </Link>

            <View style={styles.actions}>
                <Link
                    asChild
                    href="https://github.com/vitalyiegorov/suuudokuuu/issues/new"
                    testID={SettingsAppFooterSelectors.ReportBugLink}
                >
                    <Pressable accessibilityRole="link" style={actionStyle} testID={SettingsAppFooterSelectors.ReportBugLink}>
                        <BlackText numberOfLines={1} style={actionTextStyles}>
                            <Trans>Report a bug</Trans>
                        </BlackText>
                    </Pressable>
                </Link>

                <Link asChild href="/privacy-policy" testID={SettingsAppFooterSelectors.PrivacyPolicyLink}>
                    <Pressable accessibilityRole="link" style={actionStyle} testID={SettingsAppFooterSelectors.PrivacyPolicyLink}>
                        <BlackText numberOfLines={1} style={actionTextStyles}>
                            <Trans>Privacy policy</Trans>
                        </BlackText>
                    </Pressable>
                </Link>
            </View>

            <BlackText numberOfLines={1} style={versionStyles}>
                {versionLabel}
            </BlackText>
        </View>
    );
};
