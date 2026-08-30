import { View } from 'react-native';

import { AutoCandidatesButton } from '../../../../game/components/auto-candidates-button/auto-candidates-button';
import { HintButton } from '../../../../game/components/hint-button/hint-button';
import { InputModeButton } from '../../../../game/components/input-mode-button/input-mode-button';
import { RedoButton } from '../../../../game/components/redo-button/redo-button';
import { UndoButton } from '../../../../game/components/undo-button/undo-button';

import { GameInputToolsStyles as styles } from './game-input-tools.styles';

interface Props {
    readonly hideAutoCandidates: boolean;
    readonly isLeftHanded: boolean;
}

export const GameInputTools = ({ hideAutoCandidates, isLeftHanded }: Props) => (
    <View style={styles.inputControls(isLeftHanded)}>
        <UndoButton sizeStyle={styles.toolButton} />
        <RedoButton sizeStyle={styles.toolButton} />
        {hideAutoCandidates ? null : <AutoCandidatesButton sizeStyle={styles.toolButton} />}
        <HintButton sizeStyle={styles.toolButton} />
        <InputModeButton sizeStyle={styles.primaryToolButton} />
    </View>
);
