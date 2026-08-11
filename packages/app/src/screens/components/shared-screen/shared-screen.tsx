import { useLingui } from '@lingui/react/macro';
import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import { use } from 'react';
import { View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { AppLinkButton } from '../../../@generic/components/app-link-button/app-link-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Header } from '../../../@generic/components/header/header';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { getLevelRatingText } from '../../../@generic/utils/get-level-rating-text.util';
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
    const { createFromState, isCreatingGame } = use(GameContext);

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
        return (
            <ChallengeAcceptScreen
                challengeState={challengeState}
                isLoading={isCreatingGame}
                onAccept={handleOpenPuzzle}
                opponentTotalTime={challengeTime}
            />
        );
    }

    const isHandoff = kind === SharedPayloadKindEnum.Handoff;
    const headerText = isHandoff ? t`Resume this game?` : t`Open shared puzzle?`;
    const confirmText = isHandoff ? t`Resume game` : t`Open puzzle`;
    const resumeSummary = `${resumeTimeText} · ${String(gameState.score)}`;
    const difficultyText = getDifficultyText(gameState.difficulty);
    const levelText = getLevelRatingText(difficultyText, gameState.rating, gameState.isRatingCeiling);

    return (
        <View style={styles.container} testID={SharedScreenSelectors.Root}>
            <View style={styles.headerColumn}>
                <Header text={headerText} />

                {isHandoff ? <Header text={resumeSummary} /> : null}

                <View style={styles.metaRow} testID={SharedScreenSelectors.Meta}>
                    <BlackText style={styles.metaText}>{levelText}</BlackText>
                </View>
            </View>

            <View style={styles.buttonsWrapper}>
                <AppLinkButton
                    isLoading={isCreatingGame}
                    onPress={handleOpenPuzzle}
                    testID={SharedScreenSelectors.ConfirmButton}
                    text={confirmText}
                />
                <AppLinkButton href="/" testID={SharedScreenSelectors.CancelButton} text={t`Cancel`} />
            </View>
        </View>
    );
};
