import type { DailyStatusType } from '../types/daily-status.type';

export const dailyGetStatus = (todayDayNumber: number, completedDayNumbers: readonly number[], runDayNumber: number): DailyStatusType => {
    if (completedDayNumbers.includes(todayDayNumber)) {
        return 'completed';
    }

    if (runDayNumber === todayDayNumber) {
        return 'inProgress';
    }

    return 'available';
};
