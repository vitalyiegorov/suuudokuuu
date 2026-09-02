import { WebSplashElementId } from '../constants/web-splash.constant';

import { i18nInitialCatalog } from './i18n-bootstrap';

export const hideAppSplashScreen = (): Promise<void> =>
    i18nInitialCatalog.then(() => void document.getElementById(WebSplashElementId)?.remove());
