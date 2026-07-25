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
            <BlackIconButton onPress={onShare} testID={GameScreenSelectors.ShareButton} variant="secondary">
                <LucideShare2 color={actionIconColor} />
            </BlackIconButton>
        ) : null}
        <BlackIconButton onPress={onOpenSettings} testID={GameScreenSelectors.SettingsButton} variant="secondary">
            <LucideSettings color={actionIconColor} />
        </BlackIconButton>
        <BlackIconButton onPress={onExit} testID={GameScreenSelectors.QuitButton} variant="secondary">
            <LucideLogOut color={actionIconColor} />
        </BlackIconButton>
    </View>
);
