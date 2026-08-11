const DIGIT_KEY_PATTERN = /^[1-9]$/u;

export const getKeyDigit = (key: string): number | null => (DIGIT_KEY_PATTERN.test(key) ? Number(key) : null);
