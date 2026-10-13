import { campaignLessons } from '../constant/campaign-lessons.constant';

import { getLessonUnassistedPracticeCount } from './get-lesson-unassisted-practice-count.util';

import type { CampaignProgressSchema } from '../schema/campaign-progress.schema';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const getUnlockedCampaignTechniques = (progress: readonly (typeof CampaignProgressSchema.Type)[]) => {
    const unlockedTechniques: SolutionTechniqueEnum[] = [];

    for (const lesson of campaignLessons) {
        unlockedTechniques.push(lesson.technique);

        if (getLessonUnassistedPracticeCount(lesson, progress) < lesson.practices.length) {
            break;
        }
    }

    return unlockedTechniques;
};
