import { SafeAreaInsetsContext, SafeAreaProvider } from 'react-native-safe-area-context';

import type { ReactNode } from 'react';
import type { EdgeInsets } from 'react-native-safe-area-context';

interface Props {
    readonly children: ReactNode;
}

const MinimumWebSafeAreaInset = 24;

const floorInsets = (insets: EdgeInsets | null): EdgeInsets => ({
    left: insets?.left ?? 0,
    right: insets?.right ?? 0,
    bottom: Math.max(insets?.bottom ?? 0, MinimumWebSafeAreaInset),
    top: Math.max(insets?.top ?? 0, MinimumWebSafeAreaInset)
});

export const SafeAreaFloorProvider = ({ children }: Props) => (
    <SafeAreaProvider>
        <SafeAreaInsetsContext.Consumer>
            {insets => <SafeAreaInsetsContext value={floorInsets(insets)}>{children}</SafeAreaInsetsContext>}
        </SafeAreaInsetsContext.Consumer>
    </SafeAreaProvider>
);
