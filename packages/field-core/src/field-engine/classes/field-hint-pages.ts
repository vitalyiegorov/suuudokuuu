import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { HintLevelEnum } from '../../step-script/enums/hint-level.enum';
import { StepScriptStepKindEnum } from '../../step-script/enums/step-script-step-kind.enum';
import { getStepLinkCount } from '../../step-script/utils/get-step-link-count.util';

import type { HintPageInterface } from '../../step-script/interfaces/hint-page.interface';
import type { StepScriptInterface } from '../../step-script/interfaces/step-script.interface';
import type { StepScriptStepType } from '../../step-script/types/step-script-step.type';

const singleLinkPageLimit = 6;
const linkGroupSize = 4;
const hintLevelOrder: readonly HintLevelEnum[] = [HintLevelEnum.TECHNIQUE, HintLevelEnum.PATTERN, HintLevelEnum.WALKTHROUGH];
const emptyHintPage: HintPageInterface = { hintLevel: HintLevelEnum.WALKTHROUGH, stepIndex: 0, revealedImplicationCount: 0 };

const getRevealedLinkCounts = (linkCount: number): number[] => {
    const groupSize = linkCount > singleLinkPageLimit ? linkGroupSize : 1;

    return Array.from({ length: Math.max(Math.ceil(linkCount / groupSize), 1) }, (_, groupIndex) =>
        Math.min((groupIndex + 1) * groupSize, linkCount)
    );
};

export class FieldHintPages {
    private pages: readonly HintPageInterface[] = [];
    private pageIndex = 0;
    private revealedHintLevel = HintLevelEnum.WALKTHROUGH;

    get CurrentPage(): HintPageInterface {
        return this.pages.at(this.pageIndex) ?? emptyHintPage;
    }

    get PageIndex(): number {
        return this.pageIndex;
    }

    get PageCount(): number {
        return this.pages.length;
    }

    get IsNextPageCharged(): boolean {
        const nextPage = this.pages.at(this.pageIndex + 1);

        return isDefined(nextPage) && hintLevelOrder.indexOf(nextPage.hintLevel) > hintLevelOrder.indexOf(this.revealedHintLevel);
    }

    start(script: StepScriptInterface, hintLevel: HintLevelEnum): void {
        const levelPages = hintLevelOrder
            .slice(hintLevelOrder.indexOf(hintLevel), -1)
            .map(level => ({ hintLevel: level, stepIndex: 0, revealedImplicationCount: 0 }));
        const firstRevealIndex = script.steps.findIndex(step => step.kind === StepScriptStepKindEnum.RevealCandidates);
        const isPatternRepeat = (step: StepScriptStepType, stepIndex: number): boolean =>
            isNotEmptyArray(levelPages) && stepIndex === firstRevealIndex && !isDefined(step.narration.placement);
        const walkthroughPages = script.steps.flatMap((step, stepIndex) =>
            (isPatternRepeat(step, stepIndex) ? [] : getRevealedLinkCounts(getStepLinkCount(step))).map(revealedImplicationCount => ({
                hintLevel: HintLevelEnum.WALKTHROUGH,
                stepIndex,
                revealedImplicationCount
            }))
        );

        this.pages = script.technique === SolutionTechniqueEnum.Guess ? [emptyHintPage] : [...levelPages, ...walkthroughPages];
        this.pageIndex = 0;
        this.revealedHintLevel = this.CurrentPage.hintLevel;
    }

    clear(): void {
        this.pages = [];
        this.pageIndex = 0;
        this.revealedHintLevel = HintLevelEnum.WALKTHROUGH;
    }

    showPage(pageIndex: number): number {
        if (pageIndex < 0 || pageIndex >= this.pages.length) {
            return -1;
        }

        const { hintLevel } = this.pages[pageIndex];
        const revealedLevelCount = Math.max(hintLevelOrder.indexOf(hintLevel) - hintLevelOrder.indexOf(this.revealedHintLevel), 0);

        this.pageIndex = pageIndex;
        this.revealedHintLevel = revealedLevelCount > 0 ? hintLevel : this.revealedHintLevel;

        return revealedLevelCount;
    }

    findStepPageIndex(stepIndex: number): number {
        return stepIndex < 0 ? -1 : this.pages.map(page => page.stepIndex).lastIndexOf(stepIndex);
    }

    findLevelPageIndex(): number {
        return this.pages.findIndex(page => page.hintLevel === this.CurrentPage.hintLevel);
    }
}
