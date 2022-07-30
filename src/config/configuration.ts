import { ChainMap } from 'src/types';

const chainsToMap = (
  prefix = 'CHAINS',
  validatorPrefix = 'CHAINS_VALIDATORS',
): ChainMap => {
  const chains: ChainMap = {};
  const addressesChains = Object.entries(process.env).filter(
    ([key]) => key.startsWith(prefix) && !key.startsWith(validatorPrefix),
  );

  const validatorAddressesChains = Object.entries(process.env).filter(([key]) =>
    key.startsWith(validatorPrefix),
  );

  for (const [key, addresses] of addressesChains) {
    const chainName = key.replace(`${prefix}_`, '').toLocaleLowerCase();

    if (!chains[chainName]) {
      chains[chainName] = {
        addresses: [],
        validatorAddresses: [],
      };
    }

    chains[chainName]['addresses'] = addresses.replace(/ /g, '').split(',');
  }

  for (const [key, addresses] of validatorAddressesChains) {
    const chainName = key
      .replace(`${validatorPrefix}_`, '')
      .toLocaleLowerCase();

    if (!chains[chainName]) {
      chains[chainName] = {
        addresses: [],
        validatorAddresses: [],
      };
    }

    chains[chainName].validatorAddresses = addresses
      .replace(/ /g, '')
      .split(',');
  }

  return chains;
};

export default () => {
  const chains = chainsToMap();

  return {
    chains,
    email: {
      user: process.env.EMAIL_USER, //your gmail account you used to set the project up in google cloud console"
      to: process.env.EMAIL_TO,
      clientId: process.env.EMAIL_CLIENT_ID,
      clientSecret: process.env.EMAIL_CLIENT_SECRET,
      refreshToken: process.env.EMAIL_REFRESH_TOKEN,
    },
  };
};
