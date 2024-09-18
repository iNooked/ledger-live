import { test } from "../../fixtures/common";
import { AppInfos } from "tests/enum/AppInfos";
import { addTmsLink } from "tests/utils/allureUtils";
import { getDescription } from "../../utils/customJsonReporter";
import { Currency } from "tests/enum/Currency";
import { Account } from "tests/enum/Account";
import { waitForTimeOut } from "tests/utils/waitFor";
import { expect } from "@playwright/test";
import { waitFor } from "tests/testUtils";

const app: AppInfos = AppInfos.LS;

test.describe.serial(`[${app.name}] Sync Accounts`, () => {
  test.use({
    userdata: "ledgerSync",
    speculosApp: app,
  });

  // First test
  test(
    "Synchronize 1st instance using app.json with accounts",
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
       waitForTimeOut(5000);
      await app.speculos.confirmOperationOnDevice("Connect with");
      await app.speculos.confirmOperationOnDevice("Turn on sync?");
      await app.ledgerSync.expectSynchronizationSuccess();
      await app.ledgerSync.closeLedgerSync();

      // await app.settings.openManageLedgerSync();
      // await app.ledgerSync.expectNbSyncedInstances(1);  //TODO: Reactivate when the issue is fixed - QAA-178
      // await app.ledgerSync.destroyTrustchain();
      // await app.ledgerSync.expectBackupDeletion();
      // await app.drawer.close();
    },
  );

  // Second test
  test.use({
    userdata: "ledgerSync",
    speculosApp: app,
  });

  test(
    "Synchronize 2nd instance using app.json with no accounts then ensure that the accounts are synced",
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
      await app.speculos.confirmOperationOnDevice("Connect with");
      await app.speculos.confirmOperationOnDevice("Turn on sync?");
      await app.ledgerSync.expectSynchronizationSuccess();
      await app.ledgerSync.closeLedgerSync();
     // await app.ledgerSync.synchronizeData();
      await app.layout.goToAccounts();
      const accountName = await app.accounts.getAccountsName();
      expect(accountName).toContain('Polkadot 1');
      console.log(expect(accountName).toContain('Polkadot 1'));
      await app.layout.goToSettings();
      await app.settings.openManageLedgerSync()
      await app.ledgerSync.manageBackup();
      await app.ledgerSync.deleteBackup();
      await app.ledgerSync.confirmBackupDeletion();
      await app.ledgerSync.expectBackupDeletion();
      await app.drawer.close();

    },
  );
});

