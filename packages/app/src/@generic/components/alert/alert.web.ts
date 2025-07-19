import { isDefined } from '@rnw-community/shared';

import type { AlertButton } from 'react-native/Libraries/Alert/Alert';


// TODO: Simple web wrapper for the alert https://github.com/necolas/react-native-web/issues/1026
export const Alert = (title: string, message?: string, buttons?: AlertButton[]) => {
    const okButton = buttons?.find(button => button.text === 'OK');
    const cancelButton = buttons?.find(button => button.text === 'Cancel');

    // eslint-disable-next-line no-alert
    if (confirm(`${title}\n${message ?? ''}`)) {
        if (isDefined(okButton) && isDefined(okButton.onPress)) {
            okButton.onPress();
        }
    } else if (isDefined(cancelButton) && isDefined(cancelButton.onPress)) {
        cancelButton.onPress();
    }
};
