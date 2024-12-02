import { useFeature } from "../../../../featureFlags";

/**
 * This hook is used to retrieve the configuration for the Swap Live App.
 * The `ptxSwapLiveAppDemoThree` feature flag is always true, but it is used
 * to obtain the manifest ID that loads the URL for the live app in production,
 * stg, or ppr environments.
 *
 * @returns The feature flag configuration for `ptxSwapLiveAppDemoThree`.
 */
export function useSwapLiveConfig() {
  const demoThree = useFeature("ptxSwapLiveAppDemoThree");

  return demoThree;
}
