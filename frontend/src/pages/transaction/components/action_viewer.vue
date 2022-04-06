<template lang="pug">
div
    .flex(v-if="data?.name !== 'transfer' && data?.name !== 'buyram' && data?.name !== 'sellram' && data?.name !== 'newaccount' && data?.name !== 'buyrambytes' && data?.name !== 'delegatebw' && data?.name !== 'undelegatebw' && data?.name !== 'voteproducer'")
        .memo-data-action {{dataString}}
        i.fal.fa-search.text-gray-ca.mr-1.cursor-pointer(v-if="dataString?.length > length" @click="openDialog(dataString)")

    .flex(v-if="data?.name === 'transfer'")
        .flex.ml-10
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.from') {{ dataObj?.from }}
            i.fas.fa-long-arrow-right

        .flex.ml-10
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.to') {{ dataObj?.to }}
            i.fas.fa-long-arrow-right

        .flex.ml-10(v-if="dataObj?.memo?.length")
            .flex
                .memo-data(:class="{'memo-less-then-length': dataObj?.memo?.length < 20}") {{dataObj?.memo}}
                i.far.fa-search.icon-memo-open(v-if="dataObj?.memo?.length > 20" @click="openDialog(dataObj?.memo)")

        .flex.ml-10
            strong.text-gray-333 {{dataObj?.quantity}}


    .flex(v-if="data?.name === 'buyram'")
        .flex.ml-10
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.payer') {{ dataObj?.payer }}
            i.fas.fa-long-arrow-right

        .flex.ml-10
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.receiver') {{ dataObj?.receiver }}
            i.fas.fa-long-arrow-right

        .flex.ml-10
            strong.text-gray-333 {{dataObj?.quant}}

    .flex(v-if="data?.name === 'sellram'")
        .flex.ml-10
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.account') {{ dataObj?.account }}
            i.fas.fa-long-arrow-right

        .flex.ml-10
            strong.text-gray-333 {{ (dataObj?.bytes / 1024).toLocaleString() }} kb

    .flex(v-if="data?.name === 'delegatebw'")
        .flex.ml-10(v-if="dataObj?.from")
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.from') {{ dataObj?.from }}
            i.fas.fa-long-arrow-right

        .flex.ml-10(v-if="dataObj?.from")
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.receiver') {{ dataObj?.receiver }}

        .flex.ml-10(v-if="dataObj?.from")
            span.mr-5 net: 
            strong.text-gray-333 {{ dataObj?.stake_net_quantity }}

        .flex.ml-10(v-if="dataObj?.from")
            span.mr-5 cpu: 
            strong.text-gray-333 {{ dataObj?.stake_cpu_quantity }}
        
        .flex.ml-10(v-if="dataObj?.to")
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.to') {{ dataObj?.to }}

        .flex.ml-10(v-if="dataObj?.to")
            span.mr-5 quantity: 
            strong.text-gray-333 {{ dataObj?.quantity }}

    .flex(v-if="data?.name === 'undelegatebw'")
        .flex.ml-10
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.from') {{ dataObj?.from }}
            i.fas.fa-long-arrow-right

        .flex.ml-10
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.receiver') {{ dataObj?.receiver }}

        .flex.ml-10
            span.mr-5 net: 
            strong.text-gray-333 {{ dataObj?.unstake_net_quantity }}

        .flex.ml-10
            span.mr-5 cpu: 
            strong.text-gray-333 {{ dataObj?.unstake_cpu_quantity }}

    .flex(v-if="data?.name === 'newaccount'")
        .flex.ml-10
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.creator') {{ dataObj?.creator }}
            i.fas.fa-long-arrow-right

        .flex.ml-10
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.name') {{ dataObj?.name }}

    .flex(v-if="data?.name === 'buyrambytes'")
        .flex.ml-10
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.payer') {{ dataObj?.payer }}
            i.fas.fa-long-arrow-right

        .flex.ml-10
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.receiver') {{ dataObj?.receiver }}

        .flex.ml-10
            strong.text-gray-333 {{ (dataObj?.bytes / 1024).toLocaleString() }} kb

    .flex(v-if="data?.name === 'voteproducer'")
        .flex.ml-10
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.voter') {{ dataObj?.voter }}
            i.fas.fa-long-arrow-right

        .flex.ml-10
            strong.text-gray-333
                a.text-green(:href='"/account/" + dataObj?.proxy') {{ dataObj?.proxy }}

        .flex.ml-10
            span.mr-5 producers: 
            strong.text-gray-333
                a.text-green.producer-link(v-for="(prod, index) in dataObj?.producers" :key="index" :href='"/account/" + prod') {{ prod }}

    .dialog(v-if="dialogVisible")
        .dialog-zhan
        .dialog-content
            h1 Data 
                i.el-icon-close.text-gray-ca.mr-1.cursor-pointer(@click="dialogVisible = false")
            JsonViewer(:value='dialogResult', sort, :expand-depth=5)

</template>

<script lang="ts">
// @ts-ignore
import JsonViewer from 'vue-json-viewer';

import { defineComponent, computed, toRefs, reactive } from 'vue';
// import { Dialog } from 'element-ui';
export default defineComponent({
    components: { JsonViewer },
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
        length: {
            type: Number,
            default: 50,
        },
    },
    setup(props) {
        const dataString = computed(() => (props.data ? JSON.stringify(props.data) : ''));
        const dataObj: any = computed(() => (props.data ? props.data.data : ''));
        const state = reactive({
            dialogResult: null,
            dialogVisible: false,
        });

        const openDialog = data => {
            let result = data;
            let json = false;
            if (data.indexOf('{') >= 0 && data.indexOf('}') >= 0) {
                result = JSON.parse(data);
                json = true;
            }

            console.log(json);
            state.dialogResult = result;
            state.dialogVisible = true;

            // this.dialog.open(DialogDataMemo, {
            //     data: {
            //         result: result,
            //         json: json,
            //     },
            // });
        };
        const handleClose = done => done();
        return {
            ...toRefs(props),
            ...toRefs(state),
            dataString,
            dataObj,
            handleClose,
            openDialog,
        };
    },
});
</script>

<style lang="scss" scoped>
.actions-list-view::first-child {
    margin-left: 0px;
}

.memo-data {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 120px !important;
    display: block !important;
    cursor: pointer;
    float: left;
}
.memo-data-action {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 500px !important;
    display: block !important;
    cursor: pointer;
    float: left;
}
.memo-less-then-length {
    width: auto !important;
}
.icon-memo-open {
    cursor: pointer;
    font-weight: bold;
    display: block;
}
.producer-link {
    margin-left: 5px;
    display: table;
}
.fa-long-arrow-right:before {
    content: '\f178';
    position: relative;
    top: 4px;
    left: 19px;
}

.dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    &-zhan {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.288);
    }
    &-content {
        max-width: 50%;
        min-height: 100px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        border-radius: 10px;
        padding: 10px;
        h1 {
            text-indent: 10px;
            margin-top: 10px;
            font-size: 20px;
            font-weight: 600;
            i {
                float: right;
                font-size: 26px;
                position: relative;
                top: -5px;
            }
        }
    }
}
</style>
