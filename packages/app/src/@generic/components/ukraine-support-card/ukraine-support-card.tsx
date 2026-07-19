import { Trans, useLingui } from '@lingui/react/macro';
import { AppSurfaceCard } from '@suuudokuuu/ui';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { donationLinkConstant } from '../../constants/donation.constant';
import { AppLinkButton } from '../app-link-button/app-link-button';
import { BlackText } from '../black-text/black-text';
import { UkraineFlagIcon } from '../ukraine-flag-icon/ukraine-flag-icon';

import { UkraineSupportCardStyles as styles } from './ukraine-support-card.styles';

interface Props {
    testID: string;
}

export const UkraineSupportCard = ({ testID }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const titleStyles = [styles.title, { color: theme.colors.label.inverted }];
    const descriptionStyles = [styles.description, { color: theme.colors.label.inverted }];
    const flagStyles = [styles.flag];

    return (
        <AppSurfaceCard size="compact" style={styles.container} variant="inverted">
            <View style={styles.titleRow}>
                <View style={flagStyles}>
                    <UkraineFlagIcon />
                </View>

                <BlackText adjustsFontSizeToFit minimumFontScale={0.68} numberOfLines={1} style={titleStyles}>
                    <Trans>Ukraine keeps fighting</Trans>
                </BlackText>
            </View>

            <Text adjustsFontSizeToFit allowFontScaling={false} minimumFontScale={0.78} numberOfLines={3} style={descriptionStyles}>
                <Trans>While you were away, the fight for freedom continued. Every $1 makes a difference.</Trans>
            </Text>

            <AppLinkButton
                accessibilityRole="link"
                href={donationLinkConstant}
                size="regular"
                style={styles.button}
                testID={testID}
                text={t`Help Ukraine win`}
                textStyle={styles.buttonText}
                variant="donation"
            />
        </AppSurfaceCard>
    );
};
