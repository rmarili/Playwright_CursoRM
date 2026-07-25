import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { Market, User, Currency } from "../types";
import marketJson from "../data/markets.json" with {type: "json"};
import usersJson from "../data/users.json" with {type: "json"};
 
const markets = marketJson as Market[];
const users = usersJson as User[];
 
const standardUser = users.find((user) => user.username === "standard_user");
 
//Guard Clause
if (!standardUser) {
    throw new Error("data/users.json doen not contain a user with username 'standar_user'. Check the data seed before runnung");
}
 
const currencySymbol: Partial<Record<Currency, string>> = {
    MXN: "$",
    JPY: "¥"
}
 
test.describe("Smoke parametrized by market", () => {
    for (const market of markets) {
        test(`TC-${market.code} - login + catalog in market ${market.code}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            //Arrange
            await loginPage.goTo();
 
            //Act
            await loginPage.loginMarket(standardUser, market.code)
 
            //Assert
            await loginPage.verifyLoginError();
           
            await expect(page).toHaveURL(/\/catalog/);
 
            const symbol = currencySymbol[market.currency];
 
            //Fast Return
            if(!symbol) return;
 
            await expect(page.locator("body")).toContainText(symbol);
           
        });
    }
})