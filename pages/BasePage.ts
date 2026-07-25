import { Page, Locator } from "@playwright/test";

//clase-modelo
export class BasePage{

    //constructor explicito
    constructor(protected readonly page: Page){}

    //metodo= acccion
    protected tid(base: string): Locator{
        const size = this.page.viewportSize();
        const suffix = size && size.width < 768 ? "-responsive" : "-desktop"
        return this.page.getByTestId(`${base}${suffix}`).or(this.page.getByTestId(base)).first();
    } 

    protected async waitForUrl(pattern: RegExp, timeout = 15_000): Promise<void>{
        await this.page.waitForURL(pattern, {timeout});
    }

    async screenshot(name: string): Promise<void>{
        await this.page.screenshot({path: `test-results/${name}.png`});
    }
}