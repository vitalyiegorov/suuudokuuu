import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { DefaultUiTheme } from '../constant/default-ui-theme.constant';
import { UiThemeContext } from '../context/ui-theme.context';

export const useUiTheme = () => {
    const contextValue = use(UiThemeContext);

    if (isDefined(contextValue)) {
        return contextValue;
    }

    return { theme: DefaultUiTheme };
};
