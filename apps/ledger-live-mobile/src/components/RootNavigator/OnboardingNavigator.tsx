import React, { Suspense } from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionPresets,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { Flex } from "@ledgerhq/native-ui";
import { Theme } from "@ledgerhq/native-ui/styles/theme";

import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components/native";
import { ScreenName, NavigatorName } from "~/const";
import PasswordAddFlowNavigator from "./PasswordAddFlowNavigator";
import NavigationHeader from "../NavigationHeader";
import NavigationOverlay from "../NavigationOverlay";
import NavigationModalContainer from "../NavigationModalContainer";
import { StackNavigatorProps } from "./types/helpers";
import { NavigationHeaderBackButton } from "../NavigationHeaderBackButton";
import AnalyticsOptInPromptNavigator from "./AnalyticsOptInPromptNavigator";

const OnboardingWelcome = React.lazy(() => import("~/screens/Onboarding/steps/welcome"));
const OnboardingLanguage = React.lazy(() => import("~/screens/Onboarding/steps/language"));
const OnboardingTerms = React.lazy(() => import("~/screens/Onboarding/steps/terms"));
const OnboardingDeviceSelection = React.lazy(
  () => import("~/screens/Onboarding/steps/deviceSelection"),
);
const OnboardingUseCase = React.lazy(() => import("~/screens/Onboarding/steps/useCaseSelection"));
const OnboardingNewDeviceInfo = React.lazy(
  () => import("~/screens/Onboarding/steps/newDeviceInfo"),
);
const OnboardingNewDiscoverLiveInfo = React.lazy(
  () => import("~/screens/Onboarding/steps/discoverLiveInfo"),
);
const OnboardingNewDevice = React.lazy(() => import("~/screens/Onboarding/steps/setupDevice"));
const OnboardingRecoveryPhrase = React.lazy(
  () => import("~/screens/Onboarding/steps/recoveryPhrase"),
);
const OnboardingInfoModal = React.lazy(
  () => import("../OnboardingStepperView/OnboardingInfoModal"),
);
const OnboardingBleDevicePairingFlow = React.lazy(
  () => import("~/screens/Onboarding/steps/BleDevicePairingFlow"),
);
const OnboardingPairNew = React.lazy(() => import("~/screens/Onboarding/steps/pairNew"));
const OnboardingImportAccounts = React.lazy(
  () => import("~/screens/Onboarding/steps/importAccounts"),
);
const OnboardingPreQuizModal = React.lazy(
  () => import("~/screens/Onboarding/steps/setupDevice/drawers/OnboardingPreQuizModal"),
);
const OnboardingQuiz = React.lazy(() => import("~/screens/Onboarding/OnboardingQuiz"));
const OnboardingQuizFinal = React.lazy(() => import("~/screens/Onboarding/OnboardingQuizFinal"));
const OnboardingSetupDeviceInformation = React.lazy(
  () => import("~/screens/Onboarding/steps/setupDevice/drawers/SecurePinCode"),
);
const OnboardingSetupDeviceRecoveryPhrase = React.lazy(
  () => import("~/screens/Onboarding/steps/setupDevice/drawers/SecureRecoveryPhrase"),
);
const OnboardingGeneralInformation = React.lazy(
  () => import("~/screens/Onboarding/steps/setupDevice/drawers/GeneralInformation"),
);
const OnboardingBluetoothInformation = React.lazy(
  () => import("~/screens/Onboarding/steps/setupDevice/drawers/BluetoothConnection"),
);
const PostWelcomeSelection = React.lazy(
  () => import("~/screens/Onboarding/steps/postWelcomeSelection"),
);
const GetDeviceScreen = React.lazy(() => import("~/screens/GetDeviceScreen"));
const OnboardingProtectFlow = React.lazy(() => import("~/screens/Onboarding/steps/protectFlow"));
const ProtectConnectionInformationModal = React.lazy(
  () => import("~/screens/Onboarding/steps/setupDevice/drawers/ProtectConnectionInformationModal"),
);
const AccessExistingWallet = React.lazy(
  () => import("~/screens/Onboarding/steps/accessExistingWallet"),
);

const Stack = createStackNavigator<OnboardingNavigatorParamList>();
const OnboardingPreQuizModalStack =
  createStackNavigator<OnboardingPreQuizModalNavigatorParamList>();

function OnboardingPreQuizModalNavigator(
  props: StackNavigatorProps<OnboardingNavigatorParamList, NavigatorName.OnboardingPreQuiz>,
) {
  const options: Partial<StackNavigationOptions> = {
    header: props => (
      <Flex bg="constant.purple">
        <NavigationHeader {...props} hideBack containerProps={{ backgroundColor: "transparent" }} />
      </Flex>
    ),
    headerStyle: {},
    headerShadowVisible: false,
  };

  return (
    <NavigationModalContainer {...props} backgroundColor="constant.purple">
      <OnboardingPreQuizModalStack.Navigator>
        <OnboardingPreQuizModalStack.Screen
          name={ScreenName.OnboardingPreQuizModal}
          component={OnboardingPreQuizModal}
          options={{ title: "", ...options }}
        />
      </OnboardingPreQuizModalStack.Navigator>
    </NavigationModalContainer>
  );
}

const modalOptions: Partial<StackNavigationOptions> = {
  presentation: "transparentModal",
  cardOverlayEnabled: true,
  cardOverlay: () => <NavigationOverlay />,
  headerShown: false,
  ...TransitionPresets.ModalTransition,
};

const infoModalOptions = ({ theme }: { theme: Theme }): Partial<StackNavigationOptions> => ({
  ...TransitionPresets.ModalTransition,
  headerStyle: {
    backgroundColor: theme.colors.background.drawer,
  },
  headerShown: true,
});

export default function OnboardingNavigator() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.background.main },
          cardStyle: { backgroundColor: theme.colors.background.main },
        }}
      >
        <Stack.Screen name={ScreenName.OnboardingWelcome} component={OnboardingWelcome} />
        <Stack.Screen
          name={ScreenName.OnboardingPostWelcomeSelection}
          component={PostWelcomeSelection}
          options={{
            headerShown: true,
            headerLeft: () => <NavigationHeaderBackButton />,
          }}
        />
        <Stack.Screen
          name={ScreenName.OnboardingWelcomeBack}
          component={AccessExistingWallet}
          options={{
            headerShown: true,
            headerLeft: () => <NavigationHeaderBackButton />,
          }}
        />
        <Stack.Screen
          name={ScreenName.GetDevice}
          component={GetDeviceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={ScreenName.OnboardingLanguage}
          component={OnboardingLanguage}
          options={{
            ...infoModalOptions({ theme }),
            headerTitle: t("onboarding.stepLanguage.title"),
          }}
        />
        <Stack.Screen name={ScreenName.OnboardingTermsOfUse} component={OnboardingTerms} />
        <Stack.Screen
          name={ScreenName.OnboardingDeviceSelection}
          component={OnboardingDeviceSelection}
          options={{
            headerShown: true,
            headerLeft: () => <NavigationHeaderBackButton />,
          }}
        />
        <Stack.Screen
          name={ScreenName.OnboardingBleDevicePairingFlow}
          component={OnboardingBleDevicePairingFlow}
          options={{
            headerShown: true,
            headerLeft: () => <NavigationHeaderBackButton />,
          }}
        />
        <Stack.Screen
          name={ScreenName.OnboardingUseCase}
          component={OnboardingUseCase}
          options={{
            headerShown: true,
            headerLeft: () => <NavigationHeaderBackButton />,
          }}
        />
        <Stack.Screen
          name={NavigatorName.OnboardingPreQuiz}
          component={OnboardingPreQuizModalNavigator}
          options={modalOptions}
        />
        <Stack.Screen
          name={ScreenName.OnboardingModalDiscoverLive}
          component={OnboardingNewDiscoverLiveInfo}
        />
        <Stack.Screen
          name={ScreenName.OnboardingModalSetupNewDevice}
          component={OnboardingNewDeviceInfo}
        />
        <Stack.Screen
          name={ScreenName.OnboardingSetupDeviceInformation}
          component={OnboardingSetupDeviceInformation}
          options={infoModalOptions({ theme })}
        />
        <Stack.Screen
          name={ScreenName.OnboardingModalSetupSecureRecovery}
          component={OnboardingSetupDeviceRecoveryPhrase}
          options={infoModalOptions({ theme })}
        />
        <Stack.Screen
          name={ScreenName.OnboardingGeneralInformation}
          component={OnboardingGeneralInformation}
          options={infoModalOptions({ theme })}
        />
        <Stack.Screen
          name={ScreenName.OnboardingBluetoothInformation}
          component={OnboardingBluetoothInformation}
          options={infoModalOptions({ theme })}
        />
        <Stack.Screen
          name={ScreenName.OnboardingProtectionConnectionInformation}
          component={ProtectConnectionInformationModal}
          options={infoModalOptions({ theme })}
        />
        <Stack.Screen name={ScreenName.OnboardingSetNewDevice} component={OnboardingNewDevice} />
        <Stack.Screen
          name={ScreenName.OnboardingRecoveryPhrase}
          component={OnboardingRecoveryPhrase}
        />
        <Stack.Screen
          name={ScreenName.OnboardingInfoModal}
          component={OnboardingInfoModal}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />
        <Stack.Screen name={ScreenName.OnboardingPairNew} component={OnboardingPairNew} />
        <Stack.Screen name={ScreenName.OnboardingProtectFlow} component={OnboardingProtectFlow} />
        <Stack.Screen
          name={ScreenName.OnboardingImportAccounts}
          component={OnboardingImportAccounts}
        />
        <Stack.Screen name={NavigatorName.PasswordAddFlow} component={PasswordAddFlowNavigator} />
        <Stack.Screen name={ScreenName.OnboardingQuiz} component={OnboardingQuiz} />
        <Stack.Screen name={ScreenName.OnboardingQuizFinal} component={OnboardingQuizFinal} />
        <Stack.Screen
          name={NavigatorName.AnalyticsOptInPrompt}
          options={{ headerShown: false }}
          component={AnalyticsOptInPromptNavigator}
        />
      </Stack.Navigator>
    </Suspense>
  );
}
