import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { useAppSelector } from '../@generic/hooks/use-app-selector.hook';
import { gameIsStartedSelector, gameShouldShowPauseScreenSelector } from '../game/store/game.selectors';
import { GameScreen } from '../screens/components/game-screen/game.screen';
import { PauseScreen } from '../screens/components/pause-screen/pause.screen';

export default function GamePage() {
    const { t } = useLingui();
    const isGameStarted = useAppSelector(gameIsStartedSelector);
    const shouldShowPauseScreen = useAppSelector(gameShouldShowPauseScreenSelector);
    const title = shouldShowPauseScreen ? t`Game paused` : t`Be wise, be smart, be quick...`;

    if (!isGameStarted) {
        return <Redirect href="/" />;
    }

    return (
        <Page>
            <PageHeader title={title} />

            {shouldShowPauseScreen ? <PauseScreen /> : <GameScreen />}
        </Page>
    );
}
