import { expect, test } from '@playwright/test';
import { CampaignSelectors } from '@suuudokuuu/app/src/selectors';
import { FieldEngine, findStepScript } from '@suuudokuuu/field-core';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { createTechniqueStrategies } from '@suuudokuuu/techniques';

import { campaignLessons } from '../../../packages/progress/src/campaign/constant/campaign-lessons.constant';
import { launchHome } from '../src/utils/launch-home.util';
import { cellTestId } from '../src/utils/test-id.util';
import { getVisibleByTestId } from '../src/utils/visible-locator.util';

import type { Page } from '@playwright/test';

const wrongDigitOffset = 1;
const digitCount = 9;
const campaignTimeoutMilliseconds = 120000;

const solvePractice = async (
    page: Page,
    lesson: (typeof campaignLessons)[number],
    practice: (typeof campaignLessons)[number]['practices'][number]
): Promise<void> => {
    const engine = new FieldEngine({ sudokuString: practice.board, difficulty: DifficultyEnum.Newbie });
    const script = findStepScript(
        engine.Sudoku,
        createTechniqueStrategies().filter(strategy => strategy.technique === lesson.technique)
    );
    const target = script?.placement ?? script?.eliminations[0];

    expect(target).toBeDefined();
    if (!target) {
        return;
    }

    await page.getByTestId(`${CampaignSelectors.PRACTICE}.${practice.id}`).click();
    await expect(page.getByTestId(CampaignSelectors.TEACH)).toHaveCount(0);
    const targetCell = page.getByTestId(cellTestId(target.cell.y, target.cell.x));
    const targetCandidate = targetCell.getByText(String(target.value), { exact: true });

    await targetCell.click();
    if (!script?.placement) {
        await expect(targetCandidate).toBeVisible();
    }
    if (lesson.technique === campaignLessons[0].technique) {
        await page.getByTestId(`${CampaignSelectors.VALUE}.${(target.value % digitCount) + wrongDigitOffset}`).click();
        await expect(page.getByTestId(CampaignSelectors.FEEDBACK)).toContainText('Try another digit');
        await expect(page.getByTestId(CampaignSelectors.SUCCESS)).toHaveCount(0);
    }
    await page.getByTestId(`${CampaignSelectors.VALUE}.${target.value}`).dblclick();
    await expect(page.getByTestId(CampaignSelectors.SUCCESS)).toBeVisible();
    await expect(page.getByTestId(CampaignSelectors.FEEDBACK)).toBeEmpty();
    if (!script?.placement) {
        await expect(targetCandidate).toHaveCount(0);
    }
};

test('placement and elimination practices unlock every lesson and survive a reload', async ({ page }) => {
    test.setTimeout(campaignTimeoutMilliseconds);
    await launchHome(page);
    await getVisibleByTestId(page, CampaignSelectors.ENTRY).click();
    await expect(page.getByTestId(CampaignSelectors.ROOT)).toBeVisible();

    for (const [lessonIndex, lesson] of campaignLessons.entries()) {
        const lessonRow = page.getByTestId(`${CampaignSelectors.LESSON}.${lesson.technique}`);
        const nextLesson = campaignLessons.at(lessonIndex + 1);

        if (nextLesson) {
            await expect(page.getByTestId(`${CampaignSelectors.LESSON}.${nextLesson.technique}`).getByRole('button')).toBeDisabled();
        }
        await lessonRow.getByRole('button').click();
        for (const practice of lesson.practices) {
            await solvePractice(page, lesson, practice);
        }
        await page.goto('/campaign');
        await expect(lessonRow).toContainText('Practices: 2/2');
        await page.reload();
        await expect(lessonRow).toContainText('Practices: 2/2');
        if (nextLesson) {
            await expect(page.getByTestId(`${CampaignSelectors.LESSON}.${nextLesson.technique}`).getByRole('button')).toBeEnabled();
        }
    }
});
