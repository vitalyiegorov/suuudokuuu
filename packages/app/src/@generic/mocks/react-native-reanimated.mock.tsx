import { View } from 'react-native';

import type { ComponentType } from 'react';

const enteringAnimation = {
    delay: () => enteringAnimation,
    duration: () => enteringAnimation
};

export const FadeIn = enteringAnimation;

const createAnimatedComponent = <Props,>(component: ComponentType<Props>): ComponentType<Props> => component;

export default { View, createAnimatedComponent };
