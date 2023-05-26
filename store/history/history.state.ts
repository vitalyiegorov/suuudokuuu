import { emptyHistoryState, type HistoryInterface } from '../../interfaces/history.interface';

export interface HistoryState extends HistoryInterface {}

export const historyState: HistoryState = {
    ...emptyHistoryState
};
