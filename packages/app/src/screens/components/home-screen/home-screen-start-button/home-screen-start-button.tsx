import { AppButton } from '@suuudokuuu/ui';

import { HomeScreenStartButtonEmber } from '../home-screen-start-button-ember/home-screen-start-button-ember';

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly children: ReactNode;
    readonly color: string | null;
    readonly isLoading: boolean;
    readonly onPress: () => void;
    readonly style: StyleProp<ViewStyle>;
    readonly testID: string;
}

export const HomeScreenStartButton = ({ children, color, isLoading, onPress, style, testID }: Props) => {
    if (color !== null) {
        return (
            <HomeScreenStartButtonEmber color={color} isLoading={isLoading} onPress={onPress} style={style} testID={testID}>
                {children}
            </HomeScreenStartButtonEmber>
        );
    }

    return (
        <AppButton isLoading={isLoading} onPress={onPress} size="large" style={style} testID={testID} variant="primary">
            {children}
        </AppButton>
    );
};
