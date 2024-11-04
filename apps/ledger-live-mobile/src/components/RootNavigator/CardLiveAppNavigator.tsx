import React, { useMemo, lazy, Suspense } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "styled-components/native";
import { CARD_APP_ID } from "@ledgerhq/live-common/wallet-api/constants";
import { NavigatorName, ScreenName } from "~/const";
import { getStackNavigatorConfig } from "~/navigation/navigatorConfig";
import styles from "~/navigation/styles";
import type { StackNavigatorProps } from "./types/helpers";
import { useTranslation } from "react-i18next";
import { PtxNavigatorParamList } from "~/components/RootNavigator/types/PtxNavigator";

const Stack = createStackNavigator<PtxNavigatorParamList>();

const Card = lazy(() => import("~/screens/PTX").then(module => ({ default: module.PtxScreen })));

const CardComponent = (props: StackNavigatorProps<PtxNavigatorParamList, ScreenName.Card>) => {
  const { t } = useTranslation();
  const { goToURL, lastScreen, platform, referrer } = props.route.params || {};
  return (
    <Card
      {...props}
      config={{
        screen: ScreenName.Card,
        navigator: NavigatorName.Card,
        btnText: t("browseWeb3.webPlatformPlayer.back.card"),
      }}
      route={{
        ...props.route,
        params: {
          goToURL,
          lastScreen,
          platform: platform || CARD_APP_ID,
          referrer,
        },
      }}
    />
  );
};

export default function CardLiveAppNavigator() {
  const { colors } = useTheme();
  const stackNavigationConfig = useMemo(() => getStackNavigatorConfig(colors, true), [colors]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stack.Navigator screenOptions={stackNavigationConfig}>
        <Stack.Screen
          name={ScreenName.Card}
          options={{
            headerStyle: styles.headerNoShadow,
            title: "",
          }}
        >
          {props => <CardComponent {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </Suspense>
  );
}
