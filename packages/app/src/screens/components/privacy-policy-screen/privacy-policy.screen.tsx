import { useLingui } from '@lingui/react/macro';
import { useAppLayout } from '@suuudokuuu/ui';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ReturnableScreenChrome } from '../../../@generic/components/returnable-screen-chrome/returnable-screen-chrome';
import { ReturnableScreenScrollView } from '../../../@generic/components/returnable-screen-scroll-view/returnable-screen-scroll-view';

import { PrivacyPolicyScreenStyles } from './privacy-policy-screen.styles';
import { privacyPolicyConstant } from './privacy-policy.constant';

export const PrivacyPolicyScreen = () => {
    const { t } = useLingui();
    const { sizeClass } = useAppLayout();

    return (
        <ReturnableScreenChrome contentStyle={PrivacyPolicyScreenStyles.content} title={t`Privacy policy`}>
            <ReturnableScreenScrollView showsVerticalScrollIndicator={false} style={PrivacyPolicyScreenStyles.scrollView(sizeClass)}>
                <BlackText>{privacyPolicyConstant}</BlackText>
            </ReturnableScreenScrollView>
        </ReturnableScreenChrome>
    );
};
