import { Trans, useLingui } from '@lingui/react/macro';
import { AppSurfaceCard } from '@suuudokuuu/ui';
import { use } from 'react';
import { Text, View } from 'react-native';

import { AppLinkButton } from '../../../../@generic/components/app-link-button/app-link-button';
import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { UkraineFlagIcon } from '../../../../@generic/components/ukraine-flag-icon/ukraine-flag-icon';
import { donationLinkConstant } from '../../../../@generic/constants/donation.constant';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { PauseScreenSelectors } from '../pause-screen.selectors';

import { PauseScreenUkraineCardStyles as styles } from './pause-screen-ukraine-card.styles';

export const PauseScreenUkraineCard = () => {
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
                testID={PauseScreenSelectors.UkraineCta}
                text={t`Help Ukraine win`}
                textStyle={styles.buttonText}
                variant="donation"
            />
        </AppSurfaceCard>
    );
};
