const DATE_STRING_LENGTH = 10;

export const getDailyDateString = (timestamp: number): string => new Date(timestamp).toISOString().slice(0, DATE_STRING_LENGTH);
