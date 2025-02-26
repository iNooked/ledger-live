import { Account, AccountLike } from "@ledgerhq/types-live";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import IconCoins from "~/renderer/icons/Coins";
import { openModal } from "~/renderer/actions/modals";
import { isAccountEmpty } from "@ledgerhq/live-common/account/index";
import { useGetStakeLabelLocaleBased } from "~/renderer/hooks/useGetStakeLabelLocaleBased";

type Props = {
  account: AccountLike;
  parentAccount: Account | undefined | null;
};

const AccountHeaderActions = ({ account, parentAccount }: Props) => {
  const dispatch = useDispatch();
  const label = useGetStakeLabelLocaleBased();
  const isEthereumAccount = account.type === "Account" && account.currency.id === "ethereum";

  const onClickStake = useCallback(() => {
    if (isAccountEmpty(account)) {
      dispatch(
        openModal("MODAL_NO_FUNDS_STAKE", {
          account,
          parentAccount,
        }),
      );
    } else if (account.type === "Account") {
      dispatch(
        openModal("MODAL_EVM_STAKE", {
          account,
        }),
      );
    }
  }, [account, dispatch, parentAccount]);

  if (isEthereumAccount) {
    return [
      {
        key: "Stake",
        onClick: onClickStake,
        event: "button_clicked2",
        eventProperties: {
          button: "stake",
        },
        icon: IconCoins,
        label,
        accountActionsTestId: "stake-button",
      },
    ];
  } else {
    return [];
  }
};

export default AccountHeaderActions;
