import * as Schema from 'effect/Schema';
import { Redirect, useLocalSearchParams } from 'expo-router';

import { HomeHrefConstant } from '../../@generic/constants/home-href.constant';
import { StoreIntentScreen } from '../../screens/components/store-intent-screen/store-intent.screen';
import { StoreIntentSchema } from '../../screens/schema/store-intent.schema';

export default function StartPage() {
    const { intent } = useLocalSearchParams<{ intent?: string | string[] }>();

    return Schema.is(StoreIntentSchema)(intent) ? <StoreIntentScreen intent={intent} /> : <Redirect href={HomeHrefConstant} />;
}
