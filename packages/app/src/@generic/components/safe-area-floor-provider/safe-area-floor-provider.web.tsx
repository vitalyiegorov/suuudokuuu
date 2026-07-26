import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';

import { safeAreaGetFlooredInsets } from '../../utils/safe-area-get-floored-insets.util';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const SafeAreaFloorProvider = ({ children }: Props) => {
    const insets = useSafeAreaInsets();
    const flooredInsets = safeAreaGetFlooredInsets(insets);

    return <SafeAreaInsetsContext value={flooredInsets}>{children}</SafeAreaInsetsContext>;
};
