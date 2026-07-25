import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';

const RECENT_WINDOW_SECONDS = 3;

interface LatestChallengeTechniqueEvent {
    event: ChallengeTechniqueEventInterface;
    index: number;
}

export const getLatestChallengeTechniqueEvent = (
    events: ChallengeTechniqueEventInterface[],
    elapsedTime: number
): LatestChallengeTechniqueEvent | null => {
    let latest: LatestChallengeTechniqueEvent | null = null;

    for (let index = 0; index < events.length; index += 1) {
        if (events[index].cumulativeTime < elapsedTime) {
            latest = { event: events[index], index };
        }
    }

    if (latest === null || elapsedTime - latest.event.cumulativeTime > RECENT_WINDOW_SECONDS) {
        return null;
    }

    return latest;
};
