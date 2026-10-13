import type { CampaignPracticeInterface } from './campaign-practice.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface CampaignLessonInterface {
    readonly technique: SolutionTechniqueEnum;
    readonly exampleBoard: string;
    readonly practices: readonly CampaignPracticeInterface[];
}
