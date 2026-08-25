import { useLingui } from '@lingui/react/macro';
import { LucideLogOut, LucidePause, LucideSettings, LucideShare2 } from 'lucide-react-native';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { AppIconButton } from '../../../../@generic/components/app-icon-button/app-icon-button';
import { GameScreenSelectors } from '../game-screen.selectors';

import { GameActionsStyles as styles } from './game-actions.styles';

interface Props {
    readonly actionIconColor: string;
    readonly onExit: () => void;
    readonly onOpenSettings: () => void;
    readonly onPause?: () => void;
    readonly onShare?: () => void;
}

export const GameActions = ({ actionIconColor, onExit, onOpenSettings, onPause, onShare }: Props) => {
    const { t } = useLingui();

    return (
        <View style={styles.actions}>
            {isDefined(onPause) ? (
                <AppIconButton
                    accessibilityLabel={t`Pause`}
                    hitSlop={10}
                    onPress={onPause}
                    style={styles.button}
                    testID={GameScreenSelectors.PauseButton}
                    variant="inverted"
                >
                    <LucidePause color={actionIconColor} />
                </AppIconButton>
            ) : null}
            {isDefined(onShare) ? (
                <AppIconButton
                    accessibilityLabel={t`Share this puzzle`}
                    hitSlop={10}
                    onPress={onShare}
                    style={styles.button}
                    testID={GameScreenSelectors.ShareButton}
                    variant="inverted"
                >
                    <LucideShare2 color={actionIconColor} />
                </AppIconButton>
            ) : null}
            <AppIconButton
                accessibilityLabel={t`Game settings`}
                hitSlop={10}
                onPress={onOpenSettings}
                style={styles.button}
                testID={GameScreenSelectors.SettingsButton}
                variant="inverted"
            >
                <LucideSettings color={actionIconColor} />
            </AppIconButton>
            <AppIconButton
                accessibilityLabel={t`Stop this run`}
                hitSlop={10}
                onPress={onExit}
                style={styles.button}
                testID={GameScreenSelectors.QuitButton}
                variant="inverted"
            >
                <LucideLogOut color={actionIconColor} />
            </AppIconButton>
        </View>
    );
};
