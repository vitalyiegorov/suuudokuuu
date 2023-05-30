import { type HistoryInterface, emptyHistory } from '../interfaces/history.interface';

// ts-prune-ignore-next
export interface HistoryState extends HistoryInterface {}

export const initialHistoryState: HistoryState = {
    ...emptyHistory
};
