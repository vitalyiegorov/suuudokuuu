import { AppButton } from '@suuudokuuu/ui';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';

import { isDefined } from '@rnw-community/shared';

import { useVibration } from '../../hooks/use-vibration.hook';

import type { AppButtonProps } from '@suuudokuuu/ui';
import type { Link } from 'expo-router';
import type { ComponentProps } from 'react';

interface Props extends AppButtonProps {
    readonly href?: ComponentProps<typeof Link>['href'];
    readonly replace?: ComponentProps<typeof Link>['replace'];
}

export const AppLinkButton = ({ href, onPress, replace, ...restProps }: Props) => {
    const router = useRouter();
    const [, hapticImpact] = useVibration();

    const handlePress: AppButtonProps['onPress'] = event => {
        onPress?.(event);

        hapticImpact(ImpactFeedbackStyle.Light);

        if (isDefined(href)) {
            if (isDefined(replace)) {
                router.replace(href);
            } else {
                router.navigate(href);
            }
        }
    };

    return <AppButton {...restProps} onPress={handlePress} />;
};
