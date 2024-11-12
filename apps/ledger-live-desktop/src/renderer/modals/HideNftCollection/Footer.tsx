import React, { useCallback } from "react";
import Button from "~/renderer/components/Button";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import { useDispatch, useSelector } from "react-redux";

import {
  whiteListedNftCollectionsSelector,
  hideCollection,
  unwhitelistCollection,
} from "@ledgerhq/live-wallet/store";

const Footer = ({ onClose, collectionId }: { onClose: () => void; collectionId: string }) => {
  const dispatch = useDispatch();
  const whitelistedNftCollections = useSelector(whiteListedNftCollectionsSelector);

  const confirmHideNftCollection = useCallback(
    (collectionId: string) => {
      if (Array.from(whitelistedNftCollections).includes(collectionId)) {
        dispatch(unwhitelistCollection(collectionId));
      }

      dispatch(hideCollection(collectionId));
    },
    [dispatch, whitelistedNftCollections],
  );
  return (
    <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
      <Button onClick={onClose}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button
        data-testid="modal-confirm-button"
        onClick={() => {
          confirmHideNftCollection(collectionId);
          onClose();
        }}
        primary
      >
        <Trans i18nKey="hideNftCollection.hideCTA" />
      </Button>
    </Box>
  );
};
export default Footer;
