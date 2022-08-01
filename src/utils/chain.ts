import { chains } from 'chain-registry';
import { ChainConfig } from 'src/types';
// TODO: Remove chain-registry and add a cron job for scraping

export const extractChainName = (chainName: string): ChainConfig => {
  return chains.find(
    (chain) =>
      chain.chain_name === chainName && chain.network_type === 'mainnet',
  );
};
