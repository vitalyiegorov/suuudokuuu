import { createContext } from 'react';

import type { AppMetricStripContextValueInterface } from '../interface/app-metric-strip-context-value.interface';

export const AppMetricStripContext = createContext<AppMetricStripContextValueInterface | null>(null);
