import { useLingui } from '@lingui/react/macro';
import { useLocalSearchParams } from 'expo-router';
import { use, useEffect } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { GameContext } from '../game/context/game.context';
import { GameScreen } from '../screens/components/game-screen/game.screen';

import type { SerializedGameState } from '../game/store/game.state';

export default function GamePage() {
    const state = useLocalSearchParams<SerializedGameState>();

    const { createFromState } = use(GameContext);
    const { t } = useLingui();

    useEffect(() => {
        if (isNotEmptyString(state.sudokuString)) {
            createFromState(state);
        }
    }, [state.sudokuString]);

    return (
        <Page>
            <PageHeader title={t`Be wise, be smart, be quick...`} />

            <GameScreen />
        </Page>
    );
}
