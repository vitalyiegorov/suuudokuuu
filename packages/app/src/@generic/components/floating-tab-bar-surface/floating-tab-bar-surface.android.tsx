import { use } from 'react';
import { View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { FloatingTabBarSurfaceStyles as styles } from './floating-tab-bar-surface.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const FloatingTabBarSurface = ({ children }: Props) => {
    const { theme } = use(ThemeContext);

    const surfaceStyles = [styles.pill, { backgroundColor: theme.colors.surface.raised, borderColor: theme.colors.surface.border }];

    return <View style={surfaceStyles}>{children}</View>;
};
