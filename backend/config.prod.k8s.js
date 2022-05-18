/*
  App configuration example created by eoswebnetbp1
*/
const path = require('path');
let config = {};

// production mod
config.PROD = true;

config.toInt = 100000000; //precison: 8
config.coin = 'AMAX';
// console.log("process.env.MONGO_URI: ===========>>>>>>>>>>", process.env)

config.MONGO_URI = process.env.MONGO_URI || 'mongodb://amax:amax123456@dds-gs54d21f519cf2d41.mongodb.singapore.rds.aliyuncs.com:3717,dds-gs54d21f519cf2d42.mongodb.singapore.rds.aliyuncs.com:3717/AMAXExpProd';
// config.MONGO_URI = process.env.MONGO_URI || 'mongodb://deex:deex123456@139.224.250.244:27017/AMAXExp';
config.MONGO_OPTIONS = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
    useNewUrlParser: true
};

// cron processes (aggregation of main stat - actions, transactions, accounts, analytics)
config.CRON = true;
config.CRON_API = process.env.CRON_API || 'https://public.eosinfra.io';

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

// reserved nodes
config.endpoints = [
  'http://172.31.12.229:8888',  //localhost access
	'https://expnode.amaxscan.io'
];

// eosjs
config.eosConfig = {
  chainId: "208dacab3cd2e181c86841613cf05d9c60786c677e4ce86b266d0a58884968f7",
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
config.customChain = process.env.CUSTOMCHAIN || 'http://172.31.12.229:8888';

// api url for history
config.historyChain = process.env.HISTORYCHAIN || 'http://172.31.12.229:8888'; //still the RPC chain

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
