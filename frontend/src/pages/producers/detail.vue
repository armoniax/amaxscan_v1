<template lang="pug">
.py-2.space-y-4.producers
    h2.text-2xl Producer: {{ producer }}

    div
        .flex.items-center.h-8
            .w-44 Producer:
            .flex-1.text-green {{ producer }}
        .flex.items-center.h-8
            .w-44 Votes:
            .flex-1.text-gray-666
                span.text-black {{ mainElement?.rate?.toLocaleString() }} %
                |
                | /
                | {{ mainElement?.total_votes?.toLocaleString() }} {{ frontConfig?.coin }}
        .flex.items-center.h-8(v-if='voters?.votesCounter')
            .w-44 All voters:
            .flex-1.text-gray-666 {{ voters?.votesCounter?.toLocaleString() }}
        .flex.items-center.h-8
            .w-44 Rewards:
            .flex-1.text-gray-666 {{ mainElement?.rewards?.toLocaleString() }} {{ frontConfig?.coin }}
        .flex.items-center.h-8
            .w-44 Position:
            .flex-1.text-gray-666 # {{ mainElement?.index }}
        .flex.items-center.h-8
            .w-44 Location:
            .flex-1.text-gray-666 {{ bpData?.org?.location?.country }}, {{ bpData?.org?.location?.name }}
        .flex.items-center.h-8
            .w-44 Links:
            .flex-1.text-gray-666
                a(:href='mainElement?.url', v-if='mainElement?.url', target='_blank')
                    i.far.fa-desktop-alt
                a(:href='`https://www.facebook.com/${bpData?.org?.social?.facebook}`', v-if='bpData?.org?.social?.facebook', target='_blank')
                    i.fab.fa-facebook
                a(:href='`https://www.reddit.com/user/${bpData?.org?.social?.reddit}`', v-if='bpData?.org?.social?.reddit', target='_blank')
                    i.fab.fa-reddit
                a(:href='`https://www.youtube.com/${bpData?.org?.social?.youtube}`', v-if='bpData?.org?.social?.youtube', target='_blank')
                    i.fab.fa-youtube
                a(:href='`https://www.t.me/${bpData?.org?.social?.telegram}`', v-if='bpData?.org?.social?.telegram', target='_blank')
                    i.fab.fa-telegram
                a(:href='`https://www.twitter.com/user/${bpData?.org?.social?.twitter}`', v-if='bpData?.org?.social?.twitter', target='_blank')
                    i.fab.fa-twitter
                a(:href='`https://www.github.com/${bpData?.org?.social?.github}`', v-if='bpData?.org?.social?.github', target='_blank')
                    i.fab.fa-github
                a(:href='`https://steemit.com/${bpData?.org?.social?.steemit}`', v-if='bpData?.org?.social?.steemit', target='_blank')
                    i.fab.fa-steemit
                a(:href='`https://www.keybase.io/${bpData?.org?.social?.keybase}`', v-if='bpData?.org?.social?.keybase', target='_blank')
                    i.fab.fa-keybase
        .flex.items-center.h-8
            .w-44 Public:
            .flex-1.text-green {{ mainElement?.producer_key }}
        .flex.items-center.h-8(v-if='voters?.voters')
            .w-44 Last voters:
            .flex-1.text-gray-666
                span(v-for='voter in voters?.voters')
                    strong(v-if='voter?.currency !== frontConfig?.coin')
                        span {{ voter?.act?.data?.voter }}
                        span stake {{ voter?.stake ? voter?.stake?.toLocaleString() : 0 }} {{ frontConfig?.coin }}
        .flex.items-center.h-8
            .w-44 Nodes:
            .flex-1.text-gray-666 {{ bpData?.nodes?.length }}

    .w-full.h-96.rounded-lg.bg-gray-fb
        LMap(:zoom='option.zoom', :center='option.center')
            LTileLayer(url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png', attribution='Armonia multi-chain platform')
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { GET_TABLE_ROWS, Ax } from '@/apis';
import { sortArray } from '@/utils';
import { environment } from '@/environments/environment';
import { tileLayer, latLng, marker, circle, polygon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
// @ts-ignore
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';

export default defineComponent({
    components: {
        LMap,
        LTileLayer,
    },
    setup() {
        const account = ref('amax');
        const route = useRoute();
        const option = ref({
            layers: [tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 18, attribution: 'Armonia multi-chain platform' })],
            zoom: 1,
            center: latLng(0, 0),
        });
        const frontConfig = ref(environment.frontConfig);
        const state = reactive({
            voters: null,
            layers: [],
            bpData: null,
            spinner: false,
            votesToRemove: 0,
            mainElement: null,
        });

        const producer = computed(() => route.params.producer as string);

        const getData = () => {
            state.spinner = true;
            Promise.all([GET_TABLE_ROWS(account.value, 'producers', 500), GET_TABLE_ROWS(account.value, 'global', 1)]).then((res: any[]) => {
                const totalProducerVoteWeight = Number(res[1].rows[0].total_producer_vote_weight);
                console.log(Number(res[1].rows[0].total_producer_vote_weight));
                state.mainElement = findProducer(countRate(sortArray(res[0].rows), totalProducerVoteWeight));
                // console.log(this.mainElement)
                getBP(state.mainElement);
                state.spinner = false;
            });
        };
        const countRate = (data: any[], totalProducerVoteWeight: number) => {
            if (!data) {
                return;
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
            let percentageVotesRewarded = (total_votes / (totalProducerVoteWeight - state.votesToRemove)) * 100;

            if (position < 22) {
                reward = frontConfig.value.coin === 'EOS' ? reward + 443 : 4909;
            }
            if (frontConfig.value.coin === 'EOS') {
                reward += percentageVotesRewarded * 200;
            }
            if (reward < 100) {
                reward = 0;
            }
            return Math.floor(reward).toLocaleString();
        };

        const findProducer = (data?: any[]): any => {
            if (!data) {
                return;
            }
            let result = {};
            data.forEach((elem, index) => {
                if (elem.owner === producer.value) {
                    result = elem;
                }
            });
            return result;
        };

        const getLastVotes = (accountName: string) => {
            Ax.get(`/v1/get_voters/${accountName}?limit=20`)
                .then((res: any) => {
                    state.voters = res;
                    if (!res.voters) {
                        return;
                    }
                    res.voters.forEach((elem: any) => {
                        getStakeBalances(elem);
                    });
                })
                .catch(err => {});
        };

        const getStakeBalances = (elem: any) => {
            if (elem.act && elem.act.data && elem.act.data.voter) {
                Ax.get(`/v1/get_account/${elem.act.data.voter}`).then(
                    (res: any) => {
                        if (res && res.voter_info && res.voter_info.staked) {
                            elem.stake = res.voter_info.staked / 10000;
                        }
                    },
                    error => {
                        console.error(error);
                    }
                );
            }
        };

        const getBP = (elem: any) => {
            if (!elem || !elem.url) {
                return console.log(elem);
            }
            Ax.post(`/producer`, { url: `${elem.url}/${frontConfig.value.bp}` }).then((res: any) => {
                state.bpData = res;
                if (res.nodes && res.nodes.length) {
                    res.nodes.forEach((elem: any) => {
                        if (elem.location && elem.location.latitude && elem.location.longitude) {
                            // @ts-ignore
                            state.layers.push(circle([elem.location.latitude, elem.location.longitude], { radius: 1000 }));
                        }
                    });
                }
            });
        };

        getData();
        getLastVotes(producer.value);
        return {
            option,
            ...toRefs(state),
            frontConfig,
            producer,
        };
    },
});
</script>
