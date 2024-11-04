import React, { useMemo, lazy, Suspense } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components/native";
import { ScreenName } from "~/const";
import { getStackNavigatorConfig } from "~/navigation/navigatorConfig";
import { AccountSettingsNavigatorParamList } from "./types/AccountSettingsNavigator";

const Accounts = lazy(() => import("~/screens/Accounts"));
const AccountSettingsMain = lazy(() => import("~/screens/AccountSettings"));
const EditAccountName = lazy(() => import("~/screens/AccountSettings/EditAccountName"));
const AdvancedLogs = lazy(() => import("~/screens/AccountSettings/AdvancedLogs"));
const AccountOrder = lazy(() => import("~/screens/Accounts/AccountOrder"));
const AddAccount = lazy(() => import("~/screens/Accounts/AddAccount"));
const CurrencySettings = lazy(
  () => import("~/screens/Settings/CryptoAssets/Currencies/CurrencySettings"),
);
const EditCurrencyUnits = lazy(
  () => import("~/screens/Settings/CryptoAssets/Currencies/EditCurrencyUnits"),
);

const Stack = createStackNavigator<AccountSettingsNavigatorParamList>();

export default function AccountSettingsNavigator() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const stackNavConfig = useMemo(() => getStackNavigatorConfig(colors), [colors]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stack.Navigator screenOptions={stackNavConfig}>
        <Stack.Screen
          name={ScreenName.AccountSettingsMain}
          component={AccountSettingsMain}
          options={{
            title: t("account.settings.header"),
            headerRight: () => null,
          }}
        />
        <Stack.Screen
          name={ScreenName.EditAccountName}
          component={EditAccountName}
          options={{
            title: t("account.settings.accountName.title"),
          }}
        />
        <Stack.Screen
          name={ScreenName.AdvancedLogs}
          component={AdvancedLogs}
          options={{
            title: t("account.settings.advanced.title"),
          }}
        />
        <Stack.Screen name={ScreenName.CurrencySettings} component={CurrencySettings} />
        <Stack.Screen name={ScreenName.EditCurrencyUnits} component={EditCurrencyUnits} />
        <Stack.Screen
          name={ScreenName.Accounts}
          component={Accounts}
          options={{
            title: t("accounts.title"),
            headerLeft: () => <AccountOrder />,
            headerRight: () => <AddAccount />,
          }}
        />
      </Stack.Navigator>
    </Suspense>
  );
}
