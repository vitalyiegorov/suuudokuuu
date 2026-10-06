import { deepStrictEqual } from 'node:assert/strict';

import { RATED_DIFFICULTY_LADDER } from '../src/difficulty/constants/difficulty-name.constant';
import { RATING_SAMPLE_PUZZLES } from '../src/rating/constants/rating-sample.constant';
import { TIER_TECHNIQUE_REPORTS } from '../src/rating/constants/tier-technique-reports.constant';
import { buildTierTechniqueReports } from '../src/rating/utils/build-tier-technique-reports.util';

deepStrictEqual(
    TIER_TECHNIQUE_REPORTS,
    buildTierTechniqueReports(RATED_DIFFICULTY_LADDER.map(difficulty => RATING_SAMPLE_PUZZLES[difficulty]))
);
process.stdout.write('Committed tier technique reports match a fresh computation\n');
