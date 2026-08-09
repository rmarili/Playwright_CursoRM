import { test, expect } from "../../fixtures/omnipizza"

test.describe("Fixture inject POM", () => {
    test("The fixture deliver login/catalog pages ready to use", async ({ 
        loginPage, catalogPage, standardUser, defaultMarket 
    }) => {
        //Arrange
        await loginPage.goto();

        //Act
        await loginPage.loginInMarket(standardUser, defaultMarket.code)

        //Assert
        await catalogPage.expectLoaded();
        await catalogPage.expectHasPizzas();
    })

    test("UI reacts when th API respond 500", async({
        page, loginPage, standardUser, defaultMarket,
    }) => {
        await page.route("**/api/pizzas/*", (route) =>{
           route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({detail: "internal Server Error (moked)"})
           });
        });

        await loginPage.loginInMarket(standardUser, defaultMarket.code);
        
        await expect (page.locator("body")).toBeVisible();
    })
})