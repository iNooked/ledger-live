import React, { useMemo, Suspense } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "styled-components/native";

import { ScreenName } from "~/const";
import { getStackNavigatorConfig } from "~/navigation/navigatorConfig";

import { PostOnboardingNavigatorParamList } from "./types/PostOnboardingNavigator";
import { NavigationHeaderBackButton } from "../NavigationHeaderBackButton";
import { NavigationHeaderCloseButton } from "../NavigationHeaderCloseButton";
import { useCompletePostOnboarding } from "~/logic/postOnboarding/useCompletePostOnboarding";

const PostOnboardingDebugScreen = React.lazy(
  () => import("~/screens/PostOnboarding/PostOnboardingDebugScreen"),
);
const PostOnboardingHub = React.lazy(() => import("~/screens/PostOnboarding/PostOnboardingHub"));
const PostOnboardingMockActionScreen = React.lazy(
  () => import("~/screens/PostOnboarding/PostOnboardingMockActionScreen"),
);
const PostOnboardingDeeplinkHandler = React.lazy(
  () => import("~/screens/PostOnboarding/PostOnboardingDeeplinkHandler"),
);

const Stack = createStackNavigator<PostOnboardingNavigatorParamList>();

const PostOnboardingNavigator = () => {
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(() => getStackNavigatorConfig(colors, true), [colors]);

  const closePostOnboarding = useCompletePostOnboarding();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stack.Navigator
        screenOptions={{
          ...stackNavigationConfig,
          headerShown: false,
        }}
      >
        <Stack.Screen
          name={ScreenName.PostOnboardingHub}
          component={PostOnboardingHub}
          options={{
            headerShown: true,
            headerLeft: () => null,
            headerTitle: () => null,
            headerRight: () => <NavigationHeaderCloseButton onPress={closePostOnboarding} />,
          }}
        />
        <Stack.Screen
          name={ScreenName.PostOnboardingDebugScreen}
          component={PostOnboardingDebugScreen}
        />
        <Stack.Screen
          name={ScreenName.PostOnboardingDeeplinkHandler}
          component={PostOnboardingDeeplinkHandler}
        />
        <Stack.Screen
          name={ScreenName.PostOnboardingMockActionScreen}
          component={PostOnboardingMockActionScreen}
          options={{
            headerShown: true,
            headerLeft: () => <NavigationHeaderBackButton />,
          }}
        />
      </Stack.Navigator>
    </Suspense>
  );
};

export default PostOnboardingNavigator;
