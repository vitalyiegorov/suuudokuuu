export const gameScreenMaybeStartWinConfetti = (hasRival: boolean, wonChallenge: boolean, startWinConfetti: () => void): void => {
    const isCelebrationWin = !hasRival || wonChallenge;

    if (isCelebrationWin) {
        startWinConfetti();
    }
};
