import { BlurView } from 'expo-blur';
import { use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ColorSchemaEnum } from '../../../theme/enum/color-schema.enum';
import { FloatingTabBarBlurIntensity } from '../floating-tab-bar/constant/floating-tab-bar.constant';

import { FloatingTabBarSurfaceStyles as styles } from './floating-tab-bar-surface.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const FloatingTabBarSurface = ({ children }: Props) => {
    const { colorScheme, theme } = use(ThemeContext);

    const blurTint = colorScheme === ColorSchemaEnum.Dark ? 'dark' : 'light';
    const surfaceStyles = [styles.pill, { borderColor: theme.colors.value.border }];

    return (
        <BlurView intensity={FloatingTabBarBlurIntensity} style={surfaceStyles} tint={blurTint}>
            {children}
        </BlurView>
    );
};
