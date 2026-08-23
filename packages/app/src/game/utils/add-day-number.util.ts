export const addPlayedDayNumber = (playedDayNumbers: readonly number[], dayNumber: number): number[] =>
    playedDayNumbers.includes(dayNumber)
        ? [...playedDayNumbers]
        : [...playedDayNumbers, dayNumber].sort((firstDayNumber, secondDayNumber) => firstDayNumber - secondDayNumber);
