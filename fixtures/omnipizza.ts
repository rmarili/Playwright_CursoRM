import { test as base, expect } from "@playwright/test";
import { LoginPage, CatalogPage, CheckoutPage, MenuPage, ProfilePage, PizzaCustomizerModal } from "../pages";
import { Market, User } from "../types";
import marketJson from "../data/markets.json" with {type: "json"};
import usersJson from "../data/users.json" with {type: "json"};
 
const markets = marketJson as Market[];
const user = usersJson as User[];

type PageFixtures = {
    loginPage: LoginPage;
    catalogPage: CatalogPage;
    checkoutPage: CheckoutPage;
    menuPage: MenuPage;
    profilePage: ProfilePage;
    pizzaCustomizer: PizzaCustomizerModal;
    standardUser: User;
}
 
type WorkerFixtures = {
    defaultMarket: Market;
}

export const test = base.extend<PageFixtures, WorkerFixtures>({
    defaultMarket: [async ({}, use) => {
        const us = markets.find((m) => m.code === "US");
        if(!us) throw new Error("Us market not found in data/markets.json");
        await use(us);
    }, {scope:"worker"}],


    standardUser: async({}, use) =>{
      const u = user.find((u) => u.username === "standard_user");
      if(!u) throw new Error("standard_user not found in data/users.json");
      await use(u);
    },

    // test Fictures
    loginPage: async ({page}, use) => {
        await use(new LoginPage(page));
    },

    catalogPage: async ({page}, use) => {
        await use(new CatalogPage(page));
    },

    checkoutPage: async ({page}, use) => {
        await use(new CheckoutPage(page));
    },

    menuPage: async ({page}, use) => {
        await use(new MenuPage(page));
    },

    profilePage: async ({page}, use) => {
        await use(new ProfilePage(page));
    },

    pizzaCustomizer: async ({page}, use) => {
        await use(new PizzaCustomizerModal(page));
    },
});

export {expect};
export type {Market, User}