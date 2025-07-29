import { useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { ScrollView, View } from 'react-native';

import { Header } from '../../../@generic/components/header/header';
import { ReturnButton } from '../../../@generic/components/return-button/return-button';
import { HistoryDifficulty } from '../../../history/component/history-difficulty/history-difficulty';

import { HistoryScreenStyles } from './history-screen.styles';

export const HistoryScreen = () => {
    const { t } = useLingui();

    return (
        <View style={HistoryScreenStyles.container}>
            <Header text={t`Statistics`} />

            <ScrollView
                contentContainerStyle={HistoryScreenStyles.scrollViewContainer}
                showsVerticalScrollIndicator={false}
                style={HistoryScreenStyles.scrollView}
            >
                <HistoryDifficulty difficulty={DifficultyEnum.Nightmare} />
                <HistoryDifficulty difficulty={DifficultyEnum.Hard} />
                <HistoryDifficulty difficulty={DifficultyEnum.Medium} />
                <HistoryDifficulty difficulty={DifficultyEnum.Easy} />
                <HistoryDifficulty difficulty={DifficultyEnum.Newbie} />
            </ScrollView>

            <ReturnButton />
        </View>
    );
};
