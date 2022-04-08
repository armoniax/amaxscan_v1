import axios from 'axios';
import { GetCurrencyBalanceParams } from './types';

export const Ax = axios.create({
    // baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'http://sh-misc.vm.amax.dev:38888',
    baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/api',
});

console.log('AmaxExpSrv_Ver: ---->>>>>>> v0.5.31', process.env.NODE_ENV)

Ax.interceptors.response.use(response => {
    return response.data;
});

export const GET_TABLE_ROWS__RAMMARKET_10 = () => Ax.get('/v1/get_table_rows/amax/amax/rammarket/10');

export const GET_AGGREGATION_STAT = () => Ax.get('/v1/get_aggregation_stat');

export const GET_INFO = () => Ax.get('/v1/get_info');

export const GET_CONTROLLED_BY_ACCOUNT = (account: string) => Ax.get(`/v1/get_controlled_accounts/${account}`);

export const SEARCCH = (text: string) => Ax.post(`/v1/search`, { text: text.replace(/ /g, '') });

export const GET_ACCOUNT = (account: string) => Ax.get(`/v1/get_account/${account}`);

export const GET_CODE = (accountName: string) => Ax.get(`/v1/get_code/${accountName}`);

export const GET_ACTIONS_NAME = (accountName: string, actionName: string) => Ax.get(`/v1/get_actions_name/${accountName}/${actionName}?sort=1`);

export const GET_ACTIONS = (accountName: string, pos: number, elementsLimit: number) => Ax.get(`/v1/get_actions/${accountName}/${pos}/-${elementsLimit}`);

export const GET_CURRENCY_BALANCE = (parmas: GetCurrencyBalanceParams) => Ax.get(`/v1/get_currency_balance/${parmas.tokenContract}/${parmas.account}/${parmas.tokenSymbol}`);

export const GET_ACCOUNT_TOKENS = (account: string) => Ax.post(`/v1/get_account_tokens`, { account });

export const GET_TABLE_ROWS = (accountName: string, name: string, count = 20) => Ax.get(`/v1/get_table_rows/${accountName}/${accountName}/${name}/${count}`);

export const GET_EOSIO_GLOBAL_10 = () => Ax.get(`/v1/get_table_rows/eosio/eosio/global/10`);

export const GET_CHART_RAM = (date: Date) => Ax.post(`/v1/get_chart_ram`, { from: date });

export const GET_PRODUCERS_BP_JSON = () => Ax.get('/v1/get_producers_bp_json');
// export const GET_TABLE_ROWS__GLOBAL = () => Ax.get('/v1/get_table_rows/amax/amax/global/1');

export const GET_TRANSACTION = (transactionId: string) => Ax.get(`/v1/get_transaction/${transactionId}`);