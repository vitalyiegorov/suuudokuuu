export const gameScreenExit = (resetGame: () => void, dismissToHome: (href: '/') => void) => {
    resetGame();
    dismissToHome('/');
};
