import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { AppMetricStripContext } from '../context/app-metric-strip.context';

export const useAppMetricStripColor = () => {
    const context = use(AppMetricStripContext);

    if (!isDefined(context)) {
        throw new Error('useAppMetricStripColor must be used within an AppMetricStrip');
    }

    return context;
};
