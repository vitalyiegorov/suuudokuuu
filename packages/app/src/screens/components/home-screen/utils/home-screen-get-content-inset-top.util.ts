import { HomeScreenTopContentPadding, HomeScreenTopOverlayHeight } from '../constant/home-screen.constant';

export const homeScreenGetContentInsetTop = (safeAreaTop: number, platformInsetTop: number): number =>
    Math.max(HomeScreenTopOverlayHeight, safeAreaTop + HomeScreenTopContentPadding) - safeAreaTop - platformInsetTop;
