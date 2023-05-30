import { emptyHistory, type HistoryInterface } from '../interfaces/history.interface';

interface HistoryState extends HistoryInterface {}

export const initialHistoryState: HistoryState = {
    ...emptyHistory
};
