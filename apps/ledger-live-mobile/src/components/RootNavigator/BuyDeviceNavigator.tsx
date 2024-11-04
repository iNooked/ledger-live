import React, { useMemo, lazy, Suspense } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "styled-components/native";
import { useFeature } from "@ledgerhq/live-common/featureFlags/index";
import { ScreenName } from "~/const";
import { getStackNavigatorConfig } from "~/navigation/navigatorConfig";
import { BuyDeviceNavigatorParamList } from "./types/BuyDeviceNavigator";

const GetDevice = lazy(() => import("~/screens/GetDeviceScreen"));
const PurchaseDevice = lazy(() => import("~/screens/PurchaseDevice"));

const Stack = createStackNavigator<BuyDeviceNavigatorParamList>();

const BuyDeviceNavigator = () => {
  const { colors } = useTheme();
  const buyDeviceFromLive = useFeature("buyDeviceFromLive");
  const stackNavigationConfig = useMemo(() => getStackNavigatorConfig(colors, true), [colors]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stack.Navigator screenOptions={{ ...stackNavigationConfig, headerShown: false }}>
        <Stack.Screen name={ScreenName.GetDevice} component={GetDevice} />
        {buyDeviceFromLive?.enabled && (
          <Stack.Screen name={ScreenName.PurchaseDevice} component={PurchaseDevice} />
        )}
      </Stack.Navigator>
    </Suspense>
  );
};

export default BuyDeviceNavigator;
