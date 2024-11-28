import { CryptoOrTokenCurrency } from "@ledgerhq/types-cryptoassets";
import { useCallback, useState } from "react";

type Props = {
  currencyFrom?: CryptoOrTokenCurrency;
};

export function useIsSwapLiveApp({ currencyFrom }: Props) {
  const [, setHasCrashed] = useState(false);

  const onLiveAppCrashed = useCallback(() => setHasCrashed(true), []);

  return {
    enabled: true,
    onLiveAppCrashed,
  };
}
