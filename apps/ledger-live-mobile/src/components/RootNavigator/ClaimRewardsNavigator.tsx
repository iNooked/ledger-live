import React, { useMemo, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "styled-components/native";
import { ScreenName } from "~/const";
import { getStackNavigatorConfig } from "~/navigation/navigatorConfig";
import StepHeader from "../StepHeader";
import type { ClaimRewardsNavigatorParamList } from "./types/ClaimRewardsNavigator";

const SelectDevice = lazy(() => import("~/screens/SelectDevice"));
const ConnectDevice = lazy(() => import("~/screens/ConnectDevice"));
const ValidationSuccess = lazy(() => import("~/screens/ClaimRewards/02-ValidationSuccess"));
const ValidationError = lazy(() => import("~/screens/ClaimRewards/02-ValidationError"));

const totalSteps = "2";
export default function ClaimRewardsNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(() => getStackNavigatorConfig(colors, true), [colors]);
  return (
    <Suspense>
      <Stack.Navigator screenOptions={stackNavigationConfig}>
        <Stack.Screen
          name={ScreenName.ClaimRewardsSelectDevice}
          component={SelectDevice}
          options={{
            headerTitle: () => (
              <StepHeader
                title={t("claimReward.stepperHeader.selectDevice")}
                subtitle={t("claimReward.stepperHeader.stepRange", {
                  currentStep: "1",
                  totalSteps,
                })}
              />
            ),
          }}
        />
        <Stack.Screen
          name={ScreenName.ClaimRewardsConnectDevice}
          component={ConnectDevice}
          options={{
            headerTitle: () => (
              <StepHeader
                title={t("claimReward.stepperHeader.connectDevice")}
                subtitle={t("claimReward.stepperHeader.stepRange", {
                  currentStep: "2",
                  totalSteps,
                })}
              />
            ),
          }}
        />
        <Stack.Screen
          name={ScreenName.ClaimRewardsValidationSuccess}
          component={ValidationSuccess}
          options={{
            headerTitle: "",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name={ScreenName.ClaimRewardsValidationError}
          component={ValidationError}
          options={{
            headerTitle: "",
          }}
        />
      </Stack.Navigator>
    </Suspense>
  );
}
const Stack = createStackNavigator<ClaimRewardsNavigatorParamList>();
