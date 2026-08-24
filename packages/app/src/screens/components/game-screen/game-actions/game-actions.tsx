import { LucideLogOut, LucidePause, LucideRedo2, LucideSettings, LucideShare2, LucideUndo2 } from 'lucide-react-native';
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
    readonly onUndo?: () => void;
    readonly onRedo?: () => void;
    readonly canUndo?: boolean;
    readonly canRedo?: boolean;
}

export const GameActions = ({
    actionIconColor,
    onExit,
    onOpenSettings,
    onPause,
    onShare,
    onUndo,
    onRedo,
    canUndo = false,
    canRedo = false
}: Props) => (
    <View style={styles.actions}>
        {isDefined(onPause) ? (
            <AppIconButton hitSlop={10} onPress={onPause} style={styles.button} testID={GameScreenSelectors.PauseButton} variant="inverted">
                <LucidePause color={actionIconColor} />
            </AppIconButton>
        ) : null}
        {isDefined(onShare) ? (
            <AppIconButton hitSlop={10} onPress={onShare} style={styles.button} testID={GameScreenSelectors.ShareButton} variant="inverted">
                <LucideShare2 color={actionIconColor} />
            </AppIconButton>
        ) : null}
        {isDefined(onUndo) ? (
            <AppIconButton
                disabled={!canUndo}
                hitSlop={10}
                onPress={onUndo}
                style={styles.button}
                testID={GameScreenSelectors.UndoButton}
                variant="inverted"
            >
                <LucideUndo2 color={actionIconColor} />
            </AppIconButton>
        ) : null}
        {isDefined(onRedo) ? (
            <AppIconButton
                disabled={!canRedo}
                hitSlop={10}
                onPress={onRedo}
                style={styles.button}
                testID={GameScreenSelectors.RedoButton}
                variant="inverted"
            >
                <LucideRedo2 color={actionIconColor} />
            </AppIconButton>
        ) : null}
        <AppIconButton
            hitSlop={10}
            onPress={onOpenSettings}
            style={styles.button}
            testID={GameScreenSelectors.SettingsButton}
            variant="inverted"
        >
            <LucideSettings color={actionIconColor} />
        </AppIconButton>
        <AppIconButton hitSlop={10} onPress={onExit} style={styles.button} testID={GameScreenSelectors.QuitButton} variant="inverted">
            <LucideLogOut color={actionIconColor} />
        </AppIconButton>
    </View>
);
