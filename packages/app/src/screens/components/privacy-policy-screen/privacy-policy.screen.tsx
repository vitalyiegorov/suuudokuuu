import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';

import { PrivacyPolicyScreenStyles } from './privacy-policy-screen.styles';
import { privacyPolicyConstant } from './privacy-policy.constant';

export const PrivacyPolicyScreen = () => {
    const { t } = useLingui();

    return (
        <CollapsibleChromePage
            contentStyle={PrivacyPolicyScreenStyles.content}
            showsVerticalScrollIndicator={false}
            style={resolveUnistyleForAnimated(PrivacyPolicyScreenStyles.scrollView)}
            title={t`Privacy policy`}
        >
            <BlackText>{privacyPolicyConstant}</BlackText>
        </CollapsibleChromePage>
    );
};
