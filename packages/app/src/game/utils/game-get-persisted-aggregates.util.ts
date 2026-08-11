import type { GameState } from '../store/game.state';

type PersistedAggregatesType = Pick<GameState, 'historyByDifficulty' | 'playedDayNumbers' | 'techniqueUsageCounts'>;

export const gameGetPersistedAggregates = (state: PersistedAggregatesType): PersistedAggregatesType => ({
    historyByDifficulty: state.historyByDifficulty,
    playedDayNumbers: state.playedDayNumbers,
    techniqueUsageCounts: state.techniqueUsageCounts
});
