import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';

import { PrivacyPolicyScreenSelectors } from './privacy-policy-screen.selectors';
import { PrivacyPolicyScreenStyles } from './privacy-policy-screen.styles';
import { privacyPolicyConstant } from './privacy-policy.constant';

export const PrivacyPolicyScreen = () => {
    const { t } = useLingui();

    return (
        <CollapsibleChromePage
            contentStyle={PrivacyPolicyScreenStyles.content}
            style={resolveUnistyleForAnimated(PrivacyPolicyScreenStyles.scrollView)}
            testID={PrivacyPolicyScreenSelectors.Root}
            title={t`Privacy policy`}
        >
            <BlackText>{privacyPolicyConstant}</BlackText>
        </CollapsibleChromePage>
    );
};
