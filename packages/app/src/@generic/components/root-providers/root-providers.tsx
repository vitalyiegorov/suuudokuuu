import { RegistryContext } from '@effect/atom-react/RegistryContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { appAtomRegistry } from '../../constants/app-atom-registry.constant';
import { BootGate } from '../boot-gate/boot-gate';
import { SafeAreaFloorProvider } from '../safe-area-floor-provider/safe-area-floor-provider';
import { SystemMotionProvider } from '../system-motion-provider/system-motion-provider';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

const rootProvidersStyle = { flex: 1 };

export const RootProviders = ({ children }: Props) => (
    <GestureHandlerRootView style={rootProvidersStyle}>
        <RegistryContext.Provider value={appAtomRegistry}>
            <BootGate>
                <SafeAreaFloorProvider>
                    <SystemMotionProvider>{children}</SystemMotionProvider>
                </SafeAreaFloorProvider>
            </BootGate>
        </RegistryContext.Provider>
    </GestureHandlerRootView>
);
