export const getTimerText = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / (60 * 60));
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    const formattedTime = [formattedMinutes, formattedSeconds];

    if (hours > 0) {
        formattedTime.unshift(formattedHours);
    }

    return formattedTime.join(':');
};
