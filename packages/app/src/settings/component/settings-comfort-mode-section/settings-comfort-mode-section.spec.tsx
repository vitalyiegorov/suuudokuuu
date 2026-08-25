import { describe, expect, it } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithAppStore } from '../../../@generic/utils/render-with-app-store.mock';
import { SettingsScreenSelectors } from '../../../screens/components/settings-screen/settings-screen.selectors';
import { ThemeEnum } from '../../../theme/enum/theme.enum';
import { ComfortModeSettings } from '../../constant/comfort-mode.constant';
import { initialSettingsState } from '../../store/settings.state';

import { SettingsComfortModeSection } from './settings-comfort-mode-section';

import type { SettingsState } from '../../store/settings.state';

const renderComfortModeSection = (settings: Partial<SettingsState> = {}) => renderWithAppStore(<SettingsComfortModeSection />, settings);

const pressComfortModeSwitch = () => fireEvent.press(screen.getByTestId(SettingsScreenSelectors.ComfortModeSwitch));

describe('SettingsComfortModeSection', () => {
    it('shows the preset switch off on a fresh install', async () => {
        await renderComfortModeSection();

        expect(screen.getByRole('switch', { checked: false })).toBeTruthy();
    });

    it('applies the preset from the settings switch', async () => {
        const store = await renderComfortModeSection({ fontSize: 'xs', hasTimer: true });

        await pressComfortModeSwitch();

        expect(store.getState().settings.comfortMode).toBe('on');
        expect(store.getState().settings.fontSize).toBe('xl');
        expect(store.getState().settings.hasTimer).toBe(false);
    });

    it('restores the previous preferences when the switch is turned off', async () => {
        const store = await renderComfortModeSection({
            ...ComfortModeSettings,
            comfortMode: 'on',
            comfortModeRestore: { ...initialSettingsState, fontSize: 's', theme: ThemeEnum.Colorful }
        });

        await pressComfortModeSwitch();

        expect(store.getState().settings.comfortMode).toBe('off');
        expect(store.getState().settings.fontSize).toBe('s');
        expect(store.getState().settings.theme).toBe(ThemeEnum.Colorful);
    });

    it('keeps the switch on while the preset is customized', async () => {
        await renderComfortModeSection({ comfortMode: 'customized' });

        expect(screen.getByRole('switch', { checked: true })).toBeTruthy();
    });
});
