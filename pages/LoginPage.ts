import { expect, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import type { CountryCode, User } from "../types";

export class LoginPage extends BasePage {
  readonly path = "/";

  private txtUsername: string = "username";
  private txtPassword: string = "password";
  private btnMarket: string = "market-";
  private btnSignIn: string = "login-button";
  private lblError: string = "login-error";

  // --- Locators privados: documentación interna del Page ---
  private get usernameInput(): Locator {
    return this.tid(this.txtUsername);
  }

  private get passwordInput(): Locator {
    return this.tid(this.txtPassword);
  }

  private get signInButton(): Locator {
    return this.tid(this.btnSignIn);
  }

  private get errorMessage(): Locator {
    return this.tid(this.lblError);
  }

  private marketFlag(code: CountryCode): Locator {
    return this.tid(`${this.btnMarket}${code}`);
  }

  // --- Acciones públicas: la interfaz del POM ---

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async selectMarket(code: CountryCode): Promise<void> {
    await this.marketFlag(code).click();
  }

  async loginAs(user: User): Promise<void> {
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.signInButton.click();
  }

  async loginInMarket(user: User, code: CountryCode): Promise<void> {
    await this.goto();
    await this.selectMarket(code);
    await this.loginAs(user);
    await this.waitForUrl(/\/catalog/);
  }

  // --- Assertions de estado ---

  async expectLoaded(): Promise<void> {
    await expect(this.signInButton).toBeVisible();
  }

  async expectLoginError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }
}