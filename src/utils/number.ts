import { Coin } from '@cosmjs/stargate';
import { BigNumber } from 'bignumber.js';

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

export const toViewDenom = (
  coin: Coin,
  assets,
  decCoinExponent = 0,
): Coin | undefined => {
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

  return coin;
};
