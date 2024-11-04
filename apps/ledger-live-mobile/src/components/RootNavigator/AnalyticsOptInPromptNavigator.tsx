import React, { useMemo, lazy, Suspense } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "styled-components/native";
import { useFeature } from "@ledgerhq/live-common/featureFlags/index";
import { ABTestingVariants } from "@ledgerhq/types-live";
import { NavigatorName, ScreenName } from "~/const";
import { getStackNavigatorConfig } from "~/navigation/navigatorConfig";
import { AnalyticsOptInPromptNavigatorParamList } from "./types/AnalyticsOptInPromptNavigator";
import { useRoute } from "@react-navigation/core";
import { RootComposite, StackNavigatorProps } from "./types/helpers";
import { BaseNavigatorStackParamList } from "./types/BaseNavigator";

const AnalyticsOptInPromptMainA = lazy(
  () => import("~/screens/AnalyticsOptInPrompt/variantA/Main"),
);
const AnalyticsOptInPromptDetailsA = lazy(
  () => import("~/screens/AnalyticsOptInPrompt/variantA/Details"),
);
const AnalyticsOptInPromptMainB = lazy(
  () => import("~/screens/AnalyticsOptInPrompt/variantB/Main"),
);
const AnalyticsOptInPromptDetailsB = lazy(
  () => import("~/screens/AnalyticsOptInPrompt/variantB/Details"),
);

const screensByVariant = {
  [ABTestingVariants.variantA]: {
    main: AnalyticsOptInPromptMainA,
    details: AnalyticsOptInPromptDetailsA,
  },
  [ABTestingVariants.variantB]: {
    main: AnalyticsOptInPromptMainB,
    details: AnalyticsOptInPromptDetailsB,
  },
};

type NavigationProps = RootComposite<
  StackNavigatorProps<BaseNavigatorStackParamList, NavigatorName.AnalyticsOptInPrompt>
>;

const Stack = createStackNavigator<AnalyticsOptInPromptNavigatorParamList>();

export default function AnalyticsOptInPromptNavigator() {
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(() => getStackNavigatorConfig(colors, false), [colors]);
  const llmAnalyticsOptInPromptFeature = useFeature("llmAnalyticsOptInPrompt");
  const route = useRoute<NavigationProps["route"]>();
  const preventBackNavigation = route.params.params?.entryPoint === "Portfolio";

  const navigationOptions = {
    title: "",
    ...(preventBackNavigation ? { headerLeft: () => null } : {}),
  };

  const activeVariant =
    llmAnalyticsOptInPromptFeature?.params?.variant === ABTestingVariants.variantB
      ? ABTestingVariants.variantB
      : ABTestingVariants.variantA;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stack.Navigator screenOptions={stackNavigationConfig}>
        <Stack.Screen
          name={ScreenName.AnalyticsOptInPromptMain}
          component={screensByVariant[activeVariant].main}
          options={navigationOptions}
        />
        <Stack.Screen
          name={ScreenName.AnalyticsOptInPromptDetails}
          component={screensByVariant[activeVariant].details}
          options={{ title: "" }}
        />
      </Stack.Navigator>
    </Suspense>
  );
}
