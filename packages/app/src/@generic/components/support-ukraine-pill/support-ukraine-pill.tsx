import { Trans, useLingui } from '@lingui/react/macro';
import { Link } from 'expo-router';
import { use } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { donationLinkConstant } from '../../constants/donation.constant';
import { BlackText } from '../black-text/black-text';
import { UkraineFlagIcon } from '../ukraine-flag-icon/ukraine-flag-icon';

import { SupportUkrainePillStyles as styles } from './support-ukraine-pill.styles';

export const SupportUkrainePill = () => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const containerStyles = StyleSheet.flatten([
        styles.container,
        { backgroundColor: theme.colors.candidate.fill, borderColor: theme.colors.surface.border }
    ]);
    const textStyles = [styles.text, { color: theme.colors.text.primary }];

    return (
        <Link asChild href={donationLinkConstant}>
            <Pressable accessibilityLabel={t`Support Ukraine`} accessibilityRole="link" style={containerStyles}>
                <BlackText numberOfLines={1} style={textStyles}>
                    <Trans>Support</Trans>
                </BlackText>
                <UkraineFlagIcon />
            </Pressable>
        </Link>
    );
};
