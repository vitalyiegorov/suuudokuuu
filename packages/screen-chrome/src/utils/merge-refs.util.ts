import { Ref, RefCallback } from 'react';

import { isDefined } from '@rnw-community/shared';

export const mergeRefs =
    <TRef>(...refs: ReadonlyArray<Ref<TRef> | undefined>): RefCallback<TRef> =>
    (instance: TRef | null): void => {
        refs.forEach(ref => {
            if (!isDefined(ref)) {
                return;
            }

            if (typeof ref === 'function') {
                ref(instance);

                return;
            }

            ref.current = instance;
        });
    };
