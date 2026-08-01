import { AppButton, resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { use, useState } from 'react';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { ThemeContext } from '../../../../theme/context/theme.context';

import { HomeScreenStartButtonEmberFillLocations } from './constant/home-screen-start-button-ember.constant';
import { HomeScreenStartButtonEmberSelectors } from './home-screen-start-button-ember.selectors';
import { HomeScreenStartButtonEmberStyles as styles } from './home-screen-start-button-ember.styles';
import { useHomeScreenStartButtonEmberAnimation } from './use-home-screen-start-button-ember-animation.hook';

import type { ReactNode } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

const emberGradientStart = { x: 0, y: 0 };
const emberGradientEnd = { x: 1, y: 1 };
const emberSheenEnd = { x: 1, y: 0 };

interface Props {
    readonly children: ReactNode;
    readonly isLoading: boolean;
    readonly onPress: () => void;
    readonly style: StyleProp<ViewStyle>;
    readonly testID: string;
}

export const HomeScreenStartButtonEmber = ({ children, isLoading, onPress, style, testID }: Props) => {
    const { theme } = use(ThemeContext);
    const reduceMotion = useReducedMotion();
    const [surfaceWidth, setSurfaceWidth] = useState(0);
    const { sheenStyle, wrapperStyle } = useHomeScreenStartButtonEmberAnimation(reduceMotion, surfaceWidth);

    const handleSurfaceLayout = (event: LayoutChangeEvent) => void setSurfaceWidth(event.nativeEvent.layout.width);

    const wrapperUnistyles = reduceMotion
        ? [styles.emberWrapper, styles.emberGlow, styles.emberStaticGlow]
        : [styles.emberWrapper, styles.emberGlow];
    const animatedStyles = reduceMotion ? [] : [wrapperStyle];
    const emberWrapperStyle = [...wrapperUnistyles.map(resolveUnistyleForAnimated), ...animatedStyles];
    const emberSheenStyle = [resolveUnistyleForAnimated(styles.emberSheen), sheenStyle];
    const emberWrapperTestId = reduceMotion
        ? HomeScreenStartButtonEmberSelectors.StaticRoot
        : HomeScreenStartButtonEmberSelectors.AnimatedRoot;
    const emberButtonWrapperStyle = [style, styles.emberButton];
    const emberFillColors = [theme.colors.danger, theme.colors.danger, theme.colors.ink] as const;
    const emberSheenColors = ['transparent', theme.colors.overlayLight, 'transparent'] as const;

    return (
        <Animated.View style={emberWrapperStyle} testID={emberWrapperTestId}>
            <View onLayout={handleSurfaceLayout} pointerEvents="none" style={styles.emberSurface}>
                <LinearGradient
                    colors={emberFillColors}
                    end={emberGradientEnd}
                    locations={HomeScreenStartButtonEmberFillLocations}
                    start={emberGradientStart}
                    style={styles.emberFill}
                />

                {!reduceMotion && (
                    <Animated.View style={emberSheenStyle}>
                        <LinearGradient colors={emberSheenColors} end={emberSheenEnd} start={emberGradientStart} style={styles.emberFill} />
                    </Animated.View>
                )}
            </View>

            <AppButton
                isLoading={isLoading}
                onPress={onPress}
                size="large"
                style={emberButtonWrapperStyle}
                testID={testID}
                variant="primary"
            >
                {children}
            </AppButton>
        </Animated.View>
    );
};
