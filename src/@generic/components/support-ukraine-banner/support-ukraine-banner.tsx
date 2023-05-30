import { Link } from 'expo-router';
import { View, Text } from 'react-native';

import { SupportUkraineBannerStyles as styles } from './support-ukraine-banner.styles';

const donationLink = 'https://savelife.in.ua/en/donate-en/#donate-army-card-monthly';

export const SupportUkraineBanner = () => {
    return (
        <View style={styles.container}>
            <Link href={donationLink}>
                <Text style={styles.text}>Support Ukraine 🇺🇦</Text>
            </Link>
        </View>
    );
};
