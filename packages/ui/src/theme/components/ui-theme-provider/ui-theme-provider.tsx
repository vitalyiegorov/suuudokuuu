import { useMemo } from 'react';

import { UiThemeContext } from '../../context/ui-theme.context';

import type { ThemeInterface } from '../../interface/theme.interface';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly theme: ThemeInterface;
}

export const UiThemeProvider = ({ children, theme }: Props) => {
    const value = useMemo(() => ({ theme }), [theme]);

    return <UiThemeContext value={value}>{children}</UiThemeContext>;
};
