import type { GameState } from '../store/game.state';

type PersistedAggregatesType = Pick<
    GameState,
    'dailyBestStreak' | 'dailyCompletedDayNumbers' | 'historyByDifficulty' | 'playedDayNumbers' | 'techniqueUsageCounts'
>;

export const gameGetPersistedAggregates = (state: PersistedAggregatesType): PersistedAggregatesType => ({
    historyByDifficulty: state.historyByDifficulty,
    playedDayNumbers: state.playedDayNumbers,
    techniqueUsageCounts: state.techniqueUsageCounts,
    dailyCompletedDayNumbers: state.dailyCompletedDayNumbers,
    dailyBestStreak: state.dailyBestStreak
});
