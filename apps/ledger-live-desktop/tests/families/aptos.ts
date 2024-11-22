import { expect } from "@playwright/test";
import {
  pressBoth,
  pressUntilTextFound,
  containsSubstringInEvent,
} from "@ledgerhq/live-common/e2e/speculos";
import { DeviceLabels } from "@ledgerhq/live-common/e2e/enum/DeviceLabels";
import { Transaction } from "tests/models/Transaction";

export async function sendAptos(tx: Transaction) {
  const events = await pressUntilTextFound(DeviceLabels.APPROVE);
  console.log("events", events);
  //const isAmountCorrect = containsSubstringInEvent(tx.amount, events);
  //expect(isAmountCorrect).toBeTruthy();
  //const isAddressCorrect = containsSubstringInEvent(tx.accountToCredit.address, events);
  //expect(isAddressCorrect).toBeTruthy();

  await pressBoth();
}
