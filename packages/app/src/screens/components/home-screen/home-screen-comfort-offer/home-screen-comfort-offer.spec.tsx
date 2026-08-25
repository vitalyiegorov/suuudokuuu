import { describe, expect, it } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithAppStore } from '../../../../@generic/utils/render-with-app-store.mock';
import { HomeScreenSelectors } from '../home-screen.selectors';

import { HomeScreenComfortOffer } from './home-screen-comfort-offer';

import type { SettingsState } from '../../../../settings/store/settings.state';

const renderComfortOffer = (settings: Partial<SettingsState> = {}) => renderWithAppStore(<HomeScreenComfortOffer />, settings);

describe('HomeScreenComfortOffer', () => {
    it('offers comfort mode on a fresh install', async () => {
        await renderComfortOffer();

        expect(screen.getByTestId(HomeScreenSelectors.ComfortOffer)).toBeTruthy();
    });

    it('never offers comfort mode again once the offer was dismissed', async () => {
        await renderComfortOffer({ comfortModeOfferDismissed: true });

        expect(screen.queryByTestId(HomeScreenSelectors.ComfortOffer)).toBeNull();
    });

    it('never offers comfort mode while it is already on', async () => {
        await renderComfortOffer({ comfortMode: 'on' });

        expect(screen.queryByTestId(HomeScreenSelectors.ComfortOffer)).toBeNull();
    });

    it('applies the preset from the offer', async () => {
        const store = await renderComfortOffer();

        await fireEvent.press(screen.getByTestId(HomeScreenSelectors.ComfortOfferEnable));

        expect(store.getState().settings.comfortMode).toBe('on');
        expect(store.getState().settings.fontSize).toBe('xl');
    });

    it('remembers a dismissal without changing any preference', async () => {
        const store = await renderComfortOffer();

        await fireEvent.press(screen.getByTestId(HomeScreenSelectors.ComfortOfferDismiss));

        expect(store.getState().settings.comfortModeOfferDismissed).toBe(true);
        expect(store.getState().settings.comfortMode).toBe('off');
        expect(store.getState().settings.fontSize).toBe('m');
    });
});
