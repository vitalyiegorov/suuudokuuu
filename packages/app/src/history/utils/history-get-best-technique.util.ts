import type { TechniqueUsageInterface } from '../interfaces/technique-usage.interface';

export const historyGetBestTechnique = (usageList: readonly TechniqueUsageInterface[]): TechniqueUsageInterface | undefined => usageList[0];
