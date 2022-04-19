<template lang="pug">
.text-sm.font-normal
    .flex.justify-between.lg_items-center.lg_py-7.flex-col.lg_flex-row.items-start.px-2.lg_px-0.py-4
        .text-green.py-1.px-2.bg-green.bg-opacity-20.rounded.lg_rounded-lg.mb-2.lg_mb-0 Votes: {{ state.totalVotes?.toLocaleString() }} ({{ state.votePercentage }}%)
        .flex.border-b.w-72.text-gray-ccc.border-b-gray-ccc.text-gray-ca.h-7.items-center
            i.fal.fa-search.text-gray-ca.mr-2
            input.outline-none.flex-1.h-full(placeholder='Search by producer name', v-model='filterVal')
    .overflow-scroll
        table.w-full.text-center.text-gray-666.table-compact
            thead.bg-gray.h-10
                tr
                    th #
                    th Producer Name
                    th Status
                    //- th Url
                    th Location
                    th.whitespace-nowrap Total Votes ({{ frontConfig?.coin }})
                    th Rate
                    th.whitespace-nowrap Rewards Per Day
            tbody
                tr.h-16.border-b.border-b-gray-f4(v-for='item in DataList', :key='item.index')
                    td {{ item.index }}
                    td.flex.flex-col.lg_flex-row.items-center.h-16.cursor-pointer(@click='$router.push(`/producers/${item.owner}`)')
                        //- img.w-10.mr-2(:src='item?.image || "../../assets/images/amax.png"')
                        img.w-10.lg_mr-2.lg_ml-10(:src='item?.image || "/amax.png"', @click.stop='item?.url && openUrl(item?.url)')
                        span.font-medium {{ item.owner }}
                    td
                        span.w-24.h-8.rounded-lg.flex.items-center.justify-center.text-white.m-auto(style='background: linear-gradient(139deg, #2ff443 0%, #32d5d8 100%)', v-if='item?.index <= 21 && producer !== item.owner') TOP21
                        span.w-24.h-8.rounded-lg.flex.items-center.justify-center.text-white.m-auto(style='background: linear-gradient(to right, #ff9389, #ff8ea4); background: -webkit-gradient(linear, left top, right top, from(#ff9389), to(#ff8ea4))', v-if='producer === item.owner') Producing
                        span.w-24.h-8.rounded-lg.flex.items-center.justify-center.text-white.m-auto(style='background: linear-gradient(to right, #ff9048, #f44336); background: -webkit-gradient(linear, left top, right top, from(#ff9048), to(#f44336))', v-if='item?.index > 21 && producer !== item.owner') Standby
                    //- td {{ item?.url || "-" }}
                    td
                        img.w-8.m-auto(v-if='item?.location', :src='`/flags/${item?.location}.svg`')

                    td {{ item?.total_votes / 10000 }}
                    td.whitespace-nowrap {{ item?.rate }} %
                    td.whitespace-nowrap {{ item?.rewards }} {{ frontConfig?.coin }}

    //- .flex.justify-end.items-center.text-gray-666.py-3
    //-     span Items per page:
    //-     select.outline-none.h-6.w-20.border.rounded.mx-2.border-gray-f4.cursor-pointer(v-model='state.listQuery.size')
    //-         option(value='80') 80
    //-         option(value='500') 500
    //-     span {{ state.listQuery.page }} - {{ DataList.length }} of {{ DataList.length }}
    //-     span.outline-none.h-6.w-6.border.rounded.mx-2.border-gray-f4.cursor-pointer.text-gray-666.text-center &lt;
    //-     span.outline-none.h-6.w-6.border.rounded.border-gray-f4.cursor-pointer.text-gray-666.text-center >
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, computed, onDeactivated } from 'vue';
import { environment } from '@/environments/environment';
import { GET_TABLE_ROWS, GET_PRODUCERS_BP_JSON, Ax } from '@/apis';
import { sortArray } from '@/utils';
// const account = ''
import { inject } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
    setup() {
        const socket = inject('socket') as any;
        const account = ref('amax');
        const filterVal = ref('');
        const frontConfig = ref(environment.frontConfig);
        const store = useStore();

        const producer = computed(() => store.state.producer);
        const state = reactive<any>({
            votesToRemove: 0,
            votePercentage: '0.00',
            totalVotes: 0,
            spinner: false,
            firstLoad: false,
            total: 0,
            dataList: [],
            listQuery: {
                page: 1,
                size: 80,
            },
        });

        const DataList = computed(() => {
            if (!filterVal.value) return state.dataList;

            return state.dataList.filter((item: any) => item.owner.includes(filterVal.value.trim().toLowerCase()));
        });

        const openUrl = (url: string): void => {
            window.open(url);
        };

        //        const  applyFilter(filterValue: string) {
        //   this.filterVal = filterValue;
        //   this.dataSource.filter = filterValue.trim().toLowerCase();
        // }

        const getBlockData = () => {
            state.spinner = state.firstLoad ? true : false;

            Promise.all([GET_TABLE_ROWS(account.value, 'producers', frontConfig.value.producers), GET_TABLE_ROWS(account.value, 'global', 1), GET_PRODUCERS_BP_JSON()])
                .then((results: any[]) => {
                    const totalProducerVoteWeight = Number(results[1].rows[0].total_producer_vote_weight);
                    const bpJson = results[2];
                    const globalTable = results[1];
                    getSupplyAMAX(globalTable);
                    createTable(results[0], totalProducerVoteWeight, bpJson);

                    socket.on('producers', (data: any) => {
                        if (!data) return;
                        createTable(data, totalProducerVoteWeight, bpJson);
                    });

                    state.spinner = false;
                })
                .catch(err => {
                    state.spinner = false;
                });
        };

        const createTable = (table: any, totalVotes: number, bpJson: any) => {
            if (filterVal.value.length > 0) {
                return console.log('filter val');
            }
            const mainData = table.rows;
            state.dataList = joinOtherProducerInfo(countRate(sortArray(mainData), totalVotes), bpJson);
            // let ELEMENT_DATA: Element[] = this.globalTableData;
            // this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
            // this.dataSource.paginator = this.paginator;
        };
        const countRate = (data: any[], totalProducerVoteWeight: number) => {
            if (!data) {
                return [];
            }
            state.votesToRemove = data.reduce((acc, cur) => {
                const percentageVotes = (cur.all_votes / totalProducerVoteWeight) * 100;
                if (percentageVotes * 200 < 100) {
                    acc += parseFloat(cur.all_votes);
                }
                return acc;
            }, 0);
            data.forEach((elem, index) => {
                elem.index = index + 1;
                elem.rate = !totalProducerVoteWeight ? 0 : ((elem.all_votes / totalProducerVoteWeight) * 100).toLocaleString();
                elem.rewards = !totalProducerVoteWeight ? 0 : countRewards(elem.all_votes, elem.index, totalProducerVoteWeight);
            });

            return data;
        };

        const countRewards = (total_votes: number, index: number, totalProducerVoteWeight: number) => {
            let position = index;
            let reward = 0;

            //86400 * 365 blocks for e 1st year, no reward
            if (position > 31536000) {
                let percentageVotesRewarded = (total_votes / (totalProducerVoteWeight - state.votesToRemove)) * 100;
                reward = percentageVotesRewarded; //FIXME
            }

            return Math.floor(reward).toLocaleString();
        };

        const getSupplyAMAX = (globalTable: any) => {
            Ax.get(`/custom/get_table_rows/${frontConfig.value.tokenContract}/${frontConfig.value.coin}/stat/1`).then(
                (res: any) => {
                    if (!res || !res.rows || !res.rows[0] || !res.rows[0].supply) {
                        return;
                    }
                    calculateTotalVotes(globalTable, Number(res.rows[0].supply.split(' ')[0]));
                },
                err => {
                    console.log(err);
                }
            );
        };

        const calculateTotalVotes = (global: any, supply: any) => {
            if (!global || !global.rows || !global.rows[0] || !global.rows[0].total_activated_stake) return;

            let precision = 100000000;
            supply = 1000000000; //hardcode AMA total supply here
            state.totalVotes = global.rows[0].total_activated_stake / precision;
            state.votePercentage = ((global.rows[0].total_activated_stake / precision / supply) * 100).toFixed(2);
        };

        const joinOtherProducerInfo = (sortedArr: any[], joinArr: any[]) => {
            let result = [];
            let joinObj: any = {};
            if (!joinArr) {
                return sortedArr;
            }
            joinArr.forEach(elem => {
                joinObj[elem.name] = {
                    location: elem.location,
                    image: elem.image,
                };
            });
            sortedArr.forEach(elem => {
                if (joinObj[elem.owner]) {
                    elem.location = joinObj[elem.owner].location.toLowerCase();
                    elem.image = joinObj[elem.owner].image;
                }
            });
            return sortedArr || [];
        };

        getBlockData();

        onDeactivated(() => {
            console.log(123);
            socket.removeAllListeners('producers');
        });

        return {
            producer,
            openUrl,
            DataList,
            filterVal,
            frontConfig,
            state,
        };
    },
});
</script>
