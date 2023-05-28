import { Dimensions } from 'react-native';

export const isMobileScreen = () => Dimensions.get('screen').width < 600;
export const isTabletScreen = () => Dimensions.get('screen').width > 600;
export const isDesktopScreen = () => Dimensions.get('screen').width > 1200;
