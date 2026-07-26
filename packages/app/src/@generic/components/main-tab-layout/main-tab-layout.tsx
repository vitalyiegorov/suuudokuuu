import { isLiquidGlassAvailable } from 'expo-glass-effect';

import { FloatingTabLayout } from '../floating-tab-layout/floating-tab-layout';
import { NativeTabLayout } from '../native-tab-layout/native-tab-layout';

export const MainTabLayout = () => (isLiquidGlassAvailable() ? <NativeTabLayout /> : <FloatingTabLayout />);
