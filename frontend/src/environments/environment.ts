const chain =
  "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f";
export const environment = {
  production: true,
  appName: "Mango Global Payment Blockchain System",
  network: {
    blockchain: "eos",
    host: "sh-expnode.vm.mgps.me",
    port: 8888,
    protocol: "http",
    expireInSeconds: 120,
    chainId: chain,
  },
  chain: chain,
  Eos: {
    httpEndpoint: "https://sh-expnode.vm.mgps.me:8888",
    chainId: chain,
    verbose: false,
  },
  frontConfig: {
    coin: "MGP",
    bp: "bp.json",
    tokenContract: "eosio.token",
    totalBalance: "MGP",
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
