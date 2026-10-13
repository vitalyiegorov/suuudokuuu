import { expect, test } from '@playwright/test';
import { CampaignSelectors } from '@suuudokuuu/app/src/selectors';
import { FieldEngine, findStepScript } from '@suuudokuuu/field-core';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { CandidateContext, createTechniqueStrategies } from '@suuudokuuu/techniques';

import { campaignLessons } from '../../../packages/progress/src/campaign/constant/campaign-lessons.constant';
import { launchHome } from '../src/utils/launch-home.util';
import { cellTestId } from '../src/utils/test-id.util';
import { getVisibleByTestId } from '../src/utils/visible-locator.util';

import type { Page } from '@playwright/test';

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
        await expect(lessonRow).toContainText('Unassisted practices: 2/2');
        await page.reload();
        await expect(lessonRow).toContainText('Unassisted practices: 2/2');
        if (nextLesson) {
            await expect(page.getByTestId(`${CampaignSelectors.LESSON}.${nextLesson.technique}`).getByRole('button')).toBeEnabled();
        }
    }
});

test('a wrong practice digit earns completion without mastery and permits a clean retry', async ({ page }) => {
    const [lesson, nextLesson] = campaignLessons;
    const [practice] = lesson.practices;
    const engine = new FieldEngine({ sudokuString: practice.board, difficulty: DifficultyEnum.Newbie });
    const script = findStepScript(
        engine.Sudoku,
        createTechniqueStrategies().filter(strategy => strategy.technique === lesson.technique)
    );
    const target = script?.placement;

    expect(target).toBeDefined();
    if (!target) {
        return;
    }
    await page.goto(`/campaign/${lesson.technique}`);
    await page.getByTestId(`${CampaignSelectors.PRACTICE}.${practice.id}`).click();
    await page.getByTestId(`${CampaignSelectors.VALUE}.${(target.value % 9) + 1}`).click();
    await expect(page.getByTestId(CampaignSelectors.FEEDBACK)).toBeEmpty();
    await page.getByTestId(cellTestId(target.cell.y, target.cell.x)).click();
    await page.getByTestId(`${CampaignSelectors.VALUE}.${(target.value % 9) + 1}`).click();
    await expect(page.getByTestId(CampaignSelectors.FEEDBACK)).not.toBeEmpty();
    await page.getByTestId(`${CampaignSelectors.VALUE}.${target.value}`).click();
    await expect(page.getByTestId(CampaignSelectors.SUCCESS)).toBeVisible();
    await page.goto('/campaign');
    await expect(page.getByTestId(`${CampaignSelectors.LESSON}.${lesson.technique}`)).toContainText('Unassisted practices: 0/2');
    await expect(page.getByTestId(`${CampaignSelectors.LESSON}.${nextLesson.technique}`).getByRole('button')).toBeDisabled();
    await page.goto(`/campaign/${lesson.technique}`);
    await expect(page.getByTestId(`${CampaignSelectors.PRACTICE}.${practice.id}`)).toContainText('Complete');
    await solvePractice(page, lesson, practice);
    await page.goto('/campaign');
    await expect(page.getByTestId(`${CampaignSelectors.LESSON}.${lesson.technique}`)).toContainText('Unassisted practices: 1/2');
});

test('an unknown campaign technique redirects to the curriculum', async ({ page }) => {
    await page.goto('/campaign/xyz');
    await expect(page).toHaveURL(/\/campaign$/u);
    await expect(page.getByTestId(CampaignSelectors.ROOT)).toBeVisible();
});

test('a cold first lesson never renders the locked message while loading', async ({ page }) => {
    await page.addInitScript(() => {
        const observer = new MutationObserver(() => {
            if (document.querySelector('body')?.textContent.includes('Complete the previous lesson to unlock this one.')) {
                document.documentElement.dataset['campaignLockedFlash'] = 'true';
            }
        });
        observer.observe(document, { childList: true, subtree: true, characterData: true });
    });
    await page.goto(`/campaign/${campaignLessons[0].technique}`);
    await expect(page.getByTestId(CampaignSelectors.TEACH)).toBeVisible();
    await expect(page.locator('html')).not.toHaveAttribute('data-campaign-locked-flash', 'true');
});

test('practice accepts another valid deduction for the selected technique', async ({ page }) => {
    const [firstLesson, lesson] = campaignLessons;
    const [practice] = lesson.practices;
    const engine = new FieldEngine({ sudokuString: practice.board, difficulty: DifficultyEnum.Newbie });
    const selectedStrategies = createTechniqueStrategies().filter(strategy => strategy.technique === lesson.technique);
    const script = findStepScript(engine.Sudoku, selectedStrategies);
    const target = script?.placement;

    expect(target).toBeDefined();
    if (!target) {
        return;
    }
    const alternative = selectedStrategies
        .flatMap(strategy => strategy.find(CandidateContext.fromSudoku(engine.Sudoku)))
        .find(result => result.kind === 'placement' && (result.cell.x !== target.cell.x || result.cell.y !== target.cell.y));

    expect(alternative?.kind).toBe('placement');
    if (!alternative || alternative.kind !== 'placement') {
        return;
    }
    await page.goto(`/campaign/${firstLesson.technique}`);
    for (const firstPractice of firstLesson.practices) {
        await solvePractice(page, firstLesson, firstPractice);
    }
    await page.goto(`/campaign/${lesson.technique}`);
    await page.getByTestId(`${CampaignSelectors.PRACTICE}.${practice.id}`).click();
    await page.getByTestId(cellTestId(alternative.cell.y, alternative.cell.x)).click();
    await page.getByTestId(`${CampaignSelectors.VALUE}.${alternative.value}`).click();
    await expect(page.getByTestId(CampaignSelectors.SUCCESS)).toContainText('Practice complete without help.');
    await expect(page.getByTestId(CampaignSelectors.FEEDBACK)).toBeEmpty();
});
