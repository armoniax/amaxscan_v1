const chain =
  "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f";
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
    httpEndpoint: "https://101.132.169.141:38888",
    chainId: chain,
    verbose: false,
  },
  frontConfig: {
    coin: "AMAX",
    bp: "bp.json",
    tokenContract: "eosio.token",
    totalBalance: "AMAX",
    convertToUSD: false,
    customBalance: false,
    logo: "/assets/images/mgpweb.png",
    name: {
      big: "",
      small: "",
    },
    nets: [{ name: "MGP", url: "127.0.0.1:3039", active: true }],
    disableNets: true,
    voteDonationAcc: "eoswebnetbp1",
    disableVoteDonation: true,
    version: "2.2.8",
    producers: 1000,
    social: [],
    liveTXenable: true,
  },
};
