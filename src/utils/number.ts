import { Coin } from '@cosmjs/stargate';
import { BigNumber } from 'bignumber.js';

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
