export const gameCreateDeferredTaskQueue = () => {
    const pendingTasks = new Map<ReturnType<typeof setTimeout>, () => void>();

    const schedule = (task: () => void): void => {
        const timeoutId = setTimeout(() => {
            pendingTasks.delete(timeoutId);
            task();
        }, 0);

        pendingTasks.set(timeoutId, task);
    };

    const flush = (): void => {
        pendingTasks.forEach((task, timeoutId) => {
            clearTimeout(timeoutId);
            task();
        });
        pendingTasks.clear();
    };

    return { schedule, flush };
};
