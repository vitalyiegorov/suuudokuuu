import { LucideLogOut, LucidePause, LucideSettings, LucideShare2 } from 'lucide-react-native';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackIconButton } from '../../../../@generic/components/black-icon-button/black-icon-button';
import { GameScreenSelectors } from '../game-screen.selectors';

import { GameActionsStyles as styles } from './game-actions.styles';

interface Props {
    readonly actionIconColor: string;
    readonly onExit: () => void;
    readonly onOpenSettings: () => void;
    readonly onPause?: () => void;
    readonly onShare?: () => void;
}

export const GameActions = ({ actionIconColor, onExit, onOpenSettings, onPause, onShare }: Props) => (
    <View style={styles.actions}>
        {isDefined(onPause) ? (
            <BlackIconButton
                hitSlop={10}
                onPress={onPause}
                style={styles.button}
                testID={GameScreenSelectors.PauseButton}
                variant="inverted"
            >
                <LucidePause color={actionIconColor} />
            </BlackIconButton>
        ) : null}
        {isDefined(onShare) ? (
            <BlackIconButton
                hitSlop={10}
                onPress={onShare}
                style={styles.button}
                testID={GameScreenSelectors.ShareButton}
                variant="inverted"
            >
                <LucideShare2 color={actionIconColor} />
            </BlackIconButton>
        ) : null}
        <BlackIconButton
            hitSlop={10}
            onPress={onOpenSettings}
            style={styles.button}
            testID={GameScreenSelectors.SettingsButton}
            variant="inverted"
        >
            <LucideSettings color={actionIconColor} />
        </BlackIconButton>
        <BlackIconButton hitSlop={10} onPress={onExit} style={styles.button} testID={GameScreenSelectors.QuitButton} variant="inverted">
            <LucideLogOut color={actionIconColor} />
        </BlackIconButton>
    </View>
);
