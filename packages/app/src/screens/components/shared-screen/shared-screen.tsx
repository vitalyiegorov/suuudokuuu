import { useLingui } from '@lingui/react/macro';
import { useAppLayout } from '@suuudokuuu/ui';
import { use } from 'react';
import { View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { Header } from '../../../@generic/components/header/header';
import { ChallengeAcceptScreen } from '../../../challenge/components/challenge-accept-screen/challenge-accept-screen';
import { GameContext } from '../../../game/context/game.context';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';

import { SharedScreenStyles as styles } from './shared-screen.styles';

interface Props {
    stateString: string;
}

export const SharedScreen = ({ stateString }: Props) => {
    const { t } = useLingui();
    const { sizeClass } = useAppLayout();
    const { createFromState } = use(GameContext);

    if (!isNotEmptyString(stateString)) {
        return null;
    }

    const gameState = stringToGameState(stateString);

    if (!isNotEmptyString(gameState.sudokuString)) {
        return null;
    }

    const { challengeState, challengeTime } = gameState;

    const handleOpenPuzzle = () => {
        createFromState(gameState);
    };

    if (isNotEmptyString(challengeState)) {
        return <ChallengeAcceptScreen onAccept={handleOpenPuzzle} opponentTotalTime={challengeTime} />;
    }

    return (
        <View style={styles.container(sizeClass)}>
            <View style={styles.headerColumn(sizeClass)}>
                <Header text={t`Open shared puzzle?`} />
            </View>

            <View style={styles.buttonsWrapper(sizeClass)}>
                <BlackButton onPress={handleOpenPuzzle} text={t`Open puzzle`} />
                <BlackButton href="/" text={t`Cancel`} />
            </View>
        </View>
    );
};
