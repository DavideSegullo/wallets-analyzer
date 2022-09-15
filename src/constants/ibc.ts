import { getIbcAssets } from '@chain-registry/utils';
import { assets, ibc } from 'chain-registry';

export const ibcMap = [
  ...getIbcAssets('osmosis', ibc, assets),
  ...getIbcAssets('juno', ibc, assets),
  ...getIbcAssets('bitsong', ibc, assets),
];
