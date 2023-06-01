export const getElapsedTime = (startTime: number, offset = 0): number => Math.floor((Date.now() - startTime) / 1000) + offset;
