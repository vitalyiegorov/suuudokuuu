import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { useResumeGame } from '../../../game/hooks/use-resume-game.hook';
import { useSharePuzzle } from '../../../game/hooks/use-share-puzzle.hook';

import { PauseScreenStyles } from './pause-screen.styles';

export const PauseScreen = () => {
    const { t } = useLingui();

    const handleResume = useResumeGame();
    const handleShare = useSharePuzzle();

    return (
        <View style={PauseScreenStyles.container}>
            <Header text={t`Game paused`} />

            <Donation type="paused" />

            {}
            <BlackButton onPress={handleShare} text={t`Share puzzle`} />

            <BlackButton onPress={handleResume} text={t`Resume`} />
        </View>
    );
};
