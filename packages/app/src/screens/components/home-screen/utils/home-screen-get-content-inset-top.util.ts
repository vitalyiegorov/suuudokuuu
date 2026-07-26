import { HomeScreenTopContentPadding, HomeScreenTopOverlayHeight } from '../constant/home-screen.constant';

export const homeScreenGetContentInsetTop = (safeAreaTop: number): number =>
    Math.max(HomeScreenTopContentPadding, HomeScreenTopOverlayHeight - safeAreaTop);
