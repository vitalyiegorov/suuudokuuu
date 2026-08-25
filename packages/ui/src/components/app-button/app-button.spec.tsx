import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppButton } from './app-button';
import { AppButtonLoaderTestId } from './constant/app-button-loader-test-id.constant';

const buttonTestId = 'app-button';

describe('AppButton', () => {
    it('should render the loader and hide the text while loading', async () => {
        await render(<AppButton isLoading testID={buttonTestId} text="Start puzzle" />);

        expect(screen.getByTestId(AppButtonLoaderTestId)).toBeTruthy();
        expect(screen.getByText('Start puzzle')).not.toBeVisible();
    });

    it('should expose busy and disabled accessibility state while loading', async () => {
        await render(<AppButton isLoading testID={buttonTestId} text="Start puzzle" />);

        expect(screen.getByTestId(buttonTestId)).toBeBusy();
        expect(screen.getByTestId(buttonTestId)).toBeDisabled();
    });

    it('should ignore presses while loading', async () => {
        const handlePress = jest.fn();

        await render(<AppButton isLoading onPress={handlePress} testID={buttonTestId} text="Start puzzle" />);
        await fireEvent.press(screen.getByTestId(buttonTestId));

        expect(handlePress).not.toHaveBeenCalled();
    });

    it('should invoke onPress when it is neither loading nor disabled', async () => {
        const handlePress = jest.fn();

        await render(<AppButton onPress={handlePress} testID={buttonTestId} text="Start puzzle" />);
        await fireEvent.press(screen.getByTestId(buttonTestId));

        expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('should keep a caller accessibility state alongside the busy and disabled flags it owns', async () => {
        const accessibilityState = { checked: true };

        await render(<AppButton accessibilityState={accessibilityState} testID={buttonTestId} text="Notes mode" />);

        expect(screen.getByTestId(buttonTestId)).toHaveProp(
            'accessibilityState',
            expect.objectContaining({ busy: false, checked: true, disabled: false })
        );
    });

    it('should stay disabled without a loader when disabled is passed explicitly', async () => {
        const handlePress = jest.fn();

        await render(<AppButton disabled onPress={handlePress} testID={buttonTestId} text="Start puzzle" />);
        await fireEvent.press(screen.getByTestId(buttonTestId));

        expect(screen.getByText('Start puzzle')).toBeTruthy();
        expect(screen.getByTestId(buttonTestId)).toBeDisabled();
        expect(screen.getByTestId(buttonTestId)).not.toBeBusy();
        expect(handlePress).not.toHaveBeenCalled();
    });
});
