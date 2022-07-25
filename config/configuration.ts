const chainsToMap = (prefix = 'CHAINS') => {
  const chains: { [key: string]: string[] } = {};
  const envChains = Object.entries(process.env).filter(([key]) =>
    key.startsWith(prefix),
  );

  for (const [key, addresses] of envChains) {
    const chainName = key.replace(`${prefix}_`, '').toLocaleLowerCase();

    chains[chainName] = addresses.replace(/ /g, '').split(',');
  }

  return chains;
};

export default () => {
  const chains = chainsToMap();

  return {
    chains,
    email: {
      user: process.env.EMAIL_USER, //your gmail account you used to set the project up in google cloud console"
      clientId: process.env.EMAIL_CLIENT_ID,
      clientSecret: process.env.EMAIL_CLIENT_SECRET,
    },
  };
};
