import { getEnv } from "@ledgerhq/live-env";
import { useCallback, useEffect, useState } from "react";
import { useFeature } from "../../../../featureFlags";
import { fetchAndMergeProviderData } from "../../../providers/swap";

export const useFilteredProviders = () => {
  const [providers, setProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const ptxSwapExodusProviderFlag = useFeature("ptxSwapExodusProvider");

  const fetchProviders = useCallback(async () => {
    try {
      const ledgerSignatureEnv = getEnv("MOCK_EXCHANGE_TEST_CONFIG") ? "test" : "prod";
      const partnerSignatureEnv = getEnv("MOCK_EXCHANGE_TEST_PARTNER") ? "test" : "prod";

      const data = await fetchAndMergeProviderData({ ledgerSignatureEnv, partnerSignatureEnv });

      let filteredProviders = Object.keys(data);
      if (!ptxSwapExodusProviderFlag?.enabled) {
        filteredProviders = filteredProviders.filter(provider => provider !== "exodus");
      }

      setProviders(filteredProviders);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [ptxSwapExodusProviderFlag]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return { providers, loading, error };
};
