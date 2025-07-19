import { Alert as RNAlert } from 'react-native';

import type { AlertButton } from 'react-native/Libraries/Alert/Alert';

export const Alert = (title: string, message?: string, buttons?: AlertButton[]) => void RNAlert.alert(title, message, buttons);
