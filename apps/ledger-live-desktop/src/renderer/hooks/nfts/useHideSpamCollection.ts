import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFeature } from "@ledgerhq/live-common/featureFlags/index";

import {
  whiteListedNftCollectionsSelector,
  hideCollection,
  walletSyncStateSelector,
} from "@ledgerhq/live-wallet/store";

export function useHideSpamCollection() {
  const spamFilteringTxFeature = useFeature("spamFilteringTx");
  const whitelistedNftCollections = useSelector(whiteListedNftCollectionsSelector);
  const store = useSelector(walletSyncStateSelector);

  console.log(store);
  const array = Array.from(whitelistedNftCollections);
  const dispatch = useDispatch();
  const hideSpamCollection = useCallback(
    (collection: string) => {
      if (!array.includes(collection)) {
        dispatch(hideCollection(collection));
      }
    },
    [array, dispatch],
  );

  return {
    hideSpamCollection,
    enabled: spamFilteringTxFeature?.enabled,
  };
}
