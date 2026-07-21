import { test, expect } from "@playwright/test";

const USERNAME = process.env.TEST_USER_USERNAME ?? "standard_user";
const PASSWORD = process.env.TEST_USER_PASSWORD ?? "pizza123";

test.describe("Smokewith locators (M02)", () => {
        test("TC-01 - Catalog shows at least 1 pizza", async ({page}) =>{
        //Arrange
        await page.goto("/");

        //Act 
        const hOneHeader = await page.getByRole("heading", {level: 1}).textContent();
        console.log(hOneHeader);

        const  welcomeHeader = await page.getByRole("heading", {name: "Welcome back!", level: 2}).textContent();
        console.log(welcomeHeader);

        //const usernameLabel = await page.getByText("USERNAME").textContent();
        const usernameLabel = await page.getByText("Username").innerText();
        console.log(usernameLabel);

        const details = await page.getByText("Please enter your details.", {exact:true}).innerText();
        console.log(details)

        //await page.getByRole("textbox", {name: "standard_user"}).fill(USERNAME);
        await page.getByPlaceholder("standard_user").fill(USERNAME);
        await page.getByPlaceholder("••••••••").fill(PASSWORD);

        await page.getByRole("img", {name:"SA flag"}).click();
       // await page.getByTestId("market-MX").click();

        //level 1
       //await page.getByRole("button",{name: "Sign In"}).click();
       await page.getByRole("button",{name: /sign in/i}).click();

        await page.getByAltText("Pepperoni").click();

        //Assert
        const pizzaCards = page.locator("[data-testid^='pizza-card-']");
        await expect(pizzaCards.first()).toBeVisible();
        
        const hawaian = await pizzaCards.nth(8).innerText();
        console.log(hawaian);
        
        const funghi = await pizzaCards.filter({hasText: "Funghi"}).textContent();
        console.log(funghi);

        const count = await pizzaCards.count();
        //console.log(count)
        expect(count).toBeGreaterThan(0); //<1
        expect(count).toBeGreaterThanOrEqual(1); // >= 1

        const fourCheese = await page.getByRole("heading", {level:3}).filter({hasText: "Cheese"}).innerText();
        console.log(fourCheese);
    });
});





