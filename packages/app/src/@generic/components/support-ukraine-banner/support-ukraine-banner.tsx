import { useLingui } from '@lingui/react/macro';
import { Link } from 'expo-router';
import { use } from 'react';
import { Pressable, Text } from 'react-native';

import { donationLinkConstant } from '../../constants/donation.constant';
import { ThemeContext } from '../../context/theme.context';

import { SupportUkraineBannerStyles as styles } from './support-ukraine-banner.styles';

export const SupportUkraineBanner = () => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();

    return (
        <Link asChild href={donationLinkConstant} style={{ backgroundColor: theme.colors.black }}>
            <Pressable style={styles.container}>
                <Text style={[styles.text, { color: theme.colors.white }]}>{t`Support Ukraine`} 🇺🇦</Text>
            </Pressable>
        </Link>
    );
};
