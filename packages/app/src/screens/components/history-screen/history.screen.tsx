import { useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { ScrollView, View } from 'react-native';

import { Header } from '../../../@generic/components/header/header';
import { ReturnButton } from '../../../@generic/components/return-button/return-button';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { HistoryDifficulty } from '../../../history/component/history-difficulty/history-difficulty';
import { historyByDifficultySelector } from '../../../history/store/history.selectors';

import { HistoryScreenStyles } from './history-screen.styles';

export const HistoryScreen = () => {
    const { t } = useLingui();
    const historyByDifficulty = useAppSelector(historyByDifficultySelector);

    const difficulties = Object.values(DifficultyEnum).filter(difficulty => historyByDifficulty[difficulty].bestScore > 0);

    return (
        <View style={HistoryScreenStyles.container}>
            <Header text={t`Statistics`} />

            <ScrollView
                contentContainerStyle={HistoryScreenStyles.scrollViewContainer}
                showsVerticalScrollIndicator={false}
                style={HistoryScreenStyles.scrollView}
            >
                {difficulties.map(difficulty => (
                    <HistoryDifficulty difficulty={difficulty} key={difficulty} />
                ))}
            </ScrollView>

            <ReturnButton />
        </View>
    );
};
