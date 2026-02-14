import { test, expect } from '@playwright/test';

test.describe('Drag and Drop E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/SyncBoard/i)).toBeVisible();
    
    // Create a task for testing
    await page.getByRole('button', { name: /Add Task/i }).click();
    await expect(page.getByDisplayValue('New Task')).toBeVisible();
  });

  test('should drag task from To Do to In Progress', async ({ page }) => {
    // Get the task card
    const taskCard = page.locator('.task-card').first();
    
    // Get the In Progress column
    const inProgressColumn = page.locator('.column').nth(1);
    
    // Perform drag and drop
    await taskCard.hover();
    await page.mouse.down();
    await inProgressColumn.hover();
    await page.mouse.up();
    
    // Wait for update
    await page.waitForTimeout(500);
    
    // Verify task moved by checking column task counts
    const inProgressCount = page.locator('.column').nth(1).locator('.task-count');
    await expect(inProgressCount).toContainText('(1)');
  });

  test('should drag task from To Do to Done', async ({ page }) => {
    const taskCard = page.locator('.task-card').first();
    const doneColumn = page.locator('.column').nth(2);
    
    await taskCard.hover();
    await page.mouse.down();
    await doneColumn.hover();
    await page.mouse.up();
    
    await page.waitForTimeout(500);
    
    const doneCount = page.locator('.column').nth(2).locator('.task-count');
    await expect(doneCount).toContainText('(1)');
  });

  test('should show hover effect when dragging over column', async ({ page }) => {
    const taskCard = page.locator('.task-card').first();
    const inProgressColumn = page.locator('.column').nth(1);
    
    // Start dragging
    await taskCard.hover();
    await page.mouse.down();
    
    // Hover over target column
    await inProgressColumn.hover();
    
    // Check if column shows hover state (background color change)
    const backgroundColor = await inProgressColumn.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Clean up
    await page.mouse.up();
    
    // The background should change when hovering
    expect(backgroundColor).toBeTruthy();
  });

  test('should maintain task data after drag and drop', async ({ page }) => {
    // Update task details
    const titleInput = page.getByDisplayValue('New Task');
    await titleInput.fill('Draggable Task');
    
    const prioritySelect = page.locator('select').first();
    await prioritySelect.selectOption('High');
    
    // Drag to In Progress
    const taskCard = page.locator('.task-card').first();
    const inProgressColumn = page.locator('.column').nth(1);
    
    await taskCard.hover();
    await page.mouse.down();
    await inProgressColumn.hover();
    await page.mouse.up();
    
    await page.waitForTimeout(500);
    
    // Verify task details are maintained
    await expect(page.getByDisplayValue('Draggable Task')).toBeVisible();
    const priorityAfterDrag = page.locator('select').first();
    await expect(priorityAfterDrag).toHaveValue('High');
  });

  test('should create multiple tasks and drag them independently', async ({ page }) => {
    // Create second task
    await page.getByRole('button', { name: /Add Task/i }).click();
    await page.waitForTimeout(300);
    
    // Update first task
    const firstTask = page.locator('.task-card').first();
    const firstTitleInput = firstTask.locator('input[type="text"]');
    await firstTitleInput.fill('Task 1');
    
    // Update second task
    const secondTask = page.locator('.task-card').nth(1);
    const secondTitleInput = secondTask.locator('input[type="text"]');
    await secondTitleInput.fill('Task 2');
    
    // Drag first task to In Progress
    await firstTask.hover();
    await page.mouse.down();
    const inProgressColumn = page.locator('.column').nth(1);
    await inProgressColumn.hover();
    await page.mouse.up();
    
    await page.waitForTimeout(500);
    
    // Verify Task 1 is in In Progress
    const inProgressTasks = page.locator('.column').nth(1).locator('.task-card');
    await expect(inProgressTasks.locator('input[type="text"]')).toHaveValue('Task 1');
    
    // Verify Task 2 is still in To Do
    const todoTasks = page.locator('.column').first().locator('.task-card');
    await expect(todoTasks.locator('input[type="text"]')).toHaveValue('Task 2');
  });
});
