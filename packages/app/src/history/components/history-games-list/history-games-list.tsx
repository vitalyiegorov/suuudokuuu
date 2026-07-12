import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { CompletedGameItem } from '../completed-games-list/completed-game-item';
import { HistoryDifficultyFilter } from '../history-difficulty-filter/history-difficulty-filter';
import { HistoryEmptyState } from '../history-empty-state/history-empty-state';

import { HistoryGamesListStyles as styles } from './history-games-list.styles';

import type { CompletedGameInterface } from '../../interfaces/completed-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulties: readonly DifficultyEnum[];
    readonly games: readonly CompletedGameInterface[];
    readonly onSelectDifficulty: (difficulty: DifficultyEnum | null) => void;
    readonly selectedDifficulty: DifficultyEnum | null;
    readonly showFilters: boolean;
}

export const HistoryGamesList = ({ difficulties, games, onSelectDifficulty, selectedDifficulty, showFilters }: Props) => {
    const { t } = useLingui();
    const filteredGames = selectedDifficulty === null ? games : games.filter(game => game.difficulty === selectedDifficulty);
    const shouldShowFilters = showFilters && difficulties.length > 1;

    if (games.length === 0) {
        return <HistoryEmptyState message={t`Completed games will be ready for replay.`} title={t`No games yet`} />;
    }

    return (
        <View style={styles.container}>
            {shouldShowFilters ? (
                <HistoryDifficultyFilter
                    difficulties={difficulties}
                    onSelectDifficulty={onSelectDifficulty}
                    selectedDifficulty={selectedDifficulty}
                />
            ) : null}

            <View style={styles.list}>
                {filteredGames.map(game => (
                    <CompletedGameItem game={game} key={`${game.difficulty}-${game.completedAt}`} />
                ))}
            </View>
        </View>
    );
};
