export const addDayNumber = (dayNumbers: readonly number[], dayNumber: number): number[] =>
    dayNumbers.includes(dayNumber)
        ? [...dayNumbers]
        : [...dayNumbers, dayNumber].sort((firstDayNumber, secondDayNumber) => firstDayNumber - secondDayNumber);
