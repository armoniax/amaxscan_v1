import { createStore } from 'vuex';

export default createStore({
    devtools: true,
    state: {
        producer: '',
        mainDataRAM: {},
    },
    actions: {
        changeMessage({ commit }, producer) {
            commit('CHANGE_MESSAGE', producer);
        },
    },
    mutations: {
        CHANGE_MESSAGE(state, producer: string) {
            state.producer = producer;
        },
    },
});
