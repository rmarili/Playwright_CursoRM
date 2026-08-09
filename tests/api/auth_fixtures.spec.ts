import { test, expect } from "../../fixtures/api";

test.describe("Auth services with fixtures", () => {
  test("successful login", async ({ authService, standardUser }) => {
    const res = await authService.login(standardUser);
    expect(res.access_token).toBeTruthy();
    expect(typeof res.access_token).toBe("string");
  })
})