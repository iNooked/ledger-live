import React, { useMemo, lazy, Suspense } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components/native";
import { NavigatorName, ScreenName } from "~/const";
import { addAccountsSelectDeviceHeaderOptions } from "~/screens/AddAccounts/02-SelectDevice";
import AddAccountsHeaderRightClose from "~/screens/AddAccounts/AddAccountsHeaderRightClose";
import { getStackNavigatorConfig } from "~/navigation/navigatorConfig";
import StepHeader from "../StepHeader";
import type { AddAccountsNavigatorParamList } from "./types/AddAccountsNavigator";
import type { BaseNavigatorStackParamList } from "./types/BaseNavigator";
import type { StackNavigatorProps } from "./types/helpers";
import { RequestAccountNavigatorParamList } from "./types/RequestAccountNavigator";

const AddAccountsSelectCrypto = lazy(() => import("~/screens/AddAccounts/01-SelectCrypto"));
const AddAccountsSelectDevice = lazy(() => import("~/screens/AddAccounts/02-SelectDevice"));
const AddAccountsTokenCurrencyDisclaimer = lazy(
  () => import("~/screens/AddAccounts/02-TokenCurrencyDisclaimer"),
);
const AddAccountsAccounts = lazy(() => import("~/screens/AddAccounts/03-Accounts"));
const AddAccountsSuccess = lazy(() => import("~/screens/AddAccounts/04-Success"));
const EditAccountName = lazy(() => import("~/screens/AccountSettings/EditAccountName"));

type NavigationProps =
  | StackNavigatorProps<BaseNavigatorStackParamList, NavigatorName.AddAccounts>
  | StackNavigatorProps<RequestAccountNavigatorParamList, NavigatorName.RequestAccountsAddAccounts>;

const totalSteps = "3";
export default function AddAccountsNavigator({ route }: NavigationProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const stackNavConfig = useMemo(() => getStackNavigatorConfig(colors), [colors]);

  const { currency, token, returnToSwap, analyticsPropertyFlow } = route.params || {};

  return (
    <Suspense>
      <Stack.Navigator
        initialRouteName={
          token
            ? ScreenName.AddAccountsTokenCurrencyDisclaimer
            : currency
              ? ScreenName.AddAccountsSelectDevice
              : ScreenName.AddAccountsSelectCrypto
        }
        screenOptions={{
          ...stackNavConfig,
          headerRight: () => <AddAccountsHeaderRightClose />,
        }}
      >
        <Stack.Screen
          name={ScreenName.AddAccountsSelectCrypto}
          component={AddAccountsSelectCrypto}
          options={{
            headerTitle: () => (
              <StepHeader
                title={t("common.cryptoAsset")}
                subtitle={t("send.stepperHeader.stepRange", {
                  currentStep: "1",
                  totalSteps,
                })}
              />
            ),
          }}
        />
        <Stack.Screen
          name={ScreenName.AddAccountsSelectDevice}
          component={AddAccountsSelectDevice}
          initialParams={{
            ...(currency
              ? {
                  currency,
                  inline: true,
                  returnToSwap,
                }
              : {}),
            analyticsPropertyFlow,
          }}
          options={{
            headerTitle: () => (
              <StepHeader
                title={t("common.device")}
                subtitle={t("send.stepperHeader.stepRange", {
                  currentStep: "2",
                  totalSteps,
                })}
              />
            ),
          }}
        />
        <Stack.Screen
          name={ScreenName.AddAccountsAccounts}
          component={AddAccountsAccounts}
          options={{
            headerTitle: () => (
              <StepHeader
                title={t("tabs.accounts")}
                subtitle={t("send.stepperHeader.stepRange", {
                  currentStep: "3",
                  totalSteps,
                })}
              />
            ),
            gestureEnabled: false,
            ...addAccountsSelectDeviceHeaderOptions,
          }}
        />
        <Stack.Screen
          name={ScreenName.AddAccountsSuccess}
          component={AddAccountsSuccess}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ScreenName.EditAccountName}
          component={EditAccountName}
          options={{
            title: t("account.settings.accountName.title"),
            headerRight: () => null,
          }}
        />
        <Stack.Screen
          name={ScreenName.AddAccountsTokenCurrencyDisclaimer}
          component={AddAccountsTokenCurrencyDisclaimer}
          initialParams={
            token
              ? {
                  token,
                }
              : undefined
          }
          options={{
            title: t("addAccounts.tokens.title"),
          }}
        />
      </Stack.Navigator>
    </Suspense>
  );
}
const Stack = createStackNavigator<AddAccountsNavigatorParamList>();
