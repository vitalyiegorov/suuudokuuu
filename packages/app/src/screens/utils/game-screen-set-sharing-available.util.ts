import * as Sharing from 'expo-sharing';

import type { Dispatch, SetStateAction } from 'react';

export const gameScreenSetSharingAvailable = (setHasSharing: Dispatch<SetStateAction<boolean>>): void => {
    Sharing.isAvailableAsync()
        .then(result => void setHasSharing(result))
        .catch(() => void setHasSharing(false));
};
