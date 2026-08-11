import { useLingui } from '@lingui/react/macro';

import { Page } from '../@generic/components/page/page';
import { PageHead } from '../@generic/components/page-head/page-head';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { useAppSelector } from '../@generic/hooks/use-app-selector.hook';
import { gameShouldShowPauseScreenSelector } from '../game/store/game.selectors';
import { GameScreen } from '../screens/components/game-screen/game.screen';
import { PauseScreen } from '../screens/components/pause-screen/pause.screen';

export default function GamePage() {
    const { t } = useLingui();
    const shouldShowPauseScreen = useAppSelector(gameShouldShowPauseScreenSelector);
    const title = shouldShowPauseScreen ? t`Game paused` : t`Be wise, be smart, be quick...`;
    const description = t`Solve a Sudoku puzzle online with hints, notes, and mistake tracking.`;

    return (
        <Page>
            <PageHead description={description} title={t`Play Sudoku — Suuudokuuu`} />
            <PageHeader title={title} />

            {shouldShowPauseScreen ? <PauseScreen /> : <GameScreen />}
        </Page>
    );
}
