import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';

import { Page } from '../@generic/components/page/page';
import { PageHead } from '../@generic/components/page-head/page-head';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { useAppSelector } from '../@generic/hooks/use-app-selector.hook';
import { gameIsStartedSelector } from '../game/store/game.selectors';
import { PauseScreen } from '../screens/components/pause-screen/pause.screen';

export default function PausePage() {
    const { t } = useLingui();
    const isGameStarted = useAppSelector(gameIsStartedSelector);

    if (!isGameStarted) {
        return <Redirect href="/" />;
    }

    return (
        <Page>
            <PageHead noIndex />
            <PageHeader title={t`Game paused`} />

            <PauseScreen />
        </Page>
    );
}
