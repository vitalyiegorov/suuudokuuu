import { DifficultyEnum } from '@suuudokuuu/generator';
import { Redirect, useLocalSearchParams } from 'expo-router';

import { PageAllSafeAreaEdges } from '../../../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../../../@generic/components/page/page';
import { ReplayScreen } from '../../../screens/components/replay-screen/replay.screen';

export default function ReplayGamePage() {
    const { difficulty = '', completedAt = '' } = useLocalSearchParams<{ difficulty?: string; completedAt?: string }>();

    const difficultyEnum = difficulty as DifficultyEnum;
    const completedAtNumber = parseInt(completedAt, 10);

    if (!Object.values(DifficultyEnum).includes(difficultyEnum) || isNaN(completedAtNumber)) {
        return <Redirect href="/history" />;
    }

    return (
        <Page edges={PageAllSafeAreaEdges}>
            <ReplayScreen completedAt={completedAtNumber} difficulty={difficultyEnum} />
        </Page>
    );
}
