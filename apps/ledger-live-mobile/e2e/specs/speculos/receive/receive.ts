import { commandCLI } from "../../../utils/cliUtils";
import { Application } from "../../../page";
import { Account } from "@ledgerhq/live-common/e2e/enum/Account";

export async function runReceiveTest(account: Account, tmsLink: string) {
  let app: Application;

  describe(`Receive - ${account.currency.name}`, () => {
    beforeAll(async () => {
      app = await Application.init({
        userdata: "onboardingcompleted",
        speculosApp: account.currency.speculosApp,
        cliCommands: [
          {
            command: commandCLI.liveData,
            args: {
              currency: account.currency.currencyId,
              index: account.index,
              appjson: "",
              add: true,
            },
          },
        ],
      });
      await app.portfolio.waitForPortfolioPageToLoad();
    });

    $TmsLink(tmsLink);
    it(`receive on ${account.currency.name} (through scanning)`, async () => {
      await app.receive.openViaDeeplink();
      await app.common.performSearch(account.currency.name);
      await app.receive.selectCurrency(account.currency.name);

      //if (network) await app.receive.selectNetwork(network);
      await app.receive.selectAccount(account.accountName);
      await app.receive.doNotVerifyAddress();
      await app.receive.expectReceivePageIsDisplayed(account.currency.ticker, account.accountName);
    });

    afterAll(async () => {
      await app.common.removeSpeculos();
    });
  });
}
