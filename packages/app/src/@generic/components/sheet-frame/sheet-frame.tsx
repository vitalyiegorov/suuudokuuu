import { Stack } from 'expo-router';
import { use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';

import type { ReactNode } from 'react';

interface Props {
    readonly accessibilityLabel: string;
    readonly children: ReactNode;
    readonly detents: readonly number[];
}

export const SheetFrame = ({ children, detents }: Props) => {
    const { theme } = use(ThemeContext);

    const screenOptions = { contentStyle: { backgroundColor: theme.colors.background }, sheetAllowedDetents: [...detents] };

    return (
        <>
            <Stack.Screen options={screenOptions} />
            {children}
        </>
    );
};
