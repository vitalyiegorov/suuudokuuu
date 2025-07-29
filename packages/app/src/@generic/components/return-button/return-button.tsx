import { useLingui } from '@lingui/react/macro';
import { useRouter } from 'expo-router';

import { BlackButton } from '../black-button/black-button';

export const ReturnButton = () => {
    const { t } = useLingui();
    const router = useRouter();

    const handleReturn = () => void router.back();

    return <BlackButton onPress={handleReturn} text={t`Return`} />;
};
