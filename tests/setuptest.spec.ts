import { test } from "../fixtures/omnipizza";

test.describe("setup & auth", ()=>{
    test("lands on /catalog", async({page, catalogPage}) =>{
        await page.goto("/catalog");

        await catalogPage.expectLoaded();
        await catalogPage.expectHasPizzas();
    });
});