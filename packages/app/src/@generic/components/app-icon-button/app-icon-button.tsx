import { AppLinkButton } from '../app-link-button/app-link-button';

import { AppIconButtonStyles as styles } from './app-icon-button.styles';

import type { ComponentProps } from 'react';

interface Props extends ComponentProps<typeof AppLinkButton> {
    readonly style?: ComponentProps<typeof AppLinkButton>['style'];
}

export const AppIconButton = ({ style, ...props }: Props) => {
    const buttonStyles = [styles.button, style];

    return <AppLinkButton style={buttonStyles} {...props} />;
};
