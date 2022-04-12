<template lang="pug">
.py-2.space-y-4.account.px-2.lg_px-0
    h2.lg_text-2xl.text-xl Transaction
    .text-sm.space-y-2
        .flex.items-center
            .w-24.lg_w-44 Block Number:
            .flex-1 
                a.text-green.break-all(:href='"/block/" + mainData?.block_num') {{ mainData?.block_num }}
        .flex.items-center
            .w-24.lg_w-44 Hash:
            .flex-1.text-gray-999.break-all {{ mainData?.id }}
        .flex.items-center
            .w-24.lg_w-44 Block Time:
            .flex-1.text-gray-999.break-all {{ time }}
        .flex.items-center
            .w-24.lg_w-44 Actions:
            .flex-1.font-normal.break-all {{ mainData?.trx?.trx?.actions?.length }}

    RawDataBase(title='Blockchain Raw Data:', :json='mainData')

    .overflow-x-scroll
        .tabs.flex-nowrap
            a.tab.tab-bordered(v-for='item in typeActionList', :key='item.key', :class='{ "tab-active": typeActionActive === item.key }', @click='typeActionActive = item.key') {{ item.name }}

    .token-transfer(v-if='typeActionActive === "TokenTransfer"')
        .overflow-x-auto
            table.table.w-full.my-table
                thead
                    tr
                        th Direction
                        th From
                        th To
                        th Memo
                        th Quantity
                tbody
                    template(v-for='(action, ind) in mainData?.trx?.trx?.actions')
                        tr(:key='ind', v-if='action?.name === "transfer"')
                            th 
                                strong.text-green(v-if='action?.data?.to === mainData?.account_name') In
                                strong.text-red(v-if='action?.data?.to !== mainData?.account_name') Out
                            th 
                                a(:href='"/account/" + action?.data?.from') 
                                    strong {{ action?.data?.from }}
                            th 
                                a(:href='"/account/" + action?.data?.to') 
                                    strong {{ action?.data?.to }}
                            th 
                                sapn {{ action?.data?.memo }}
                            th 
                                strong {{ action?.data?.quantity }}

    .permissions(v-if='typeActionActive === "ActionsInfo"')
        .overflow-x-auto
            table.table.w-full.my-table
                thead
                    tr
                        th Actions Info
                        th 
                tbody
                    tr(v-for='(item, index) in dataSource?.trx?.actions', :key='index')
                        th 
                            strong {{ item?.name }}
                        th 
                            actionViewer(:data='item')

    .actions(v-if='typeActionActive === "Actions"')
        JsonViewer(:value='mainData?.trx?.trx?.actions', copyable, sort, :expand-depth=5)
</template>

<script lang="ts">
// @ts-ignore
import JsonViewer from 'vue-json-viewer';

import { computed, defineComponent, reactive, toRefs } from 'vue';
import moment from 'moment';
import { useRoute } from 'vue-router';
import PageAccountBase from '@/components/Page/Account/Base.vue';
import actionViewer from './components/action_viewer.vue';
import RawDataBase from '@/components/RawData/Base.vue';
import { environment } from '@/environments/environment';
import { GET_TRANSACTION } from '@/apis';

const frontConfig = environment.frontConfig;
export default defineComponent({
    components: { PageAccountBase, RawDataBase, JsonViewer, actionViewer },
    setup() {
        const state = reactive({
            typeActionList: [
                { name: 'Token transfer', key: 'TokenTransfer' },
                { name: 'Actions info', key: 'ActionsInfo' },
                { name: 'Actions (Raw Data)', key: 'Actions' },
            ],
            typeActionActive: 'TokenTransfer',
            mainData: null,
            dataSource: null,
            time: '',
        });
        const route = useRoute();

        const transactionId = computed(() => route.params.tx as string);
        const momentFarmat = moment;

        const getBlockData = (transactionId: string) => {
            const res1232 = {
                id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28',
                trx: {
                    receipt: { status: 'executed', cpu_usage_us: 1699, net_usage_words: 49, trx: [1, { signatures: ['SIG_K1_K368KUKpHswAp52DHoD2nmL2XA1tGAGSKGS2wCZ7zmMnYKp3j97cT4rAmzGsv4W1963T6F3wNT4eWqDfcKqq1ykyGx5x3t'], compression: 'none', packed_context_free_data: '', packed_trx: 'a3394262800bd1d9c8a100000000040000000000ea305500409e9a2264b89a010000984e2603326e00000000a8ed3232660000984e2603326e50d95a8a9344336e0100000001000299669ab9aeb6ce77e8da5d971f7217af8fffd680dddc30a8fb6b643ca49f090c010000000100000001000299669ab9aeb6ce77e8da5d971f7217af8fffd680dddc30a8fb6b643ca49f090c010000000000000000ea305500b0cafe4873bd3e010000984e2603326e00000000a8ed3232140000984e2603326e50d95a8a9344336ecc1000000000000000ea305500003f2a1ba6a24a010000984e2603326e00000000a8ed3232310000984e2603326e50d95a8a9344336e6400000000000000044d4750000000006400000000000000044d47500000000001000000311a09326e7015d65765ec98ba010000984e2603326e00000000a8ed3232180000984e2603326e50d95a8a9344336e100aec71e47e326e00' }] },
                    trx: {
                        expiration: '2022-03-28T22:41:39',
                        ref_block_num: 2944,
                        ref_block_prefix: 2714294737,
                        max_net_usage_words: 0,
                        max_cpu_usage_ms: 0,
                        delay_sec: 0,
                        context_free_actions: [],
                        actions: [
                            { account: 'eosio', name: 'newaccount', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { creator: 'hst.admin', name: 'hstod4weffgp', owner: { threshold: 1, keys: [{ key: 'EOS643mgQHAXvsw5R9jaZzf6zza54D1G4S36EkufxCH7wb4Ltt1GK', weight: 1 }], accounts: [], waits: [] }, active: { threshold: 1, keys: [{ key: 'EOS643mgQHAXvsw5R9jaZzf6zza54D1G4S36EkufxCH7wb4Ltt1GK', weight: 1 }], accounts: [], waits: [] } }, hex_data: '0000984e2603326e50d95a8a9344336e0100000001000299669ab9aeb6ce77e8da5d971f7217af8fffd680dddc30a8fb6b643ca49f090c010000000100000001000299669ab9aeb6ce77e8da5d971f7217af8fffd680dddc30a8fb6b643ca49f090c01000000' },
                            { account: 'eosio', name: 'buyrambytes', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { payer: 'hst.admin', receiver: 'hstod4weffgp', bytes: 4300 }, hex_data: '0000984e2603326e50d95a8a9344336ecc100000' },
                            { account: 'eosio', name: 'delegatebw', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { from: 'hst.admin', receiver: 'hstod4weffgp', stake_net_quantity: '0.0100 MGP', stake_cpu_quantity: '0.0100 MGP', transfer: 1 }, hex_data: '0000984e2603326e50d95a8a9344336e6400000000000000044d4750000000006400000000000000044d47500000000001' },
                            { account: 'hst.mall', name: 'registeruser', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { issuer: 'hst.admin', user: 'hstod4weffgp', referrer: 'hstbxt3lxk51' }, hex_data: '0000984e2603326e50d95a8a9344336e100aec71e47e326e' },
                        ],
                        transaction_extensions: [],
                        signatures: ['SIG_K1_K368KUKpHswAp52DHoD2nmL2XA1tGAGSKGS2wCZ7zmMnYKp3j97cT4rAmzGsv4W1963T6F3wNT4eWqDfcKqq1ykyGx5x3t'],
                        context_free_data: [],
                    },
                },
                block_time: '2022-03-28T22:40:40.000',
                block_num: 106892493,
                last_irreversible_block: 108235799,
                traces: [
                    { action_ordinal: 1, creator_action_ordinal: 0, closest_unnotified_ancestor_action_ordinal: 0, receipt: { receiver: 'eosio', act_digest: '45b8e1df1f8f00e11ce53dac3d846724f183cba888a84f463b568695b79f766a', global_sequence: 108541119, recv_sequence: 107037804, auth_sequence: [['hst.admin', 32643]], code_sequence: 7, abi_sequence: 16 }, receiver: 'eosio', act: { account: 'eosio', name: 'newaccount', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { creator: 'hst.admin', name: 'hstod4weffgp', owner: { threshold: 1, keys: [{ key: 'EOS643mgQHAXvsw5R9jaZzf6zza54D1G4S36EkufxCH7wb4Ltt1GK', weight: 1 }], accounts: [], waits: [] }, active: { threshold: 1, keys: [{ key: 'EOS643mgQHAXvsw5R9jaZzf6zza54D1G4S36EkufxCH7wb4Ltt1GK', weight: 1 }], accounts: [], waits: [] } }, hex_data: '0000984e2603326e50d95a8a9344336e0100000001000299669ab9aeb6ce77e8da5d971f7217af8fffd680dddc30a8fb6b643ca49f090c010000000100000001000299669ab9aeb6ce77e8da5d971f7217af8fffd680dddc30a8fb6b643ca49f090c01000000' }, context_free: false, elapsed: 114, console: '', trx_id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28', block_num: 106892493, block_time: '2022-03-28T22:40:40.000', producer_block_id: '065f0ccdb6d2aed70d62a86a662c8f0826c0b1877dd12715f8eb92f0df191022', account_ram_deltas: [{ account: 'hstod4weffgp', delta: 2996 }], except: null, error_code: null },
                    { action_ordinal: 2, creator_action_ordinal: 0, closest_unnotified_ancestor_action_ordinal: 0, receipt: { receiver: 'eosio', act_digest: '7caa54a8fbc46fc6af087cee9d6125e23cd29d1f78f259589900dc25831f392e', global_sequence: 108541120, recv_sequence: 107037805, auth_sequence: [['hst.admin', 32644]], code_sequence: 7, abi_sequence: 16 }, receiver: 'eosio', act: { account: 'eosio', name: 'buyrambytes', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { payer: 'hst.admin', receiver: 'hstod4weffgp', bytes: 4300 }, hex_data: '0000984e2603326e50d95a8a9344336ecc100000' }, context_free: false, elapsed: 168, console: '', trx_id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28', block_num: 106892493, block_time: '2022-03-28T22:40:40.000', producer_block_id: '065f0ccdb6d2aed70d62a86a662c8f0826c0b1877dd12715f8eb92f0df191022', account_ram_deltas: [], except: null, error_code: null },
                    {
                        action_ordinal: 5,
                        creator_action_ordinal: 2,
                        closest_unnotified_ancestor_action_ordinal: 2,
                        receipt: {
                            receiver: 'eosio.token',
                            act_digest: '77fe36251def18b4645b1c807340d15b6c677b36f5a9d769293b8843d2d1d080',
                            global_sequence: 108541121,
                            recv_sequence: 406306,
                            auth_sequence: [
                                ['eosio.ram', 162555],
                                ['hst.admin', 32645],
                            ],
                            code_sequence: 9,
                            abi_sequence: 4,
                        },
                        receiver: 'eosio.token',
                        act: {
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [
                                { actor: 'hst.admin', permission: 'active' },
                                { actor: 'eosio.ram', permission: 'active' },
                            ],
                            data: { from: 'hst.admin', to: 'eosio.ram', quantity: '0.0116 MGP', memo: 'buy ram' },
                            hex_data: '0000984e2603326e000090e602ea30557400000000000000044d475000000000076275792072616d',
                        },
                        context_free: false,
                        elapsed: 51,
                        console: '',
                        trx_id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28',
                        block_num: 106892493,
                        block_time: '2022-03-28T22:40:40.000',
                        producer_block_id: '065f0ccdb6d2aed70d62a86a662c8f0826c0b1877dd12715f8eb92f0df191022',
                        account_ram_deltas: [],
                        except: null,
                        error_code: null,
                    },
                    {
                        action_ordinal: 7,
                        creator_action_ordinal: 5,
                        closest_unnotified_ancestor_action_ordinal: 5,
                        receipt: {
                            receiver: 'hst.admin',
                            act_digest: '77fe36251def18b4645b1c807340d15b6c677b36f5a9d769293b8843d2d1d080',
                            global_sequence: 108541122,
                            recv_sequence: 6751,
                            auth_sequence: [
                                ['eosio.ram', 162556],
                                ['hst.admin', 32646],
                            ],
                            code_sequence: 9,
                            abi_sequence: 4,
                        },
                        receiver: 'hst.admin',
                        act: {
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [
                                { actor: 'hst.admin', permission: 'active' },
                                { actor: 'eosio.ram', permission: 'active' },
                            ],
                            data: { from: 'hst.admin', to: 'eosio.ram', quantity: '0.0116 MGP', memo: 'buy ram' },
                            hex_data: '0000984e2603326e000090e602ea30557400000000000000044d475000000000076275792072616d',
                        },
                        context_free: false,
                        elapsed: 1,
                        console: '',
                        trx_id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28',
                        block_num: 106892493,
                        block_time: '2022-03-28T22:40:40.000',
                        producer_block_id: '065f0ccdb6d2aed70d62a86a662c8f0826c0b1877dd12715f8eb92f0df191022',
                        account_ram_deltas: [],
                        except: null,
                        error_code: null,
                    },
                    {
                        action_ordinal: 8,
                        creator_action_ordinal: 5,
                        closest_unnotified_ancestor_action_ordinal: 5,
                        receipt: {
                            receiver: 'eosio.ram',
                            act_digest: '77fe36251def18b4645b1c807340d15b6c677b36f5a9d769293b8843d2d1d080',
                            global_sequence: 108541123,
                            recv_sequence: 54185,
                            auth_sequence: [
                                ['eosio.ram', 162557],
                                ['hst.admin', 32647],
                            ],
                            code_sequence: 9,
                            abi_sequence: 4,
                        },
                        receiver: 'eosio.ram',
                        act: {
                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [
                                { actor: 'hst.admin', permission: 'active' },
                                { actor: 'eosio.ram', permission: 'active' },
                            ],
                            data: { from: 'hst.admin', to: 'eosio.ram', quantity: '0.0116 MGP', memo: 'buy ram' },
                            hex_data: '0000984e2603326e000090e602ea30557400000000000000044d475000000000076275792072616d',
                        },
                        context_free: false,
                        elapsed: 2,
                        console: '',
                        trx_id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28',
                        block_num: 106892493,
                        block_time: '2022-03-28T22:40:40.000',
                        producer_block_id: '065f0ccdb6d2aed70d62a86a662c8f0826c0b1877dd12715f8eb92f0df191022',
                        account_ram_deltas: [],
                        except: null,
                        error_code: null,
                    },
                    { action_ordinal: 6, creator_action_ordinal: 2, closest_unnotified_ancestor_action_ordinal: 2, receipt: { receiver: 'eosio.token', act_digest: '8ca2fb0b2a6ea527dc81155fe96ee43c3e226b830e8785b42ac8b35f0d7bcbf1', global_sequence: 108541124, recv_sequence: 406307, auth_sequence: [['hst.admin', 32648]], code_sequence: 9, abi_sequence: 4 }, receiver: 'eosio.token', act: { account: 'eosio.token', name: 'transfer', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { from: 'hst.admin', to: 'eosio.ramfee', quantity: '0.0001 MGP', memo: 'ram fee' }, hex_data: '0000984e2603326ea0d492e602ea30550100000000000000044d4750000000000772616d20666565' }, context_free: false, elapsed: 37, console: '', trx_id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28', block_num: 106892493, block_time: '2022-03-28T22:40:40.000', producer_block_id: '065f0ccdb6d2aed70d62a86a662c8f0826c0b1877dd12715f8eb92f0df191022', account_ram_deltas: [], except: null, error_code: null },
                    { action_ordinal: 9, creator_action_ordinal: 6, closest_unnotified_ancestor_action_ordinal: 6, receipt: { receiver: 'hst.admin', act_digest: '8ca2fb0b2a6ea527dc81155fe96ee43c3e226b830e8785b42ac8b35f0d7bcbf1', global_sequence: 108541125, recv_sequence: 6752, auth_sequence: [['hst.admin', 32649]], code_sequence: 9, abi_sequence: 4 }, receiver: 'hst.admin', act: { account: 'eosio.token', name: 'transfer', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { from: 'hst.admin', to: 'eosio.ramfee', quantity: '0.0001 MGP', memo: 'ram fee' }, hex_data: '0000984e2603326ea0d492e602ea30550100000000000000044d4750000000000772616d20666565' }, context_free: false, elapsed: 1, console: '', trx_id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28', block_num: 106892493, block_time: '2022-03-28T22:40:40.000', producer_block_id: '065f0ccdb6d2aed70d62a86a662c8f0826c0b1877dd12715f8eb92f0df191022', account_ram_deltas: [], except: null, error_code: null },
                    { action_ordinal: 10, creator_action_ordinal: 6, closest_unnotified_ancestor_action_ordinal: 6, receipt: { receiver: 'eosio.ramfee', act_digest: '8ca2fb0b2a6ea527dc81155fe96ee43c3e226b830e8785b42ac8b35f0d7bcbf1', global_sequence: 108541126, recv_sequence: 54185, auth_sequence: [['hst.admin', 32650]], code_sequence: 9, abi_sequence: 4 }, receiver: 'eosio.ramfee', act: { account: 'eosio.token', name: 'transfer', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { from: 'hst.admin', to: 'eosio.ramfee', quantity: '0.0001 MGP', memo: 'ram fee' }, hex_data: '0000984e2603326ea0d492e602ea30550100000000000000044d4750000000000772616d20666565' }, context_free: false, elapsed: 1, console: '', trx_id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28', block_num: 106892493, block_time: '2022-03-28T22:40:40.000', producer_block_id: '065f0ccdb6d2aed70d62a86a662c8f0826c0b1877dd12715f8eb92f0df191022', account_ram_deltas: [], except: null, error_code: null },
                    { action_ordinal: 3, creator_action_ordinal: 0, closest_unnotified_ancestor_action_ordinal: 0, receipt: { receiver: 'eosio', act_digest: '9e1d6aa1e39876be2132571f992d9428930993976afef66d238b37d7a94cf4ba', global_sequence: 108541127, recv_sequence: 107037806, auth_sequence: [['hst.admin', 32651]], code_sequence: 7, abi_sequence: 16 }, receiver: 'eosio', act: { account: 'eosio', name: 'delegatebw', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { from: 'hst.admin', receiver: 'hstod4weffgp', stake_net_quantity: '0.0100 MGP', stake_cpu_quantity: '0.0100 MGP', transfer: 1 }, hex_data: '0000984e2603326e50d95a8a9344336e6400000000000000044d4750000000006400000000000000044d47500000000001' }, context_free: false, elapsed: 134, console: '', trx_id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28', block_num: 106892493, block_time: '2022-03-28T22:40:40.000', producer_block_id: '065f0ccdb6d2aed70d62a86a662c8f0826c0b1877dd12715f8eb92f0df191022', account_ram_deltas: [{ account: 'hstod4weffgp', delta: 450 }], except: null, error_code: null },
                    { action_ordinal: 11, creator_action_ordinal: 3, closest_unnotified_ancestor_action_ordinal: 3, receipt: { receiver: 'eosio.token', act_digest: '392aa9771d13c10dab79ecd43153a9df8a89c3e858ce9bb3a5c1a5bd4fa74d94', global_sequence: 108541128, recv_sequence: 406308, auth_sequence: [['hst.admin', 32652]], code_sequence: 9, abi_sequence: 4 }, receiver: 'eosio.token', act: { account: 'eosio.token', name: 'transfer', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { from: 'hst.admin', to: 'eosio.stake', quantity: '0.0200 MGP', memo: 'stake bandwidth' }, hex_data: '0000984e2603326e0014341903ea3055c800000000000000044d4750000000000f7374616b652062616e647769647468' }, context_free: false, elapsed: 36, console: '', trx_id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28', block_num: 106892493, block_time: '2022-03-28T22:40:40.000', producer_block_id: '065f0ccdb6d2aed70d62a86a662c8f0826c0b1877dd12715f8eb92f0df191022', account_ram_deltas: [], except: null, error_code: null },
                    { action_ordinal: 12, creator_action_ordinal: 11, closest_unnotified_ancestor_action_ordinal: 11, receipt: { receiver: 'hst.admin', act_digest: '392aa9771d13c10dab79ecd43153a9df8a89c3e858ce9bb3a5c1a5bd4fa74d94', global_sequence: 108541129, recv_sequence: 6753, auth_sequence: [['hst.admin', 32653]], code_sequence: 9, abi_sequence: 4 }, receiver: 'hst.admin', act: { account: 'eosio.token', name: 'transfer', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { from: 'hst.admin', to: 'eosio.stake', quantity: '0.0200 MGP', memo: 'stake bandwidth' }, hex_data: '0000984e2603326e0014341903ea3055c800000000000000044d4750000000000f7374616b652062616e647769647468' }, context_free: false, elapsed: 2, console: '', trx_id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28', block_num: 106892493, block_time: '2022-03-28T22:40:40.000', producer_block_id: '065f0ccdb6d2aed70d62a86a662c8f0826c0b1877dd12715f8eb92f0df191022', account_ram_deltas: [], except: null, error_code: null },
                    { action_ordinal: 13, creator_action_ordinal: 11, closest_unnotified_ancestor_action_ordinal: 11, receipt: { receiver: 'eosio.stake', act_digest: '392aa9771d13c10dab79ecd43153a9df8a89c3e858ce9bb3a5c1a5bd4fa74d94', global_sequence: 108541130, recv_sequence: 43694, auth_sequence: [['hst.admin', 32654]], code_sequence: 9, abi_sequence: 4 }, receiver: 'eosio.stake', act: { account: 'eosio.token', name: 'transfer', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { from: 'hst.admin', to: 'eosio.stake', quantity: '0.0200 MGP', memo: 'stake bandwidth' }, hex_data: '0000984e2603326e0014341903ea3055c800000000000000044d4750000000000f7374616b652062616e647769647468' }, context_free: false, elapsed: 1, console: '', trx_id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28', block_num: 106892493, block_time: '2022-03-28T22:40:40.000', producer_block_id: '065f0ccdb6d2aed70d62a86a662c8f0826c0b1877dd12715f8eb92f0df191022', account_ram_deltas: [], except: null, error_code: null },
                    { action_ordinal: 4, creator_action_ordinal: 0, closest_unnotified_ancestor_action_ordinal: 0, receipt: { receiver: 'hst.mall', act_digest: '5c1bab5c19b9e3ed6c53d879027d8b2742da0125304685e0f124cb00df29186f', global_sequence: 108541131, recv_sequence: 134500, auth_sequence: [['hst.admin', 32655]], code_sequence: 165, abi_sequence: 14 }, receiver: 'hst.mall', act: { account: 'hst.mall', name: 'registeruser', authorization: [{ actor: 'hst.admin', permission: 'active' }], data: { issuer: 'hst.admin', user: 'hstod4weffgp', referrer: 'hstbxt3lxk51' }, hex_data: '0000984e2603326e50d95a8a9344336e100aec71e47e326e' }, context_free: false, elapsed: 133, console: '', trx_id: '5fcd26c9fe739ced1543f892a4036879a48479d52e5c826b4749bc82b0e3ed28', block_num: 106892493, block_time: '2022-03-28T22:40:40.000', producer_block_id: '065f0ccdb6d2aed70d62a86a662c8f0826c0b1877dd12715f8eb92f0df191022', account_ram_deltas: [{ account: 'hst.mall', delta: 522 }], except: null, error_code: null },
                ],
            };
            GET_TRANSACTION(transactionId).then((res: any) => {
                state.mainData = res;
                if (state.mainData && !state.mainData.trx && state.mainData.action_traces) {
                    state.mainData.trx = {};
                    state.mainData.trx.trx = {};
                    state.mainData.trx.trx.actions = createActionsArr(state.mainData.action_traces);
                }
                state.time = momentFarmat(state.mainData.block_time).format('MMMM Do YYYY, h:mm:ss a');
                state.dataSource = state.mainData.trx;
            });
        };

        const createActionsArr = actions => {
            let result = actions.map(elem => {
                return elem.act;
            });
            return result;
        };

        ((): void => {
            getBlockData(transactionId.value);
        })();

        return {
            ...toRefs(state),
            transactionId,
            momentFarmat,
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
