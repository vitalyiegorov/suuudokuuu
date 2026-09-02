import { WebSplashElementId } from '../constants/web-splash.constant';

export const hideAppSplashScreen = (): Promise<void> => {
    document.getElementById(WebSplashElementId)?.remove();

    return Promise.resolve();
};
