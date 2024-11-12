import { AppPage } from "tests/page/abstractClasses";
import { step } from "tests/misc/reporters/step";
import { ElectronApplication, expect } from "@playwright/test";

export class EarnPage extends AppPage {
  private webview = this.page.locator("webview");

  @step("Select account to stake")
  async selectAccountToStake(electronApp: ElectronApplication) {
    const [, webview] = electronApp.windows();
    console.log("webview", webview.url());

    if (await webview.locator("text= Earn more rewards").isVisible()) {
      await webview.locator("text= Earn more rewards").click();
    }

    try {
      const stakeButton = webview.getByRole("button", { name: "Stake" }).first();
      await expect(stakeButton).toBeVisible();
      await stakeButton.click();
    } catch (error) {
      console.error("Le bouton Stake pas trouvé", error);
      throw error;
    }
  }

  @step("check Webview is visble")
  async checkWebview() {
    await expect(this.webview).toBeVisible();
  }
}
