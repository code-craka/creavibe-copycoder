import { test, expect } from "@playwright/test"

test.describe("Navigation", () => {
  test("should navigate between pages", async ({ page }) => {
    // Start at the home page
    await page.goto("/")

    // The home page should have the correct title
    await expect(page).toHaveTitle(/CreaVibe/)

    // Navigate to the features page
    await page.click("text=Features")

    // The URL should be updated
    await expect(page).toHaveURL(/.*features/)

    // Navigate to the pricing page
    await page.click("text=Pricing")

    // The URL should be updated
    await expect(page).toHaveURL(/.*pricing/)

    // Navigate to the contact page
    await page.click("text=Contact")

    // The URL should be updated
    await expect(page).toHaveURL(/.*contact/)

    // Navigate back to the home page
    await page.click("text=CreaVibe")

    // The URL should be updated
    await expect(page).toHaveURL("/")
  })

  test("should open and navigate the mobile menu", async ({ page }) => {
    // Set the viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 })

    // Start at the home page
    await page.goto("/")

    // Open the mobile menu
    await page.click('button[aria-label="Toggle menu"]')

    // The mobile menu should be visible
    await expect(page.locator("nav >> text=Home")).toBeVisible()

    // Navigate to the features page
    await page.click("nav >> text=Features")

    // The URL should be updated
    await expect(page).toHaveURL(/.*features/)

    // The mobile menu should be closed
    await expect(page.locator("nav >> text=Home")).not.toBeVisible()
  })
})
