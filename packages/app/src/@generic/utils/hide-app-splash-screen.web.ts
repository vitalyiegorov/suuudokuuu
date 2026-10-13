export const hideAppSplashScreen = (): Promise<void> => {
    document.getElementById('app-splash')?.remove();

    return Promise.resolve();
};
