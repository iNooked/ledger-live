import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WalletAPICustomHandlers } from "@ledgerhq/live-common/wallet-api/types";
import {
  handlers as exchangeHandlers,
  ExchangeType,
} from "@ledgerhq/live-common/wallet-api/Exchange/server";
import trackingWrapper from "@ledgerhq/live-common/wallet-api/Exchange/tracking";
import { Operation } from "@ledgerhq/types-live";
import { track } from "~/renderer/analytics/segment";
import { currentRouteNameRef } from "~/renderer/analytics/screenRefs";
import { closePlatformAppDrawer, openExchangeDrawer } from "~/renderer/actions/UI";
import { WebviewProps } from "../Web3AppWebview/types";
import { context } from "~/renderer/drawers/Provider";
import WebviewErrorDrawer from "~/renderer/screens/exchange/Swap2/Form/WebviewErrorDrawer";
import { platformAppDrawerStateSelector } from "~/renderer/reducers/UI";
import { flattenAccountsSelector } from "~/renderer/reducers/accounts";
import { store } from "~/renderer/init";

function getAccounts() {
  return flattenAccountsSelector(store.getState());
}

export function usePTXCustomHandlers(manifest: WebviewProps["manifest"]) {
  const dispatch = useDispatch();
  const { setDrawer } = React.useContext(context);

  const { isOpen: isDrawerOpen } = useSelector(platformAppDrawerStateSelector);

  const tracking = useMemo(
    () =>
      trackingWrapper(
        (
          eventName: string,
          properties?: Record<string, unknown> | null,
          mandatory?: boolean | null,
        ) =>
          track(
            eventName,
            {
              ...properties,
              flowInitiatedFrom:
                currentRouteNameRef.current === "Platform Catalog"
                  ? "Discover"
                  : currentRouteNameRef.current,
            },
            mandatory,
          ),
      ),
    [],
  );

  return useMemo<WalletAPICustomHandlers>(() => {
    return {
      ...exchangeHandlers({
        accounts: getAccounts,
        tracking,
        manifest,
        uiHooks: {
          "custom.exchange.start": ({ exchangeParams, onSuccess, onCancel }) => {
            dispatch(
              openExchangeDrawer({
                type: "EXCHANGE_START",
                ...exchangeParams,
                exchangeType: ExchangeType[exchangeParams.exchangeType],
                onResult: result => {
                  onSuccess(result.nonce, result.device);
                },
                onCancel: cancelResult => {
                  onCancel(cancelResult.error, cancelResult.device);
                },
              }),
            );
          },
          "custom.exchange.complete": ({ exchangeParams, onSuccess, onCancel }) => {
            dispatch(
              openExchangeDrawer({
                type: "EXCHANGE_COMPLETE",
                ...exchangeParams,
                onResult: (operation: Operation) => {
                  onSuccess(operation.hash);
                },
                onCancel: (error: Error) => {
                  console.error(error);
                  onCancel(error);
                },
              }),
            );
          },
          "custom.exchange.error": ({ error }) => {
            if (!isDrawerOpen) {
              dispatch(closePlatformAppDrawer());
              setDrawer(WebviewErrorDrawer, error);
            }
            return Promise.resolve();
          },
        },
      }),
    };
  }, [tracking, manifest, dispatch, setDrawer, isDrawerOpen]);
}
