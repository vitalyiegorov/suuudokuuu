import { use } from 'react';

import { useSettings } from '../../settings/query/use-settings.query';
import { SystemMotionContext } from '../components/system-motion-provider/context/system-motion.context';

export const useReduceMotion = (): boolean => {
    const isSystemMotionReduced = use(SystemMotionContext);
    const { motionPreference } = useSettings();

    if (motionPreference === 'full') {
        return false;
    }

    if (motionPreference === 'reduced') {
        return true;
    }

    return isSystemMotionReduced;
};
