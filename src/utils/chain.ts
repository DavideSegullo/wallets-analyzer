import { chains } from 'chain-registry';
import { ChainConfig } from 'src/types';
// TODO: Remove chain-registry and add a cron job for scraping

export const extractChainName = (request: any): ChainConfig => {
  if (request.params && request.params.chain) {
    return chains.find(
      (chain) =>
        chain.chain_name === request.params.chain &&
        chain.network_type === 'mainnet',
    );
  }
};
