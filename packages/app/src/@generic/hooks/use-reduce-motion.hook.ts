import { use } from 'react';

import { useSettings } from '../../settings/query/use-settings.query';
import { settingsIsMotionReduced } from '../../settings/utils/settings-is-motion-reduced.util';
import { SystemMotionContext } from '../components/system-motion-provider/context/system-motion.context';

export const useReduceMotion = (): boolean => {
    const isSystemMotionReduced = use(SystemMotionContext);
    const { motionPreference } = useSettings();

    return settingsIsMotionReduced(motionPreference, isSystemMotionReduced);
};
