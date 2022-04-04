const chain = "208dacab3cd2e181c86841613cf05d9c60786c677e4ce86b266d0a58884968f7";

export const environment = {
  production: true,
  appName: "Armonia Multichain platform",
  network: {
    blockchain: "AMAX",
    host: "101.132.169.141",
    port: 8888,
    protocol: "http",
    expireInSeconds: 120,
    chainId: chain,
  },
  chain: chain,
  Eos: {
    httpEndpoint: "https://expnode.amaxscan.io",
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
    logo: "/assets/images/amax.png",
    name: {
      big: "",
      small: "",
    },
    nets: [{ name: "AMAX", url: "https://www.amaxscan.io", active: true }],
    disableNets: true,
    voteDonationAcc: "eoswebnetbp1",
    disableVoteDonation: true,
    version: "2.2.8",
    producers: 1000,
    social: [],
    liveTXenable: true,
  },
};
