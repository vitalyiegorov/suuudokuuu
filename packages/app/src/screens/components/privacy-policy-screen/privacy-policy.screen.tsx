import { ScrollView, Text, View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { Header } from '../../../@generic/components/header/header';
import { PageHeader } from '../../../@generic/components/page-header/page-header';

import { privacyPolicyConstant } from './privacy-policy.constant';
import { PrivacyPolicyScreenStyles } from './privacy-policy.styles';

export const PrivacyPolicyScreen = () => (
    <View style={PrivacyPolicyScreenStyles.container}>
        <PageHeader title="Privacy policy" />

        <Header text="Privacy policy" />

        <ScrollView contentContainerStyle={PrivacyPolicyScreenStyles.scrollView}>
            <Text style={PrivacyPolicyScreenStyles.text}>{privacyPolicyConstant}</Text>
        </ScrollView>

        <BlackButton href="/" text="Return" />
    </View>
);
