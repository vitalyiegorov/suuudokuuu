import { useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { ScrollView } from 'react-native';

import { Header } from '../../../@generic/components/header/header';
import { ReturnButton } from '../../../@generic/components/return-button/return-button';
import { HistoryDifficulty } from '../../../history/component/history-difficulty/history-difficulty';

import { HistoryScreenStyles } from './history-screen.styles';

export const HistoryScreen = () => {
    const { t } = useLingui();

    return (
        <ScrollView contentContainerStyle={HistoryScreenStyles.container}>
            <Header text={t`Statistics`} />

            <HistoryDifficulty difficulty={DifficultyEnum.Nightmare} />
            <HistoryDifficulty difficulty={DifficultyEnum.Hard} />
            <HistoryDifficulty difficulty={DifficultyEnum.Medium} />
            <HistoryDifficulty difficulty={DifficultyEnum.Easy} />
            <HistoryDifficulty difficulty={DifficultyEnum.Newbie} />

            <ReturnButton />
        </ScrollView>
    );
};
