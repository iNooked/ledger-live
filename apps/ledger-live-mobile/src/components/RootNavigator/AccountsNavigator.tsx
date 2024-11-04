import React, { useMemo, lazy, Suspense } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "styled-components/native";
import { useSelector } from "react-redux";
import { readOnlyModeEnabledSelector, hasNoAccountsSelector } from "~/reducers/settings";
import { ScreenName } from "~/const";
import { getStackNavigatorConfig } from "~/navigation/navigatorConfig";
import type { AccountsNavigatorParamList } from "./types/AccountsNavigator";

const Accounts = lazy(() => import("~/screens/Accounts"));
const Account = lazy(() => import("~/screens/Account"));
const NftCollection = lazy(() => import("~/screens/Nft/NftCollection"));
const NftGallery = lazy(() => import("~/screens/Nft/NftGallery"));
const NftViewer = lazy(() => import("../Nft/NftViewer"));
const NftCollectionHeaderTitle = lazy(
  () => import("~/screens/Nft/NftCollection/NftCollectionHeaderTitle"),
);
const NftGalleryHeaderTitle = lazy(() => import("~/screens/Nft/NftGallery/NftGalleryHeaderTitle"));
const ReadOnlyAccounts = lazy(() => import("~/screens/Accounts/ReadOnly/ReadOnlyAccounts"));
const ReadOnlyAssets = lazy(() => import("~/screens/Portfolio/ReadOnlyAssets"));
const Asset = lazy(() => import("~/screens/WalletCentricAsset"));
const ReadOnlyAsset = lazy(() => import("~/screens/WalletCentricAsset/ReadOnly"));
const Assets = lazy(() => import("~/screens/Assets"));
const ReadOnlyAccount = lazy(() => import("~/screens/Account/ReadOnly/ReadOnlyAccount"));

const Stack = createStackNavigator<AccountsNavigatorParamList>();

export default function AccountsNavigator() {
  const { colors } = useTheme();
  const stackNavConfig = useMemo(() => getStackNavigatorConfig(colors), [colors]);

  const hasNoAccounts = useSelector(hasNoAccountsSelector);
  const readOnlyModeEnabled = useSelector(readOnlyModeEnabledSelector) && hasNoAccounts;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stack.Navigator screenOptions={stackNavConfig}>
        <Stack.Screen
          name={ScreenName.Accounts}
          component={readOnlyModeEnabled ? ReadOnlyAccounts : Accounts}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ScreenName.Account}
          component={readOnlyModeEnabled ? ReadOnlyAccount : Account}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={ScreenName.NftCollection}
          component={NftCollection}
          options={{
            headerTitle: () => <NftCollectionHeaderTitle />,
          }}
        />
        <Stack.Screen
          name={ScreenName.NftGallery}
          component={NftGallery}
          options={{
            headerTitle: () => <NftGalleryHeaderTitle />,
          }}
        />
        <Stack.Screen
          name={ScreenName.NftViewer}
          component={NftViewer}
          options={{
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name={ScreenName.Assets}
          component={readOnlyModeEnabled ? ReadOnlyAssets : Assets}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ScreenName.Asset}
          component={readOnlyModeEnabled ? ReadOnlyAsset : Asset}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </Suspense>
  );
}
