import { useLingui } from '@lingui/react/macro';
import { useRouter } from 'expo-router';

import { BlackButton } from '../black-button/black-button';

export const ReturnButton = () => {
    const { t } = useLingui();
    const router = useRouter();

    const handleReturn = () => (router.canGoBack() ? void router.back() : void router.replace('/'));

    return <BlackButton onPress={handleReturn} text={t`Return`} />;
};
