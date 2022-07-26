import { Coin } from '@cosmjs/stargate';
import { BigNumber } from 'bignumber.js';
import { ibcMap } from 'src/constants';

export const gammToPoolAmount = (
  currentAmount: BigNumber,
  totalPoolGamm: BigNumber,
  totalTokenGamm: BigNumber,
  chainToViewConversionFactor: string,
) => {
  const shareRation = currentAmount.div(totalPoolGamm);

  const amount = totalTokenGamm.multipliedBy(shareRation).toString();

  return toDenom(amount.toString(), chainToViewConversionFactor);
};

export const toDenom = (
  value: string | number,
  chainToViewConversionFactor: string | number,
) => {
  return new BigNumber(value)
    .multipliedBy(chainToViewConversionFactor)
    .toString();
};

export const toViewDenomByAssets = (
  coin: Coin,
  assets,
  decCoinExponent = 0,
) => {
  const assetCoin = assets.find((asset) => asset.base === coin.denom);

  if (assetCoin) {
    const denomUnit = assetCoin.denom_units.find(
      (el) => el.denom === assetCoin.display,
    );

    if (denomUnit) {
      return {
        denom: assetCoin.display,
        amount: new BigNumber(coin.amount)
          .multipliedBy(`1e-${denomUnit.exponent + decCoinExponent}`)
          .toString(),
      };
    }
  }
};

export const toViewDenom = (
  coin: Coin,
  assets,
  decCoinExponent = 0,
): Coin | undefined => {
  const newCoin = toViewDenomByAssets(coin, assets, decCoinExponent);

  if (newCoin) {
    return newCoin;
  }

  const ibc = ibcMap.find(
    (ibcEl) =>
      ibcEl.assets.find((asset) => asset.base === coin.denom) !== undefined,
  );

  if (ibc) {
    return toViewDenomByAssets(coin, ibc.assets, decCoinExponent);
  }

  return coin;
};
