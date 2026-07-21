import { test, expect } from "@playwright/test";
 
const USERNAME = process.env.TEST_USER_USERNAME ?? "standard_user";
const PASSWORD = process.env.TEST_USER_PASSWORD ?? "pizza123";
 
test.describe("Smoke OmniPizza (M01)", () => {
    test("TC-01 - Successfull login ising valid users credentials", async ({page}) =>{
        //Arrange
        await page.goto("/");
 
        //Act
        await page.getByTestId("username-desktop").fill(USERNAME);
 
        await page.getByTestId("password-desktop").fill(PASSWORD);

        await page.getByTestId("login-button-desktop").click();

        //Assert
        //await expect(page).toHaveURL("/catalog");
        await expect(page).toHaveURL(/\/catalog/);
  });

      test("TC-02 - Catalog shows at least 1 pizza", async ({page}) =>{
        //Arrange
        await page.goto("/");
 
        //Act
        await page.getByTestId("username-desktop").fill(USERNAME);
 
        await page.getByTestId("password-desktop").fill(PASSWORD);

        await page.getByTestId("market-MX").click();

        await page.getByTestId("login-button-desktop").click();

        //Assert
        const pizzaCards = page.locator("[data-testid^='pizza-card-']");
        await expect(pizzaCards.first()).toBeVisible();
        const count = await pizzaCards.count();
        //console.log(count)
        expect(count).toBeGreaterThan(0);
        expect(count).toBeGreaterThanOrEqual(1);
  });


});
