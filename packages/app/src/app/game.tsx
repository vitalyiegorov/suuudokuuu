import { useLocalSearchParams } from 'expo-router';
import { use, useEffect } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { GameContext } from '../game/context/game.context';
import { GameScreen } from '../screens/components/game-screen/game-screen';

export default function GamePage() {
    const { field } = useLocalSearchParams<{ field?: string }>();

    const { createFromString } = use(GameContext);

    useEffect(() => {
        if (isNotEmptyString(field)) {
            createFromString(field);
        }
    }, [field]);

    return (
        <Page>
            <PageHeader title="Be wise, be smart, be quick..." />

            <GameScreen />
        </Page>
    );
}
