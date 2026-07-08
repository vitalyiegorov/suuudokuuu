import { Trans, useLingui } from '@lingui/react/macro';
import { AppSurfaceCard } from '@suuudokuuu/ui';
import { LucideArrowRight } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { AppLinkButton } from '../../../../@generic/components/app-link-button/app-link-button';
import { UkraineFlagIcon } from '../../../../@generic/components/ukraine-flag-icon/ukraine-flag-icon';
import { donationLinkConstant } from '../../../../@generic/constants/donation.constant';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { LoserScreenSelectors } from '../loser-screen.selectors';

import { LoserScreenUkraineCardStyles as styles } from './loser-screen-ukraine-card.styles';

export const LoserScreenUkraineCard = () => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const invertedLabelColor = theme.colors.label.inverted;
    const titleStyle = [styles.title, { color: invertedLabelColor }];
    const descriptionStyle = [styles.description, { color: invertedLabelColor }];

    return (
        <AppSurfaceCard size="spacious" style={styles.container} variant="inverted">
            <View style={styles.content}>
                <View style={styles.flag}>
                    <UkraineFlagIcon />
                </View>

                <View style={styles.textColumn}>
                    <Text allowFontScaling={false} style={titleStyle}>
                        <Trans>Ukraine needs to win too</Trans>
                    </Text>

                    <Text allowFontScaling={false} style={descriptionStyle}>
                        <Trans>Every $1 donation matters.</Trans>
                    </Text>
                </View>

                <AppLinkButton
                    accessibilityRole="link"
                    href={donationLinkConstant}
                    icon={LucideArrowRight}
                    iconSize={18}
                    size="compact"
                    style={styles.button}
                    testID={LoserScreenSelectors.UkraineCta}
                    text={t`Help`}
                    variant="donation"
                />
            </View>
        </AppSurfaceCard>
    );
};
