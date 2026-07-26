import { View } from 'react-native';

import { AutoCandidatesButton } from '../../../../game/components/auto-candidates-button/auto-candidates-button';
import { InputModeButton } from '../../../../game/components/input-mode-button/input-mode-button';

import { GameInputToolsStyles as styles } from './game-input-tools.styles';

interface Props {
    readonly hideAutoCandidates: boolean;
}

export const GameInputTools = ({ hideAutoCandidates }: Props) => (
    <View style={styles.inputControls}>
        <InputModeButton sizeStyle={styles.toolButton} />
        {hideAutoCandidates ? null : <AutoCandidatesButton sizeStyle={styles.toolButton} />}
    </View>
);
