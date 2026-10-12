import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

const MinimumWebSafeAreaInset = 24;

export const SafeAreaFloorProvider = ({ children }: Props) => {
    const insets = useSafeAreaInsets();
    const flooredInsets = {
        ...insets,
        bottom: Math.max(insets.bottom, MinimumWebSafeAreaInset),
        top: Math.max(insets.top, MinimumWebSafeAreaInset)
    };

    return <SafeAreaInsetsContext value={flooredInsets}>{children}</SafeAreaInsetsContext>;
};
