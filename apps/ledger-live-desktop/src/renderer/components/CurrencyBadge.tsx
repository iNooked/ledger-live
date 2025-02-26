import React, { useMemo } from "react";
import styled from "styled-components";
import { getCryptoCurrencyIcon } from "@ledgerhq/live-common/react";
import { CryptoCurrency, TokenCurrency } from "@ledgerhq/types-cryptoassets";
import { rgba } from "~/renderer/styles/helpers";
import IconCheckFull from "~/renderer/icons/CheckFull";
import Box from "~/renderer/components/Box";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";
import useTheme from "~/renderer/hooks/useTheme";
import ensureContrast from "~/renderer/ensureContrast";
import Spinner from "./Spinner";
import { BoxProps } from "./Box/Box";

type CryptoIconWrapperProps = {
  cryptoColor: string;
  borderRadius?: string;
} & BoxProps;

const CryptoIconWrapper = styled(Box).attrs<CryptoIconWrapperProps>(p => ({
  alignItems: "center",
  justifyContent: "center",
  bg: rgba(p.cryptoColor, 0.15),
  color: p.cryptoColor,
}))<CryptoIconWrapperProps>`
  border-radius: ${p => p.borderRadius || "50%"};
  width: ${p => p.size || 40}px;
  height: ${p => p.size || 40}px;
  position: relative;

  & > :nth-child(2) {
    position: absolute;
    right: -6px;
    top: -6px;
  }
`;
const SpinnerWrapper = styled.div`
  background: ${p => p.theme.colors.palette.background.paper};
  border-radius: 100%;
  padding: 2px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${p => p.theme.colors.palette.background.paper};
`;

/**
 * Nb Not to be confused with CryptoCurrencyIcon which also has a circle
 * mode. Not worth refactoring since this one brings the spinner/check-mark
 * and CryptoCurrencyIcon is used in the selects.
 */
export function CurrencyCircleIcon({
  currency,
  size,
  showSpinner,
  showCheckmark,
}: {
  currency: CryptoCurrency | TokenCurrency;
  size: number;
  showSpinner?: boolean;
  showCheckmark?: boolean;
}) {
  const bgColor = useTheme().colors.palette.background.paper;
  const cryptoColor = useMemo(
    () => (currency.type === "CryptoCurrency" ? ensureContrast(currency.color, bgColor) : ""),
    [currency, bgColor],
  );
  if (currency.type === "TokenCurrency") {
    return <ParentCryptoCurrencyIcon currency={currency} bigger />;
  }
  const Icon = getCryptoCurrencyIcon(currency);
  return (
    <CryptoIconWrapper size={size} cryptoColor={cryptoColor}>
      {Icon && <Icon size={size * 0.6} />}
      {showCheckmark && (
        <div>
          <IconCheckFull size={22} />
        </div>
      )}
      {showSpinner && (
        <SpinnerWrapper>
          <Spinner color="palette.text.shade60" size={14} />
        </SpinnerWrapper>
      )}
    </CryptoIconWrapper>
  );
}
function CurrencyBadge({ currency }: { currency: CryptoCurrency | TokenCurrency }) {
  return (
    <Box horizontal alignItems="center" flow={3} id="currency-badge" flex={1}>
      <CurrencyCircleIcon size={40} currency={currency} />
      <Box ml={2} maxWidth="fit-content">
        <Box
          ff="Inter|SemiBold"
          color="palette.text.shade50"
          fontSize={2}
          style={{
            letterSpacing: 1,
          }}
        >
          {currency.ticker}
        </Box>
        <Box ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
          {currency.name}
        </Box>
      </Box>
    </Box>
  );
}
export default CurrencyBadge;
