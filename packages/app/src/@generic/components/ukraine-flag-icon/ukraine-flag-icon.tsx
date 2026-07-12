import { View } from 'react-native';

import { UkraineFlagIconStyles as styles } from './ukraine-flag-icon.styles';

export const UkraineFlagIcon = () => (
    <View accessibilityElementsHidden importantForAccessibility="no" style={styles.container}>
        <View style={styles.blueStripe} />
        <View style={styles.yellowStripe} />
    </View>
);
