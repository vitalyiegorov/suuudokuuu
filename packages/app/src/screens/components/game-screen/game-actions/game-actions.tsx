import { LucideLogOut, LucideSettings, LucideShare2 } from 'lucide-react-native';
import { View } from 'react-native';

import { BlackIconButton } from '../../../../@generic/components/black-icon-button/black-icon-button';
import { GameScreenSelectors } from '../game-screen.selectors';

import { GameActionsStyles as styles } from './game-actions.styles';

interface Props {
    readonly actionIconColor: string;
    readonly hasSharing: boolean;
    readonly onExit: () => void;
    readonly onOpenSettings: () => void;
    readonly onShare: () => void;
}

export const GameActions = ({ actionIconColor, hasSharing, onExit, onOpenSettings, onShare }: Props) => (
    <View style={styles.actions}>
        {hasSharing ? (
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
