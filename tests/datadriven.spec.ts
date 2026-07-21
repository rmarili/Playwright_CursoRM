import { test, expect } from '@playwright/test';
import { Market, User, Currency} from "../types";
import marketJson from "../data/markets.json" with {type: "json"};
import userJson from "../data/users.json" with {type: "json"};




const markets = marketJson as Market[];
const users =userJson as User[];

const standardUser = users.find((User) => User.username === "standard_user");


//Guard Clause
if(!standardUser){
    throw new Error("data/users.json doen not contain a user with username 'standar_user'. Check the data seed before runnung");
}

const currencySymbol: Partial<Record<Currency, string>> = {
    MXN: "$",
    JYP: "￥"
}
 
test.describe("Smoke parametrized by market", () => {
  for (const market of markets) {
    test(`TC-${market.code} - login + catalog in market ${market.code}`, async ({ page }) => {
      //Arrange
      await page.goto("/");
 
      //Act
      await page.getByTestId("username-desktop").fill(standardUser.username);
      await page.getByTestId("password-desktop").fill(standardUser.password);
      await page.getByTestId(`market-${market.code}`).click();
      await page.getByTestId("login-button-desktop").click();
 
      //Assert
      await expect(page).toHaveURL(/\/catalog/);
 
      const symbol = currencySymbol[market.currency]

    //Fast Return
      if(!symbol) return;

      await expect(page.locator("body")).toContainText(symbol);
 
    });
  }
});
 