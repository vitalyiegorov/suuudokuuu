import { BlurMethod } from 'expo-blur';
import { StyleProp, ViewStyle } from 'react-native';

import { EdgeFadePosition } from '../../interface/screen-chrome-config.interface';

import { EdgeFadeScrollAnimationInterface } from './edge-fade-scroll-animation.interface';

export interface EdgeFadePropsInterface {
    readonly position: EdgeFadePosition;
    readonly height?: number;
    readonly intensity?: number;
    readonly scrollAnimation?: EdgeFadeScrollAnimationInterface;
    readonly blurMethod?: BlurMethod;
    readonly style?: StyleProp<ViewStyle>;
}
