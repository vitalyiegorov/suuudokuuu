import React, { use, useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { cs } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { BlackText } from '../black-text/black-text';

import { ToggleSelectStyles as styles } from './toggle-select.style';

import type { OnEventFn } from '@rnw-community/shared';

interface Props<T> {
    readonly options: readonly T[];
    readonly initialValue: T;
    readonly onChange: OnEventFn<T>;
    readonly toNumberFn: (value: T) => number;
    readonly toTextFn: (value: T) => string;
    readonly toggleWidth?: number;
    readonly toggleHeight?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const ToggleSelect = <T extends unknown>(props: Props<T>) => {
    const { options, initialValue, onChange, toNumberFn, toTextFn, toggleHeight = 50, toggleWidth = 300 } = props;

    const { theme } = use(ThemeContext);

    const [selectedValue, setSelectedValue] = useState(initialValue);
    const animatedValue = useRef(new Animated.Value(toNumberFn(initialValue))).current;

    const handlePress = (value: T, index: number) => () => {
        setSelectedValue(value);
        onChange(value);
        Animated.spring(animatedValue, {
            toValue: index,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10
        }).start();
    };

    const toggleSliderWidth = toggleWidth / options.length;
    const toggleSliderHeight = toggleHeight * 0.8;
    const toggleSliderVerticalPadding = (toggleHeight - toggleSliderHeight) / 2;

    const translateX = animatedValue.interpolate({
        inputRange: options.map((_, index) => index),
        outputRange: options.map((_, index) => index * toggleSliderWidth)
    });
    const scaleX = animatedValue.interpolate({
        inputRange: options.map((_, index) => index),
        outputRange: options.map((_, index) => {
            if (index === 0 || index === options.length - 1) {
                return 0.8;
            }

            return 1;
        })
    });

    const getButtonTextStyle = (value: T) => [
        styles.label,
        cs(selectedValue === value, styles.selectedLabel),
        { color: selectedValue === value ? theme.text.main : theme.text.inverted }
    ];

    const toggleContainerStyle = [
        styles.toggleContainer,
        { backgroundColor: theme.colors.black, height: toggleHeight, width: toggleWidth }
    ];
    const sliderStyle = [
        styles.slider,
        {
            transform: [{ translateX }, { scaleX }],
            backgroundColor: theme.colors.white,
            shadowColor: theme.colors.black,
            top: toggleSliderVerticalPadding,
            width: toggleSliderWidth,
            height: toggleHeight * 0.8
        }
    ];
    const buttonStyle = [styles.button, { width: toggleSliderWidth }];

    return (
        <View style={toggleContainerStyle}>
            <Animated.View style={sliderStyle} />
            {options.map((value, index) => (
                <Pressable key={`option-${toTextFn(value)}`} onPress={handlePress(value, index)} style={buttonStyle}>
                    <BlackText style={getButtonTextStyle(value)}>{toTextFn(value)}</BlackText>
                </Pressable>
            ))}
        </View>
    );
};
