import { useFeature } from "@ledgerhq/live-common/featureFlags/index";

// used to get the value of the Swap Live App flag
export const useIsSwapLiveFlagEnabled = (flag: string): boolean => {
  const demoThree = useFeature("ptxSwapLiveAppDemoThree");
  const coreExperiment = useFeature("ptxSwapCoreExperiment");
  const coreExperimentVariant = coreExperiment?.enabled && coreExperiment?.params?.variant;

  if (flag === "ptxSwapLiveAppDemoThree") {
    return (
      !!demoThree?.enabled || ["Demo3", "Demo3Thorswap"].includes(coreExperimentVariant as string)
    );
  }

  throw new Error(`Unknown Swap Live App flag ${flag}`);
};
