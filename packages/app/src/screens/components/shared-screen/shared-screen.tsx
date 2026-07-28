import { useLingui } from '@lingui/react/macro';
import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import { use } from 'react';
import { View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { Header } from '../../../@generic/components/header/header';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { ChallengeAcceptScreen } from '../../../challenge/components/challenge-accept-screen/challenge-accept-screen';
import { GameContext } from '../../../game/context/game.context';
import { decodeSharedGameState } from '../../../game/utils/decode-shared-game-state.util';

import { SharedScreenSelectors } from './shared-screen.selectors';
import { SharedScreenStyles as styles } from './shared-screen.styles';

interface Props {
    stateString: string;
}

export const SharedScreen = ({ stateString }: Props) => {
    const { t } = useLingui();
    const { createFromState } = use(GameContext);

    const { gameState, isReadable, kind } = decodeSharedGameState(stateString);
    const resumeTimeText = useTimerText(gameState.elapsedTime);

    if (!isReadable || !isNotEmptyString(gameState.sudokuString)) {
        return null;
    }

    const { challengeState, challengeTime } = gameState;

    const handleOpenPuzzle = () => {
        createFromState(gameState);
    };

    if (kind === SharedPayloadKindEnum.Challenge && isNotEmptyString(challengeState)) {
        return <ChallengeAcceptScreen challengeState={challengeState} onAccept={handleOpenPuzzle} opponentTotalTime={challengeTime} />;
    }

    const isHandoff = kind === SharedPayloadKindEnum.Handoff;
    const headerText = isHandoff ? t`Resume this game?` : t`Open shared puzzle?`;
    const confirmText = isHandoff ? t`Resume game` : t`Open puzzle`;
    const resumeSummary = `${resumeTimeText} · ${String(gameState.score)}`;

    return (
        <View style={styles.container} testID={SharedScreenSelectors.Root}>
            <View style={styles.headerColumn}>
                <Header text={headerText} />

                {isHandoff ? <Header text={resumeSummary} /> : null}
            </View>

            <View style={styles.buttonsWrapper}>
                <BlackButton onPress={handleOpenPuzzle} testID={SharedScreenSelectors.ConfirmButton} text={confirmText} />
                <BlackButton href="/" text={t`Cancel`} />
            </View>
        </View>
    );
};
