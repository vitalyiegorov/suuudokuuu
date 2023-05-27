export const durationToNumber = (duration: Duration): number => {
    const years = 365 * 24 * 3600 * (duration.years ?? 0);
    const months = 30 * 24 * 3600 * (duration.months ?? 0);
    const days = 24 * 3600 * (duration.days ?? 0);
    const hours = 3600 * (duration.hours ?? 0);
    const minutes = 60 * (duration.minutes ?? 0);
    const seconds = duration.seconds ?? 0;

    const total = years + months + days + hours + minutes + seconds;

    return total === 0 ? Infinity : total;
};

export const isDurationLower = (a: Duration, b: Duration): boolean => durationToNumber(a) < durationToNumber(b);
