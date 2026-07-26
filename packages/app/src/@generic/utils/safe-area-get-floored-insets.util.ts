import { WebSafeAreaFloorConstant } from '../constants/web-safe-area-floor.constant';

import type { EdgeInsets } from 'react-native-safe-area-context';

export const safeAreaGetFlooredInsets = (insets: EdgeInsets): EdgeInsets => ({
    bottom: Math.max(insets.bottom, WebSafeAreaFloorConstant.bottom),
    left: Math.max(insets.left, WebSafeAreaFloorConstant.left),
    right: Math.max(insets.right, WebSafeAreaFloorConstant.right),
    top: Math.max(insets.top, WebSafeAreaFloorConstant.top)
});
