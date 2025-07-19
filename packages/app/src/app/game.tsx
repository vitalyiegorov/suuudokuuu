import { useLocalSearchParams } from 'expo-router';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { GameScreen } from '../screens/components/game-screen/game-screen';

import type { DifficultyEnum } from '@suuudokuuu/generator';

export default function GamePage() {
    const { field, difficulty } = useLocalSearchParams<{ field?: string; difficulty?: DifficultyEnum }>();

    return (
        <Page>
            <PageHeader title="Be wise, be smart, be quick..." />

            <GameScreen
                routeDifficulty={difficulty}
                routeField={field}
            />
        </Page>
    );
}
