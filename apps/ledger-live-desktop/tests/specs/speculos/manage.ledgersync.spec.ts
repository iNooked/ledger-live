import { test } from "../../fixtures/common";
import { AppInfos } from "tests/enum/AppInfos";
import { addTmsLink } from "tests/utils/allureUtils";
import { getDescription } from "../../utils/customJsonReporter";

const app: AppInfos = AppInfos.LS;

let syncedAccountNames: string[] = [];

test.describe.serial(`[${app.name}] Sync Accounts`, () => {
  test.use({
    userdata: "ledgerSync",
    speculosApp: app,
  });

  test(
    "Synchronize one instance then delete the backup",
    {
      annotation: {
        type: "TMS",
        description: "B2CQA-2292, B2CQA-2293, B2CQA-2296",
      },
    },
    async ({ app }) => {
      await addTmsLink(getDescription(test.info().annotations).split(", "));

      await app.layout.goToSettings();
      await app.settings.openManageLedgerSync();
      await app.ledgerSync.expectSyncAccountsButtonExist();

      await app.ledgerSync.syncAccounts();
      await app.speculos.clickNextUntilText("Make sure");
      await app.speculos.confirmOperationOnDevice("Connect with");
      await app.speculos.clickNextUntilText("Your crypto accounts");
      await app.speculos.confirmOperationOnDevice("Turn on sync?");
      await app.ledgerSync.expectSynchronizationSuccess();
      await app.ledgerSync.closeLedgerSync();

      await app.settings.openManageLedgerSync();
      /* await app.ledgerSync.checkTitle();
      await app.ledgerSync.checkOptionSyncWithAnotherLedgerLiveApp();
      await app.ledgerSync.checkSyncWithPhone();
      await app.ledgerSync.checkSyncWithComputer();
      await app.ledgerSync.checkOptionDeleteSync();*/
      await app.ledgerSync.expectNbSyncedInstances(1); //TODO: Reactivate when the issue is fixed - QAA-178
      await app.ledgerSync.destroyTrustchain();
      await app.ledgerSync.expectBackupDeletion();
      await app.drawer.close();
    },
  );
});

test.describe.serial(`[${app.name}] Sync 1st Instance with accounts`, () => {
  test.use({
    userdata: "ledgerSync_with_accounts",
    speculosApp: app,
  });

  test(
    "1st instance",
    {
      annotation: {
        type: "TMS",
        description: "B2CQA-2292, B2CQA-2293, B2CQA-2296",
      },
    },
    async ({ app, page }) => {
      await addTmsLink(getDescription(test.info().annotations).split(", "));
      await app.layout.goToSettings();
      await app.settings.openManageLedgerSync();
      await app.ledgerSync.expectSyncAccountsButtonExist();
      await app.ledgerSync.syncAccounts();
      await app.speculos.clickNextUntilText("Make sure");
      await app.speculos.confirmOperationOnDevice("Connect with");
      await app.speculos.clickNextUntilText("Your crypto accounts");
      await app.speculos.confirmOperationOnDevice("Turn on sync?");
      await app.ledgerSync.expectSynchronizationSuccess();
      await app.ledgerSync.closeLedgerSync();
      await app.ledgerSync.syncData();
      await app.layout.goToAccounts();
      syncedAccountNames = await app.accounts.getAccountsName();
    },
  );
});

// Second test block
test.describe
  .serial(`[${app.name}] Sync 2nd Instance then ensure that the accounts are synced`, () => {
  test.use({
    userdata: "ledgerSync_no_accounts", // Second json
    speculosApp: app,
  });

  test(
    "2nd instance",
    {
      annotation: {
        type: "TMS",
        description: "B2CQA-2316, B2CQA-2303, B2CQA-2292, B2CQA-2314",
      },
    },
    async ({ app, page }) => {
      await addTmsLink(getDescription(test.info().annotations).split(", "));

      await app.layout.goToSettings();
      await app.settings.openManageLedgerSync();
      await app.ledgerSync.expectSyncAccountsButtonExist();

      await app.ledgerSync.syncAccounts();
      await app.speculos.clickNextUntilText("Make sure");
      await app.speculos.confirmOperationOnDevice("Connect with");
      await app.speculos.clickNextUntilText("Your crypto accounts");
      await app.speculos.confirmOperationOnDevice("Turn on sync?");
      await app.ledgerSync.expectSynchronizationSuccess();
      await app.ledgerSync.closeLedgerSync();
      await app.ledgerSync.syncData();

      await app.layout.goToAccounts();
      const accountNamesAfterSync = await app.accounts.getAccountsName();
      for (const account of syncedAccountNames) {
        expect(accountNamesAfterSync).toContain(account);
      }
      await app.layout.goToSettings();

      await app.settings.openManageLedgerSync();
      await app.ledgerSync.manageBackup();
      await app.ledgerSync.destroyTrustchain();
      await app.ledgerSync.confirmBackupDeletion();
      await app.ledgerSync.expectBackupDeletion();
      await app.drawer.close();
    },
  );
});
