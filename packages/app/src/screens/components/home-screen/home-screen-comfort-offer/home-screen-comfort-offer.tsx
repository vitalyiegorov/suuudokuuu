import { Trans, useLingui } from '@lingui/react/macro';
import { AppButton, AppSurfaceCard } from '@suuudokuuu/ui';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { useAppDispatch } from '../../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../../@generic/hooks/use-app-selector.hook';
import { settingsSetAction, settingsSetComfortModeAction } from '../../../../settings/store/settings.actions';
import { settingsComfortModeOfferVisibleSelector } from '../../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { HomeScreenSelectors } from '../home-screen.selectors';

import { HomeScreenComfortOfferStyles as styles } from './home-screen-comfort-offer.styles';

export const HomeScreenComfortOffer = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const isOfferVisible = useAppSelector(settingsComfortModeOfferVisibleSelector);
    const dispatch = useAppDispatch();

    const handleEnable = () => dispatch(settingsSetComfortModeAction(true));
    const handleDismiss = () => dispatch(settingsSetAction({ comfortModeOfferDismissed: true }));

    if (!isOfferVisible) {
        return null;
    }

    const descriptionStyles = [styles.description, { color: theme.colors.text.hint }];

    return (
        <AppSurfaceCard size="compact" testID={HomeScreenSelectors.ComfortOffer}>
            <View style={styles.content}>
                <BlackText style={styles.title}>
                    <Trans>Try Comfort mode</Trans>
                </BlackText>

                <BlackText style={descriptionStyles}>
                    <Trans>One switch for bigger numbers, a calmer board, and high-contrast colors.</Trans>
                </BlackText>

                <View style={styles.actions}>
                    <AppButton
                        onPress={handleEnable}
                        size="compact"
                        style={styles.action}
                        testID={HomeScreenSelectors.ComfortOfferEnable}
                        text={t`Turn it on`}
                    />
                    <AppButton
                        onPress={handleDismiss}
                        size="compact"
                        style={styles.action}
                        testID={HomeScreenSelectors.ComfortOfferDismiss}
                        text={t`Not now`}
                        variant="ghost"
                    />
                </View>
            </View>
        </AppSurfaceCard>
    );
};
