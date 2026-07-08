import { type ComponentProps } from 'react';

import { BlackButton } from '../black-button/black-button';

import { BlackIconButtonStyles as styles } from './black-icon-button.styles';

interface Props extends Omit<ComponentProps<typeof BlackButton>, 'style'> {
    readonly style?: ComponentProps<typeof BlackButton>['style'];
}

export const BlackIconButton = ({ style, ...props }: Props) => {
    const buttonStyles = [styles.button, style];

    return <BlackButton style={buttonStyles} {...props} />;
};
