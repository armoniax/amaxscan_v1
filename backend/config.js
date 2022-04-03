/*
  App configuration example created by eoswebnetbp1
*/
const path = require('path');
let config = {};

// production mod
config.PROD = false;

config.toInt = 10000;
config.coin = 'MGP';

// mongo uri and options
config.MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/EOSweb';
config.MONGO_OPTIONS = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
    useNewUrlParser: true
};

// cron processes (aggregation of main stat - actions, transactions, accounts, analytics)
config.CRON = true;
config.CRON_API = 'https://public.eosinfra.io';

// anable TPS APS daemon aggregation
config.TPS_ENABLE = true;
config.MAX_TPS_TIME_UPDATE = 5000; // time of break between reload (leave by default)

// enable for private network (daemon for Actions, Accounts)
config.CUSTOM_GLOBA_STATS = false;

// producer json name
//config.producerJSON = 'bp.json';

// telegram alert bot (depreceted)
config.telegram = {
  ON: false,
  TOKEN: '',
  TIME_UPDATE: 5000
};

// reserve nodes
config.endpoints = [
	'http://172.17.0.1:8888'
     //'http://bp.cryptolions.io',
     //'https://eos.greymass.com',
     //'https://public.eosinfra.io', 
     //'http://eosbp-0.atticlab.net'
];

// eosjs
config.eosConfig = {
  chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
  keyProvider: "",
  httpEndpoint: config.endpoints[0],
  expireInSeconds: 60,
  broadcast: true,
  debug: false,
  sign: true,
  logger: {
    error: console.error
  }
};

// api url for producers list
config.customChain = 'http://172.17.0.1:8888';

// api url for history
config.historyChain = 'http://172.17.0.1:8888';

// tokens api
//config.tokensAPI = 'http://api.light.xeos.me/api/account/eos/';

config.apiV = 'v1'; // api version
config.RAM_UPDATE = 5 * 60 * 1000; // time for ram update - /api/api.*.socket
config.HISTORY_UPDATE = 5 * 60 * 1000; // time for stats update - /api/api.*.socket 
config.MAX_BUFFER = 500000; // max buffer size for child processes (kb) - /crons
config.blockUpdateTime = 900; // mainpage upades frequency  - /api/api.*.socket in ml sec
config.offsetElementsOnMainpage = 10; // blocks on mainpage
config.limitAsync = 30; // max threads for async.js module  
config.updateTPS = 1000;

// slack notifications
config.loggerSlack = {
      alerts: {
        type: '',
        token: '',
        channel_id: '',
        username: '',
      }
};

module.exports = config;
