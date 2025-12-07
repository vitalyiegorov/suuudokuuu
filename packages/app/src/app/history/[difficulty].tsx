import { DifficultyEnum } from '@suuudokuuu/generator';
import { Redirect, useLocalSearchParams } from 'expo-router';

import { isDefined } from '@rnw-community/shared';

import { HistoryGamesScreen } from '../../screens/components/history-games-screen/history-games.screen';

const DifficultyValues = Object.values(DifficultyEnum);

const isValidDifficulty = (difficulty: string | undefined): difficulty is DifficultyEnum =>
    isDefined(difficulty) && DifficultyValues.includes(difficulty as DifficultyEnum);

const HistoryGamesRoute = () => {
    const { difficulty } = useLocalSearchParams<{ difficulty: string }>();

    if (!isValidDifficulty(difficulty)) {
        return <Redirect href="/history" />;
    }

    return <HistoryGamesScreen difficulty={difficulty} />;
};

export default HistoryGamesRoute;
