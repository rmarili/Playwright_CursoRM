import { test, expect } from "@playwright/test";
import {
    LoginPage,
    CatalogPage,
    MenuPage,
    CheckoutPage,
    ProfilePage,
    PizzaCustomizerModal,
} from "../pages";
import { Market, User, Currency } from "../types";
import marketJson from "../data/markets.json" with {type: "json"};
import usersJson from "../data/users.json" with {type: "json"};

const markets = marketJson as Market[];
const users = usersJson as User[];

const standardUser = users.find((user) => user.username === "standard_user");
const marketMX = markets.find((m) => m.code === "MX")!;

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
            const catalogPage = new CatalogPage(page);
            //Arrange
            await loginPage.goto();

            //Act 
            await loginPage.loginInMarket(standardUser, market.code)

            //Assert
            await catalogPage.expectLoaded();
            await catalogPage.expectHasPizzas();
        });
    }
});

test.describe("POM — using granular actions", () => {
  test("POM API demonstration", { tag: "@smoke" }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);

    await loginPage.goto();
    await loginPage.selectMarket("MX");
    await loginPage.loginAs(standardUser);

    await catalogPage.waitForCatalog();
    const names = await catalogPage.getPizzaNames();
    console.log(`Pizzas in MX: ${names.length}`);
  });
});

test.describe("POM — MenuPage: navigating between authenticated screens", () => {
  test("nav links move across profile, checkout and catalog", { tag: "@regression" }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);
    const menuPage = new MenuPage(page);
    const profilePage = new ProfilePage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.loginInMarket(standardUser, "MX");
    await catalogPage.expectLoaded();

    await menuPage.goToProfile();
    await profilePage.expectLoaded();

    await menuPage.goToCatalog();
    await catalogPage.expectLoaded();
    await catalogPage.addFirstPizza();

    await menuPage.goToCheckout();

    await checkoutPage.expectLoaded();

    await menuPage.logout();
    await loginPage.expectLoaded();
  });
});

test.describe("POM — CheckoutPage: filling and confirming an order", () => {
  test("checkoutWith(market) fills the form and opens the confirmation modal", { tag: "@regression" }, async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);
    const menuPage = new MenuPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.loginInMarket(standardUser, "MX");
    await catalogPage.waitForCatalog();
    await catalogPage.addFirstPizza();
    await catalogPage.expectCartCount(1);

    await menuPage.goToCheckout();
    await checkoutPage.expectLoaded();

    await checkoutPage.checkoutWith(marketMX);
    await checkoutPage.expectConfirmation();
  });
});

test.describe("POM — PizzaCustomizerModal: choosing options, confirming and cancelling", () => {
  test("confirm() selects size + topping and adds the pizza to the cart", { tag: "@regression" }, async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);
    const pizzaCustomizer = new PizzaCustomizerModal(page);
    const menuPage = new MenuPage(page);

    await loginPage.loginInMarket(standardUser, "MX");
    await catalogPage.expectLoaded();
    await catalogPage.openCustomizerForFirst();

    await pizzaCustomizer.expectOpen();
    await pizzaCustomizer.selectSize("large");
    await pizzaCustomizer.toggleTopping("mushrooms");
    await pizzaCustomizer.confirm();
    await pizzaCustomizer.expectClosed();

    await menuPage.expectCartCount(1);
  });

  test("close() dismisses the modal and leaves the cart untouched", { tag: "@regression" }, async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);
    const pizzaCustomizer = new PizzaCustomizerModal(page);
    const menuPage = new MenuPage(page);

    await loginPage.loginInMarket(standardUser, "MX");
    await catalogPage.expectLoaded();

    await catalogPage.openCustomizerForFirst();
    await pizzaCustomizer.expectOpen();
    await pizzaCustomizer.selectSize("medium");
    await pizzaCustomizer.close();
    await pizzaCustomizer.expectClosed();

    expect(await menuPage.getCartCount()).toBe("0");
  });
});

test.describe("POM — ProfilePage: the native date picker and saving changes", () => {
  test("fill('YYYY-MM-DD') sets the birthday without touching the calendar", { tag: "@regression" }, async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);
    const profilePage = new ProfilePage(page);

    await loginPage.loginInMarket(standardUser, "MX");
    await catalogPage.expectLoaded();

    await profilePage.goto();
    await profilePage.expectLoaded();
    await profilePage.setBirthday("1990-05-15");
    await profilePage.expectBirthday("1990-05-15");
  });

  test("save() submits the profile form", { tag: "@regression" }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);
    const profilePage = new ProfilePage(page);

    await loginPage.loginInMarket(standardUser, "MX");
    await catalogPage.expectLoaded();

    await profilePage.goto();
    await profilePage.expectLoaded();
    await profilePage.setBirthday("1985-03-20");
    await profilePage.fillNotes("No onions, please");
    await profilePage.save();

    await profilePage.expectBirthday("1985-03-20");
  });
});