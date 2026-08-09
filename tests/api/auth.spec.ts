import { test, expect } from "@playwright/test";
import { AuthService } from "../../services";
import userJson from "../../data/users.json" with {type: "json"};
import type { User } from "../../types";

const users = userJson as User[];
const StandardUser = users.find((u) => u.username === "standard_user")!;
const API_URL = process.env.API_URL ?? "https://omnipizza-backend.onrender.com";

test.describe("Auth services tests", () => {
    let auth: AuthService;

    test.beforeAll(async () => {
        auth = await AuthService.create(API_URL);
    });

    test("successful login returns token", async () => {
    const res = await auth.login(StandardUser);

    console.log("Login resp = ", res);
    expect(res.access_token).toBeTruthy();
    expect(typeof res.access_token).toBe("string");

  })
        
    test.afterAll(async () => {
    await auth.dispose();
  })

})



