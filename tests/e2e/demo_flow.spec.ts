import { test, expect } from '@playwright/test';

test.describe('STSC Prototype Full E2E Journey', () => {

  test('1. Clean NFST Applicant applies and gets AI-cleared to Institute Verification', async ({ page }) => {
    // 1. Applicant Login
    await page.goto('/login');
    await page.fill('[name="username"]', 'clean_applicant');
    await page.click('button:has-text("Login")');

    // 2. Draft & Apply
    await page.click('text=New NFST Application');
    await page.fill('[name="fullName"]', 'Rahul Munda');
    await page.click('button:has-text("Fetch from DigiLocker")'); // Adapter Mock
    await page.click('button:has-text("Submit Application")');
    
    // 3. Status Check (AI Engine auto-cleared)
    await expect(page.locator('.status-badge')).toContainText('Institute Verification Pending');
  });

  test('2. Deficient Applicant (Name Mismatch) -> Fix & Resubmit', async ({ page }) => {
    // 1. Login as Deficient App
    await page.goto('/login');
    await page.fill('[name="username"]', 'deficient_applicant');
    await page.click('button:has-text("Login")');

    // 2. See Deficiency Card
    await expect(page.locator('.deficiency-card')).toBeVisible();
    await expect(page.locator('.deficiency-card')).toContainText('Action Required: Name mismatch');
    
    // 3. Fix & Resubmit
    await page.click('button:has-text("Fix and Resubmit Document")');
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/correct_document.pdf');
    await page.click('button:has-text("Submit Correction")');

    // 4. State Transition Check
    await expect(page.locator('.status-badge')).toContainText('Scrutiny Pending');
  });

  test('3. Institute Nodal Officer reviews queue and approves', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="username"]', 'institute_officer');
    await page.click('button:has-text("Login")');

    // SLA Badge Check
    const slaBadge = page.locator('.sla-badge').first();
    await expect(slaBadge).toBeVisible();

    // Verify Document & Approve
    await page.click('button:has-text("View Documents")');
    await page.click('button:has-text("Approve")');

    // Ensure it left the queue
    await expect(page.locator('text=Rahul Munda')).not.toBeVisible();
  });

  test('4. Selection Committee reviews ranking and executes Audit-Logged Override', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="username"]', 'selection_committee');
    await page.click('button:has-text("Login")');

    // Expand applicant to see score breakdown
    await page.click('text=Vikram Singh');
    await expect(page.locator('text=Merit Configuration Breakdown')).toBeVisible();

    // Execute Override
    await page.fill('textarea[placeholder*="Mandatory justification"]', 'Overriding due to QS Top 100 exception manually confirmed.');
    await page.click('button:has-text("Execute Override")');

    // Verify it succeeded
    await expect(page.locator('text=Override Successful')).toBeVisible();
  });

  test('5. Policy Change Module: Clarification (No Change) vs Explicit Revision (Diff Detected)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="username"]', 'ministry_admin');
    await page.click('button:has-text("Login")');

    // Navigate to Policy Changes
    await page.click('text=Policy Proposals');
    
    // Upload 04.08.2026 Clarification Notice
    await page.setInputFiles('input[type="file"]', 'documents/notice_04_08_2026_clarification.pdf');
    await page.click('button:has-text("Process Document")');
    await expect(page.locator('.ai-result')).toContainText('No rule change detected');

    // Upload Fictional 60/40 Revision
    await page.setInputFiles('input[type="file"]', 'documents/circular_fictional_60_40_revision.pdf');
    await page.click('button:has-text("Process Document")');
    await expect(page.locator('.ai-result')).toContainText('Explicit revision of merit components detected');
    
    // Impact Preview
    await page.click('button:has-text("Generate Impact Preview")');
    await expect(page.locator('text=Entered Top Allocation')).toBeVisible();

    // Approver flow
    await page.click('button:has-text("Approve Policy Change")');
    await expect(page.locator('text=New Scheme Version Deployed')).toBeVisible();
  });

});
