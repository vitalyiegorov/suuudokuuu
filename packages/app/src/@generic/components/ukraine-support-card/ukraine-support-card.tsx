import { Trans, useLingui } from '@lingui/react/macro';
import { AppSurfaceCard } from '@suuudokuuu/ui';
import { MaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { donationLinkConstant } from '../../constants/donation.constant';
import { AppLinkButton } from '../app-link-button/app-link-button';
import { BlackText } from '../black-text/black-text';
import { UkraineFlagIcon } from '../ukraine-flag-icon/ukraine-flag-icon';

import { UkraineSupportCardStyles as styles } from './ukraine-support-card.styles';

export type UkraineSupportCardContext = 'neutral' | 'winner' | 'loser';
type UkraineSupportCardVariant = 'bordered' | 'filled';

interface Props {
    readonly context?: UkraineSupportCardContext;
    readonly testID: string;
    readonly variant?: UkraineSupportCardVariant;
}

export const UkraineSupportCard = ({ context = 'neutral', testID, variant = 'filled' }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const isBordered = variant === 'bordered';
    const textColor = isBordered ? theme.colors.text.primary : theme.colors.inkText;
    const cardVariant = isBordered ? 'default' : 'inverted';
    const cardColorStyles = isBordered ? { backgroundColor: 'transparent', borderColor: theme.colors.surface.border } : null;
    const containerStyles = [styles.container, cardColorStyles];
    const titleStyles = [styles.title, { color: textColor }];
    const descriptionStyles = [styles.description, { color: textColor }];
    const flagStyles = [styles.flag];

    let description = <Trans>While you were away, the fight for freedom continued. Every $1 makes a difference.</Trans>;

    if (context === 'winner') {
        description = <Trans>You finished your puzzle. The fight for freedom in Ukraine continues. Every $1 makes a difference.</Trans>;
    }

    if (context === 'loser') {
        description = (
            <Trans>This board did not go your way. The fight for freedom in Ukraine continues. Every $1 makes a difference.</Trans>
        );
    }

    return (
        <AppSurfaceCard size="compact" style={containerStyles} variant={cardVariant}>
            <View style={styles.titleRow}>
                <View style={flagStyles}>
                    <UkraineFlagIcon />
                </View>

                <BlackText adjustsFontSizeToFit minimumFontScale={0.68} numberOfLines={1} style={titleStyles}>
                    <Trans>Ukraine keeps fighting</Trans>
                </BlackText>
            </View>

            <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={descriptionStyles}>
                {description}
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
