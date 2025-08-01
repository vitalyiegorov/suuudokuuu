import { useLingui } from '@lingui/react/macro';
import { ScrollView, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Header } from '../../../@generic/components/header/header';
import { PageHeader } from '../../../@generic/components/page-header/page-header';
import { ReturnButton } from '../../../@generic/components/return-button/return-button';

import { PrivacyPolicyScreenStyles } from './privacy-policy-screen.styles';
import { privacyPolicyConstant } from './privacy-policy.constant';

export const PrivacyPolicyScreen = () => {
    const { t } = useLingui();

    return (
        <View style={PrivacyPolicyScreenStyles.container}>
            <PageHeader title={t`Privacy policy`} />

            <Header text={t`Privacy policy`} />

            <ScrollView showsVerticalScrollIndicator={false} style={PrivacyPolicyScreenStyles.scrollView}>
                <BlackText>{privacyPolicyConstant}</BlackText>
            </ScrollView>

            <ReturnButton />
        </View>
    );
};
