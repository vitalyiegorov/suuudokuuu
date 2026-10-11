import type { CampaignLessonInterface } from '../interface/campaign-lesson.interface';
import type { CampaignProgressSchema } from '../schema/campaign-progress.schema';

export const getLessonUnassistedPracticeCount = (
    lesson: CampaignLessonInterface,
    progress: readonly (typeof CampaignProgressSchema.Type)[]
): number => {
    const completedPractices = progress.find(row => row.technique === lesson.technique)?.unassistedPracticeIds ?? [];

    return lesson.practices.filter(practice => completedPractices.includes(practice.id)).length;
};
