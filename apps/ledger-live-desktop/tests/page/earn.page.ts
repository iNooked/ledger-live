import { AppPage } from "tests/page/abstractClasses";
import { step } from "tests/misc/reporters/step";
import { ElectronApplication, expect } from "@playwright/test";
import { Account } from "tests/enum/Account";

export class EarnPage extends AppPage {
  private webview = this.page.locator("webview");

  @step("Select account to stake")
  async selectAccountToStake(electronApp: ElectronApplication, account: Account) {
    const [, webview] = electronApp.windows();

    /*if (await webview.locator("text= Earn more rewards").isVisible()) {
      await webview.locator("text= Earn more rewards").click();
    }*/
    await expect(webview.locator(`text= ${account}`)).toBeVisible();
    await webview.getByRole("button", { name: "Stake" }).first().click();
  }

  async selectAccountToStake2(electronApp: ElectronApplication) {
    const [, webview] = electronApp.windows();

    if (await webview.locator("text= Earn more rewards").isVisible()) {
      await webview.locator("text= Earn more rewards").click();
    }
    await webview.getByRole("button", { name: "Stake" }).first().click();
  }

  @step("check Webview is visble")
  async checkWebview() {
    await expect(this.webview).toBeVisible();
  }
}
