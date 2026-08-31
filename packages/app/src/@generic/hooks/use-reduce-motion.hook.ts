import { use } from 'react';

import { settingsMotionPreferenceSelector } from '../../settings/store/settings.selectors';
import { settingsIsMotionReduced } from '../../settings/utils/settings-is-motion-reduced.util';
import { SystemMotionContext } from '../components/system-motion-provider/context/system-motion.context';

import { useAppSelector } from './use-app-selector.hook';

export const useReduceMotion = (): boolean => {
    const isSystemMotionReduced = use(SystemMotionContext);
    const motionPreference = useAppSelector(settingsMotionPreferenceSelector);

    return settingsIsMotionReduced(motionPreference, isSystemMotionReduced);
};
