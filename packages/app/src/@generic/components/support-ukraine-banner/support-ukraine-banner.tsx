import { useLingui } from '@lingui/react/macro';
import { Link } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { donationLinkConstant } from '../../constants/donation.constant';

import { SupportUkraineBannerStyles as styles } from './support-ukraine-banner.styles';

export const SupportUkraineBanner = () => {
    const { t } = useLingui();

    return (
        <Link asChild href={donationLinkConstant}>
            <Pressable style={styles.container}>
                <Text style={styles.text}>{t`Support Ukraine`} 🇺🇦</Text>
            </Pressable>
        </Link>
    );
};
