import { emptyHistory, type HistoryInterface } from '../../interfaces/history.interface';

export interface HistoryState extends HistoryInterface {}

export const initialHistoryState: HistoryState = {
    ...emptyHistory
};
