import { isDefined } from '@rnw-community/shared';

import type { AlertButton } from 'react-native/Libraries/Alert/Alert';

const isCancelButton = (button: AlertButton) => button.style === 'cancel';

// TODO: Simple web wrapper for the alert https://github.com/necolas/react-native-web/issues/1026
export const Alert = (title: string, message?: string, buttons?: AlertButton[]) => {
    const confirmButton = buttons?.find(button => !isCancelButton(button));
    const cancelButton = buttons?.find(isCancelButton);

    // eslint-disable-next-line no-alert
    const isConfirmed = confirm(`${title}\n${message ?? ''}`);
    const pressedButton = isConfirmed ? confirmButton : cancelButton;

    if (isDefined(pressedButton) && isDefined(pressedButton.onPress)) {
        pressedButton.onPress();
    }
};
