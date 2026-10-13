import { use } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { AutoCandidatesButton } from '../../../../game/components/auto-candidates-button/auto-candidates-button';
import { HintButton } from '../../../../game/components/hint-button/hint-button';
import { InputModeButton } from '../../../../game/components/input-mode-button/input-mode-button';
import { RedoButton } from '../../../../game/components/redo-button/redo-button';
import { UndoButton } from '../../../../game/components/undo-button/undo-button';
import { HiddenFromAccessibilityPropsConstant } from '../../../../game/constant/hidden-from-accessibility-props.constant';
import { GameContext } from '../../../../game/context/game.context';
import { useCurrentRun } from '../../../../game/query/use-current-run.query';

import { GameInputToolsStyles as styles } from './game-input-tools.styles';

interface Props {
    readonly hideAutoCandidates: boolean;
    readonly isLeftHanded: boolean;
}

export const GameInputTools = ({ hideAutoCandidates, isLeftHanded }: Props) => {
    const { snapshot } = use(GameContext);
    const { isChallengeRun, maxMistakes } = useCurrentRun();

    const canUseHistoryControls = !isChallengeRun && maxMistakes !== 0;
    const areToolsHidden = isDefined(snapshot.stepScript);
    const toolsPointerEvents = areToolsHidden ? 'none' : 'auto';

    return (
        <View
            pointerEvents={toolsPointerEvents}
            style={styles.inputControls(isLeftHanded, areToolsHidden)}
            {...(areToolsHidden && HiddenFromAccessibilityPropsConstant)}
        >
            <View style={styles.utilityGroup}>
                {canUseHistoryControls ? (
                    <>
                        <UndoButton sizeStyle={styles.toolButton} />
                        <RedoButton sizeStyle={styles.toolButton} />
                    </>
                ) : null}
                {hideAutoCandidates ? null : <AutoCandidatesButton sizeStyle={styles.toolButton} />}
                <HintButton sizeStyle={styles.toolButton} />
            </View>

            <InputModeButton sizeStyle={styles.primaryToolButton} />
        </View>
    );
};
