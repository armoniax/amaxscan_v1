const chain = "208dacab3cd2e181c86841613cf05d9c60786c677e4ce86b266d0a58884968f7";

export const environment = {
  production: true,
  appName: "Armonia Multichain Blockchain Platform",
  network: {
    blockchain: "AMAX",
    host: "101.132.169.141",
    port: 38888,
    protocol: "http",
    expireInSeconds: 120,
    chainId: chain,
  },
  chain: chain,
  Eos: {
    httpEndpoint: "http://101.132.169.141:38888",
    chainId: chain,
    verbose: false,
  },
  frontConfig: {
    coin: "AMAX",
    bp: "bp.json",
    tokenContract: "amax.token",
    totalBalance: "AMAX",
    convertToUSD: false,
    customBalance: false,
    logo: "/assets/images/mgpweb.png",
    name: {
      big: "",
      small: "",
    },
    nets: [{ name: "AMAX", url: "10.88.0.1:3039", active: true }],
    disableNets: true,
    voteDonationAcc: "eoswebnetbp1",
    disableVoteDonation: true,
    version: "2.2.8",
    producers: 1000,
    social: [],
    liveTXenable: true,
  },
};
