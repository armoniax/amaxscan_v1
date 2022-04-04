<template lang="pug">
.py-2.space-y-4.account
    h2.text-2xl Account: {{ account || "-" }}
    PageAccountBase(:time='state.time', :mainData='state.mainData', :unstaked='state.unstaked', :balance='state.balance', :creator='state.creator')
    RawDataBase(title='Contract Raw Data:', :json='state.code')
    RawDataBase(title='Blockchain Raw Data:', :json='state.mainData')
    RawDataBase(v-for="(elem, ind) in state.tables", :index="ind", v-if="state.tables.length > 0", :title='"Table - " + elem.name', :json='elem.data')
    //- div(v-for="(elem, ind) in state.tables", :index="ind", v-if="state.tables.length > 0")
    //-     RawDataBase(:title='"Table - " + elem.name', :json='elem.data')
    //- RawDataBase(v-for="(elem, ind) in [1,2,3,4,5,6]", :key="ind" :title='"Table - " + ind', :json='state.mainData')

    .tabs
        a.tab.tab-bordered(v-for='item in state.typeActionList', :key='item.key', :class='{ "tab-active": state.typeActionActive === item.key }', @click='state.typeActionActive = item.key') {{ item.name }}

    .actions-info(v-if='state.typeActionActive === "ActionsInfo"')
        .flex.border-b.w-72.text-gray-ccc.border-b-gray-ccc.text-gray-ca.h-7.items-center
            i.fal.fa-search.text-gray-ca.mr-2
            input.outline-none.flex-1.h-full.text-black(placeholder='Search by producer name', v-model='searVal', @keyup='searchActions')

        .overflow-x-auto
            table.table.w-full.my-table
                thead
                    tr
                        th #
                        th Tx id
                        th Date
                        th Name
                        th Action data
                tbody
                    tr(v-for='(element, index) in state.showDataSource', :key='index')
                        th {{ index }}-{{ searVal }}
                        th 
                            a(:href='"/transaction/" + element?.action_trace?.trx_id') {{ hash(element?.action_trace?.trx_id) }}
                        th {{ momentFarmat(element?.block_time).format("lll") }}
                        th 
                            strong 
                                span.mr-1.text-green {{ element?.action_trace?.act?.account }}
                                | - {{ element?.action_trace?.act?.name }}
                        th 
                            strong
                                span.text-green {{ element?.action_trace?.act?.data?.from }}
                                span.ml-2.mr-2 →
                                span.text-green {{ element?.action_trace?.act?.data?.to }}
                                span.ml-2 {{ element?.action_trace?.act?.data?.quantity }}

        .flex.justify-end.items-center.text-gray-666.py-3.text-sm.font-normal
            //- span Items per pag:
            //- select.outline-none.h-6.w-10.border.rounded.mx-2.border-gray-f4.cursor-pointer
            //-     option(v-for="i in 10", :key="i") {{ i }}
            span 1 - 40 of 44
            span.outline-none.h-6.w-6.border.rounded.mx-2.border-gray-f4.cursor-pointer.text-gray-666.text-center(@click='changePage("up")') &lt;
            span.outline-none.h-6.w-6.border.rounded.border-gray-f4.cursor-pointer.text-gray-666.text-center(@click='changePage("down")') &gt;

    .token-transfer(v-if='state.typeActionActive === "TokenTransfer"')
        .overflow-x-auto
            table.table.w-full.my-table
                thead
                    tr
                        th Time
                        th Direction
                        th From
                        th To
                        th Memo
                        th Quantity
                        th Tx id
                tbody
                    tr(v-for='(action, ind) in state.actions', :key='ind')
                        th 
                            strong {{ momentFarmat(action?.block_time).format("lll") }}
                        th 
                            strong.text-green(v-if='action?.action_trace?.act?.data?.to === state.mainData?.account_name') In
                            strong.text-red(v-if='action?.action_trace?.act?.data?.to !== state.mainData?.account_name') Out
                        th 
                            a(:href='"/account/" + action?.action_trace?.act?.data?.from') 
                                strong {{ action?.action_trace?.act?.data?.from }}
                        th 
                            a(:href='"/account/" + action?.action_trace?.act?.data?.to') 
                                strong {{ action?.action_trace?.act?.data?.to }}
                        th {{ action?.action_trace?.act?.data?.memo }}
                        th 
                            strong {{ action?.action_trace?.act?.data?.quantity }}
                        th 
                            a.text-green(:href='"/transaction/" + action?.action_trace?.trx_id') {{ hash(action?.action_trace?.trx_id) }}

    .actions(v-if='state.typeActionActive === "Actions"')
        JsonViewer(:value='state.actions', copyable, sort)

    .permissions(v-if='state.typeActionActive === "Permissions"')
        .overflow-x-auto
            table.table.w-full.my-table
                thead
                    tr
                        th Permission
                        th Account/Address
                        th Threshold
                        th Weight
                tbody
                    tr(v-for='(item, index) in state.dataSourcePermission', :key='index')
                        th 
                            strong {{ item?.perm_name }}
                        th 
                            a(:href='"/address/" + item.required_auth.keys[0].key') {{ item?.required_auth?.keys[0]?.key }}
                        th 
                            strong {{ item?.required_auth?.threshold }}
                        th 
                            strong {{ item?.required_auth?.keys[0]?.weight }}

    .controlled(v-if='state.typeActionActive === "ControlledAccounts"')
        .overflow-x-auto
            table.table.w-full.my-table
                thead
                    tr
                        th #
                        th Tx id
                        th Date
                        th Name
                        th Action data
                tbody
                    tr(v-for='i in 10', :key='i' v-if="false")
                        th {{ i }}
                        th pojekngj
                        th 2022-06-24
                        th lsafkljaioswng
                        th 2022-06-24
</template>

<script lang="ts">
// @ts-ignore
import JsonViewer from 'vue-json-viewer';

import { computed, defineComponent, InputHTMLAttributes, reactive, ref } from 'vue';
import moment from 'moment';
import { useRoute } from 'vue-router';
import PageAccountBase from '@/components/Page/Account/Base.vue';
import RawDataBase from '@/components/RawData/Base.vue';
import { environment } from '@/environments/environment';
import { GET_CONTROLLED_BY_ACCOUNT, GET_ACCOUNT_TOKENS, GET_ACCOUNT, GET_CURRENCY_BALANCE, GET_ACTIONS, GET_ACTIONS_NAME, GET_CODE, GET_TABLE_ROWS, GET_TABLE_ROWS__RAMMARKET_10 } from '@/apis';

const frontConfig = environment.frontConfig;
export default defineComponent({
    components: { PageAccountBase, RawDataBase, JsonViewer },
    setup() {
        // const type = ref(1)

        const state = reactive<Record<string, any>>({
            typeActionList: [
                { name: 'Actions info', key: 'ActionsInfo' },
                { name: 'Token transfer', key: 'TokenTransfer' },
                { name: 'Actions (Raw Data)', key: 'Actions' },
                { name: 'Permissions', key: 'Permissions' },
                { name: 'Controlled Accounts', key: 'ControlledAccounts' },
            ],
            typeActionActive: 'ActionsInfo',
            controlledAccount: {},
            mainData: {},
            creator: {},
            unstaked: '0',
            balance: '0',
            time: '',
            position: 1,
            dataSourcePermission: [],
            actionsNotSorted: [],
            actionsArray: [],
            actions: [],
            dataSource: [],
            showDataSource: [],
            tables: [],
            actionsTotal: 0,
            currentPage: 1,
        });
        const route = useRoute();
        const searVal = ref('');

        const account = computed(() => route.params.account as string);
        const momentFarmat = moment;

        // pass  接口通了  没数据
        const getControlledAccounts = (account: string) => {
            GET_CONTROLLED_BY_ACCOUNT(account).then((res: any) => {
                state.controlledAccount = res && !res.controlled_accounts ? createArrayAccounts(res) : res;
            });
        };

        const createArrayAccounts = (data: any[]) => {
            let result: Record<string, any> = {
                controlled_accounts: [],
            };
            data.forEach(elem => {
                if (elem.controlled_permission === 'active') {
                    result.controlled_accounts.push(elem.controlled_account);
                }
            });
            return result;
        };

        const getBlockData = (account: string) => {
            GET_ACCOUNT(account).then((res: any) => {
                state.mainData = res;
                state.dataSourcePermission = res.permissions; // Table Permissions
                state.typeActionList[3].name = `${state.typeActionList[3].name} (${res.permissions.length ?? 0})`;
                state.time = moment(state.mainData.created).format('MMMM Do YYYY, h:mm:ss a');

                getBalance(account);
                getActions(state.mainData.account_name, state.position); // Table Actions info
                getAccountCreator(state.mainData.account_name); // 报错 暂不处理  testnet.amaxscan.io也一样
                getCode(state.mainData.account_name);

                console.log('getAccount-----', res);
            });
        };

        // pending状态
        const getAllTokens = (account: string) => {
            GET_ACCOUNT_TOKENS(account).then((res: any) => {
                console.log('GET_ACCOUNT_TOKENS-----', res);
            });
        };

        const getBalance = (account: string) => {
            GET_CURRENCY_BALANCE({ tokenContract: frontConfig.tokenContract, account, tokenSymbol: frontConfig.coin }).then((res: any) => {
                console.log('getBalance-----', res);

                state.unstaked = !res[0] ? 0 : Number(res[0].split(' ')[0]);
                let staked = 0;
                if (state.mainData.voter_info && state.mainData.voter_info.staked) {
                    staked = state.mainData.voter_info.staked;
                }
                if (frontConfig.customBalance) {
                    state.balance = state.unstaked;
                } else {
                    state.balance = frontConfig.coin !== 'WAX' ? state.unstaked + staked / 10000 : state.unstaked + staked / 100000000;
                }
                // state.eosRate = this.MainService.getEosPrice();
            });
        };

        // Token transfer      Actions (Raw Data)        Actions info
        const getActions = (account: string, pos: number) => {
            console.log('getActions for account: ', account);
            pos = pos === 1 ? -1 : pos;
            GET_ACTIONS(account, pos, 100).then((res: any) => {
                console.log('getActions-----', res);
                state.actionsNotSorted = res.actions;
                if (res.actions[0] && !res.actions[0].action_trace) {
                    res.actions = createActionsArr(res.actions);
                    state.actionsTotal = res.actionsTotal;
                } else {
                    res.actions.reverse();
                }
                res.actions = sortArrayFunctions(res.actions);
                Array.prototype.push.apply(state.actionsArray, res.actions);

                state.actions = state.actionsArray;
                state.dataSource = state.actionsArray;
                state.showDataSource = [...state.actionsArray];
                console.log('state.dataSource---1', JSON.parse(JSON.stringify(state.dataSource)));

                // state.dataSource.filterPredicate = function (data:any, filter: string): boolean {
                //     return data.action_trace.act.name.toLowerCase().includes(filter) || data.action_trace.act.account.toLowerCase().includes(filter);
                // };

                // console.log('state.dataSource', state.dataSource.filterPredicate)
            });
        };

        const createActionsArr = (actions: any[]) => {
            actions.forEach(elem => {
                elem.action_trace = {};
                elem.action_trace.receipt = elem.receipt;
                elem.action_trace.act = elem.act;
                elem.action_trace.trx_id = elem.trx_id;
            });
            return actions;
        };

        const sortArrayFunctions = (data: any[]) => {
            if (!data) {
                return [];
            }
            let uniqieString: any[] = [];
            let result: any[] = [];
            data.forEach(elem => {
                let unique = elem.action_trace.act.hex_data + elem.action_trace.trx_id;
                if (uniqieString.indexOf(unique) === -1) {
                    result.push(elem);
                    uniqieString.push(unique);
                }
            });
            uniqieString = [];
            return result;
        };

        const getAccountCreator = (account: string) => {
            GET_ACTIONS_NAME(account, 'newaccount').then((res: any) => {
                state.creator = res.actions[0];
                console.log('getAccountCreator-----', res);
            });
        };

        const getCode = (account: string) => {
            GET_CODE(account).then((res: any) => {
                console.log('getCode-----', res);
                state.code = res;
                createTables(res, account);
            });
        };

        const createTables = (data: any, account: string) => {
            if (!data.abi || !data.abi.tables) {
                return;
            }
            data.abi.tables.forEach((elem: any) => {
                GET_TABLE_ROWS(account, elem.name).then((res: any) => {
                    console.log('GET_TABLE_ROWS-----', res);
                    state.tables.push({ name: elem.name, data: res });
                });
            });
        };
        const GetTableRowsRammarket10 = () => {
            GET_TABLE_ROWS__RAMMARKET_10().then((res: any) => {
                console.log('getBalance-----', res);
            });
        };

        const hash = (txHash: string) => {
            if (!txHash) {
                return '--';
            }
            return txHash.substring(0, 6) + '...' + txHash.substring(txHash.length - 6, txHash.length);
        };

        const searchActions = () => {
            state.showDataSource = state.dataSource.filter((ele: any) => ele?.action_trace?.act?.account.indexOf(searVal.value) != -1);
        };

        const changePage = (page: number | string = 1) => {
            // state.showDataSource
        };

        ((): void => {
            state.actionsArray = [];
            getBlockData(account.value);
            getControlledAccounts(account.value);
            getAllTokens(account.value);
        })();

        return {
            state,
            searVal,
            account,
            momentFarmat,
            searchActions,
            changePage,
            hash,
        };
    },
});
</script>

<style lang="scss">
.account {
    .tab {
        &.tab-active {
            color: #30a873;
            border-color: #30a873;
        }
        // --tab-color:
    }
    th {
        @apply font-normal text-sm text-gray-666;
    }
}
</style>
