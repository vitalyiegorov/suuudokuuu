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
    readonly itemsPerRow?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const ToggleSelect = <T extends unknown>(props: Props<T>) => {
    const { options, initialValue, onChange, toNumberFn, toTextFn, toggleHeight = 50, toggleWidth = 300, itemsPerRow = 3 } = props;

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

    const itemsInRow = Math.min(options.length, itemsPerRow);
    const rows = Math.ceil(options.length / itemsInRow);
    const containerHeight = rows * toggleHeight;
    const itemWidth = toggleWidth / itemsInRow;
    const sliderInnerHeight = toggleHeight * 0.8;
    const sliderVerticalPadding = (toggleHeight - sliderInnerHeight) / 2;

    // eslint-disable-next-line react-hooks/refs
    const translateX = animatedValue.interpolate({
        inputRange: options.map((_, index) => index),
        outputRange: options.map((_, index) => (index % itemsInRow) * itemWidth)
    });

    // eslint-disable-next-line react-hooks/refs
    const translateY = animatedValue.interpolate({
        inputRange: options.map((_, index) => index),
        outputRange: options.map((_, index) => Math.floor(index / itemsInRow) * toggleHeight + sliderVerticalPadding)
    });

    const getButtonTextStyle = (value: T) => [
        styles.label,
        cs(selectedValue === value, styles.selectedLabel),
        { color: selectedValue === value ? theme.colors.label.main : theme.colors.label.inverted }
    ];

    const toggleContainerStyle = [
        styles.toggleContainer,
        { backgroundColor: theme.colors.black, height: containerHeight, width: toggleWidth }
    ];
    const sliderStyle = [
        styles.slider,
        {
            transform: [{ translateX }, { translateY }],
            backgroundColor: theme.colors.white,
            shadowColor: theme.colors.black,
            width: itemWidth,
            height: sliderInnerHeight
        }
    ];
    const buttonStyle = [styles.button, { width: itemWidth, height: toggleHeight }];

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
