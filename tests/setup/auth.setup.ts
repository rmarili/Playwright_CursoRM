import { test as setup, expect } from "../../fixtures/omnipizza";

const authFile = ".auth/user.json";

setup("auhtenticate", async({page, loginPage, standardUser, defaultMarket})=>{
    setup.setTimeout(90_000);

    await loginPage.loginInMarket(standardUser, defaultMarket.code);

    await expect(page).toHaveURL(/\/catalog/);

    await page.context().storageState({path: authFile});
});