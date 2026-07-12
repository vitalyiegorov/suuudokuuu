import { createContext } from 'react';

import type { UiThemeContextValueInterface } from '../interface/ui-theme-context-value.interface';

export const UiThemeContext = createContext<null | UiThemeContextValueInterface>(null);
