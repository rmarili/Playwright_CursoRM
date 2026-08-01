import { expect, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MenuPage extends BasePage {
  private lnkCatalog: string = "nav-catalog";
  private lnkCheckout: string = "nav-checkout";
  private lnkProfile: string = "nav-profile";
  private btnLogout: string = "logout-btn";
  private lblCartCount: string = "nav-cart-count";

  // --- Locators privados ---
  private get cartCount(): Locator {
    return this.page.getByTestId(this.lblCartCount);
  }

  // --- Acciones ---

  async goToCatalog(): Promise<void> {
    await this.page.getByTestId(this.lnkCatalog).click();
  }

  async goToCheckout(): Promise<void> {
    await this.page.getByTestId(this.lnkCheckout).click();
  }

  async goToProfile(): Promise<void> {
    await this.page.getByTestId(this.lnkProfile).click();
  }

  async logout(): Promise<void> {
    await this.page.getByTestId(this.btnLogout).click();
  }

  async getCartCount(): Promise<string> {
    // El badge `nav-cart-count` sólo se renderiza cuando el carrito
    // tiene items; si no existe, el conteo es 0.
    if (!(await this.cartCount.count())) return "0";
    return (await this.cartCount.innerText()).trim();
  }

  // --- Assertions ---

  async expectCartCount(n: number): Promise<void> {
    await expect(this.cartCount).toHaveText(String(n));
  }
}

