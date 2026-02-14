import { test, expect } from '@playwright/test';

test.describe('Kanban Board E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to load
    await expect(page.getByText(/SyncBoard/i)).toBeVisible();
  });

  test('should display kanban board with three columns', async ({ page }) => {
    await expect(page.getByText('📋 To Do')).toBeVisible();
    await expect(page.getByText('⚙️ In Progress')).toBeVisible();
    await expect(page.getByText('✅ Done')).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /Add Task/i });
    await addButton.click();

    // Wait for the task to appear
    await expect(page.getByDisplayValue('New Task')).toBeVisible();
    
    // Verify task count increased
    const taskCountElements = page.locator('.task-count');
    const firstCount = await taskCountElements.first().textContent();
    expect(firstCount).toContain('(1)');
  });

  test('should update task title', async ({ page }) => {
    // Create a task first
    await page.getByRole('button', { name: /Add Task/i }).click();
    await expect(page.getByDisplayValue('New Task')).toBeVisible();

    // Update the title
    const titleInput = page.getByDisplayValue('New Task');
    await titleInput.fill('Updated Task Title');
    await titleInput.blur();

    // Verify the update
    await expect(page.getByDisplayValue('Updated Task Title')).toBeVisible();
  });

  test('should change task priority', async ({ page }) => {
    // Create a task
    await page.getByRole('button', { name: /Add Task/i }).click();
    await expect(page.getByDisplayValue('New Task')).toBeVisible();

    // Find and change priority dropdown
    const prioritySelect = page.locator('select').first();
    await prioritySelect.selectOption('High');

    // Verify the selection
    await expect(prioritySelect).toHaveValue('High');
  });

  test('should change task category', async ({ page }) => {
    // Create a task
    await page.getByRole('button', { name: /Add Task/i }).click();
    await expect(page.getByDisplayValue('New Task')).toBeVisible();

    // Find and change category dropdown
    const categorySelect = page.locator('select').nth(1);
    await categorySelect.selectOption('Bug');

    // Verify the selection
    await expect(categorySelect).toHaveValue('Bug');
  });

  test('should delete a task', async ({ page }) => {
    // Create a task
    await page.getByRole('button', { name: /Add Task/i }).click();
    await expect(page.getByDisplayValue('New Task')).toBeVisible();

    // Listen for confirm dialog and accept it
    page.on('dialog', dialog => dialog.accept());

    // Click delete button
    const deleteButton = page.getByRole('button', { name: '×' });
    await deleteButton.click();

    // Verify task is removed
    await expect(page.getByDisplayValue('New Task')).not.toBeVisible();
  });

  test('should add task description', async ({ page }) => {
    // Create a task
    await page.getByRole('button', { name: /Add Task/i }).click();
    await expect(page.getByDisplayValue('New Task')).toBeVisible();

    // Add description
    const descriptionTextarea = page.getByPlaceholder('Add description...');
    await descriptionTextarea.fill('This is a test description');

    // Verify description
    await expect(descriptionTextarea).toHaveValue('This is a test description');
  });

  test('should display task statistics', async ({ page }) => {
    // Verify stats are visible
    await expect(page.getByText('Total Tasks')).toBeVisible();
    await expect(page.getByText('To Do')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
    await expect(page.getByText('Done')).toBeVisible();
    await expect(page.getByText('Completion')).toBeVisible();

    // Create a task and verify statistics update
    await page.getByRole('button', { name: /Add Task/i }).click();
    await page.waitForTimeout(500); // Wait for state update

    // Verify count updated
    const statValues = page.locator('.stat-value');
    const totalTasksValue = await statValues.first().textContent();
    expect(parseInt(totalTasksValue)).toBeGreaterThan(0);
  });

  test('should display charts', async ({ page }) => {
    await expect(page.getByText('Tasks by Status')).toBeVisible();
    await expect(page.getByText('Task Distribution')).toBeVisible();
    await expect(page.getByText('Tasks by Priority')).toBeVisible();
  });

  test('should show empty column message when no tasks', async ({ page }) => {
    // All columns should show empty state initially
    const emptyMessages = page.getByText('Drop tasks here');
    const count = await emptyMessages.count();
    expect(count).toBeGreaterThanOrEqual(2); // At least 2 empty columns
  });
});
