import { ChallengeLossReason } from '../../../../challenge/enums/challenge-loss-reason.enum';

type ResultRouteType = '/winner' | '/loser' | '/challenge-won' | { pathname: '/challenge-lost'; params: { reason: ChallengeLossReason } };

export const gameScreenGetLostRoute = (hasRival: boolean): ResultRouteType =>
    hasRival ? { pathname: '/challenge-lost', params: { reason: ChallengeLossReason.Mistakes } } : '/loser';

export const gameScreenGetWonRoute = (hasRival: boolean, wonChallenge: boolean): ResultRouteType => {
    if (!hasRival) {
        return '/winner';
    }

    return wonChallenge ? '/challenge-won' : { pathname: '/challenge-lost', params: { reason: ChallengeLossReason.Time } };
};
