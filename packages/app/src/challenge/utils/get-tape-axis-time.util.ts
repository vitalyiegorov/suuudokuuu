export const getTapeAxisTime = (elapsedTime: number, tickCount: number): number => {
    const safeElapsedTime = Math.max(Math.trunc(elapsedTime), 0);

    if (safeElapsedTime < tickCount) {
        return safeElapsedTime;
    }

    const secondsPerSlot = Math.floor(safeElapsedTime / tickCount);

    return Math.ceil(safeElapsedTime / secondsPerSlot) * secondsPerSlot;
};
