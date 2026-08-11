import { AppButton } from '@suuudokuuu/ui';

import { HomeScreenStartButtonEmber } from '../home-screen-start-button-ember/home-screen-start-button-ember';
import { HomeScreenStartButtonShimmer } from '../home-screen-start-button-shimmer/home-screen-start-button-shimmer';

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly children: ReactNode;
    readonly isHellSelected: boolean;
    readonly isInfinitySelected: boolean;
    readonly isLoading: boolean;
    readonly onPress: () => void;
    readonly style: StyleProp<ViewStyle>;
    readonly testID: string;
}

export const HomeScreenStartButton = ({ children, isHellSelected, isInfinitySelected, isLoading, onPress, style, testID }: Props) => {
    if (isHellSelected) {
        return (
            <HomeScreenStartButtonEmber isLoading={isLoading} onPress={onPress} style={style} testID={testID}>
                {children}
            </HomeScreenStartButtonEmber>
        );
    }

    if (isInfinitySelected) {
        return (
            <HomeScreenStartButtonShimmer style={style}>
                <AppButton isLoading={isLoading} onPress={onPress} size="large" style={style} testID={testID} variant="primary">
                    {children}
                </AppButton>
            </HomeScreenStartButtonShimmer>
        );
    }

    return (
        <AppButton isLoading={isLoading} onPress={onPress} size="large" style={style} testID={testID} variant="primary">
            {children}
        </AppButton>
    );
};
