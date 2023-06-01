import { formatDistance } from 'date-fns';

export const getGameDistance = (elapsedTime: number): string => formatDistance(0, elapsedTime * 1000, { includeSeconds: true });
