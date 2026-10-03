import { Redirect, useLocalSearchParams } from 'expo-router';

import { Page } from '../../../@generic/components/page/page';
import { isDifficulty } from '../../../@generic/type-guard/is-difficulty.type-guard';
import { ReplayScreen } from '../../../screens/components/replay-screen/replay.screen';

export default function ReplayGamePage() {
    const { difficulty = '', completedAt = '' } = useLocalSearchParams<{ difficulty?: string; completedAt?: string }>();

    const completedAtNumber = parseInt(completedAt, 10);

    if (!isDifficulty(difficulty) || isNaN(completedAtNumber)) {
        return <Redirect href="/history" />;
    }

    return (
        <Page>
            <ReplayScreen completedAt={completedAtNumber} difficulty={difficulty} />
        </Page>
    );
}
