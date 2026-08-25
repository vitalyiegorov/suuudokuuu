import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';

import { SystemMotionContext } from '../components/system-motion-provider/context/system-motion.context';
import { createAppTestStore } from '../utils/create-app-test-store.mock';

import { useReduceMotion } from './use-reduce-motion.hook';

import type { SettingsState } from '../../settings/store/settings.state';

const renderReduceMotion = async (motionPreference: SettingsState['motionPreference'], isSystemMotionReduced: boolean) => {
    const store = createAppTestStore({ settings: { motionPreference } });
    const results: boolean[] = [];

    const ReduceMotionProbe = () => {
        results.push(useReduceMotion());

        return null;
    };

    await render(
        <Provider store={store}>
            <SystemMotionContext value={isSystemMotionReduced}>
                <ReduceMotionProbe />
            </SystemMotionContext>
        </Provider>
    );

    return results.at(-1);
};

describe('useReduceMotion', () => {
    it('should reduce motion when the operating system asks for it and the player has no override', async () => {
        expect.assertions(2);

        expect(await renderReduceMotion('system', true)).toBe(true);
        expect(await renderReduceMotion('system', false)).toBe(false);
    });

    it('should let an explicit player override win over the operating system', async () => {
        expect.assertions(2);

        expect(await renderReduceMotion('full', true)).toBe(false);
        expect(await renderReduceMotion('reduced', false)).toBe(true);
    });
});
