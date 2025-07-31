import { useLingui } from '@lingui/react/macro';
import React, { use, useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { cs } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../@generic/context/theme.context';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsSetAction } from '../../store/settings.actions';
import { settingsFontSizeSelector } from '../../store/settings.selectors';
import { FontSizes, getFontSizeIndex } from '../../store/settings.state';
import { SettingsGroup } from '../settings-group/settings-group';

import { FontSizeToggleStyles as styles } from './font-size-toggle.style';

import type { SettingsState } from '../../store/settings.state';

export const FontSizeToggle = () => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();

    const dispatch = useAppDispatch();
    const fontSize = useAppSelector(settingsFontSizeSelector);

    const [selectedSize, setSelectedSize] = useState<number>(fontSize);
    const animatedValue = useRef(new Animated.Value(getFontSizeIndex(fontSize))).current;

    const handlePress = (size: SettingsState['fontSize'], index: number) => () => {
        setSelectedSize(size);
        dispatch(settingsSetAction({ fontSize: size }));
        Animated.spring(animatedValue, {
            toValue: index,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10
        }).start();
    };

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [3, 75, 155, 235]
    });

    const getFontSizeText = (size: SettingsState['fontSize']) => {
        switch (getFontSizeIndex(size)) {
            case 0:
                return t`Tiny`;
            case 1:
                return t`Small`;
            case 2:
                return t`Normal`;
            case 3:
                return t`Big`;
            default:
                return t`Unknown`;
        }
    };
    const getButtonTextStyle = (size: SettingsState['fontSize']) => [
        styles.label,
        cs(selectedSize === size, styles.selectedLabel),
        { color: selectedSize === size ? theme.text.inverted : theme.text.main }
    ];

    const toggleContainerStyle = [styles.toggleContainer, { backgroundColor: theme.colors.blue }];
    const sliderStyle = [
        styles.slider,
        { transform: [{ translateX }], backgroundColor: theme.colors.black, shadowColor: theme.colors.black }
    ];

    return (
        <SettingsGroup description={t`Game screen font size`} hasAnotherRow title={t`Font size`}>
            <View style={toggleContainerStyle}>
                <Animated.View style={sliderStyle} />
                {FontSizes.map((size, index) => (
                    <Pressable key={`size-${size}`} onPress={handlePress(size, index)} style={styles.button}>
                        <BlackText style={getButtonTextStyle(size)}>{getFontSizeText(size)}</BlackText>
                    </Pressable>
                ))}
            </View>
        </SettingsGroup>
    );
};
