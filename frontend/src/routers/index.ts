import Layout from '@/layout/index.vue';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),

    scrollBehavior(to, from, savedPosition) {
        return { top: 0 };
    },
    routes: [
        {
            path: '/',
            component: Layout,
            children: [
                {
                    path: '',
                    component: () => import('@/pages/index.vue'),
                },
            ],
        },
        {
            path: '/ram',
            component: Layout,
            children: [
                {
                    path: '',
                    component: () => import('@/pages/ram/index.vue'),
                },
            ],
        },
        {
            path: '/producers',
            component: Layout,
            children: [
                {
                    path: '',
                    component: () => import('@/pages/producers/index.vue'),
                },
                {
                    path: ':producer',
                    component: () => import('@/pages/producers/detail.vue'),
                },
            ],
        },
        {
            path: '/analytics',
            component: Layout,
            children: [
                {
                    path: '',
                    component: () => import('@/pages/analytics/index.vue'),
                },
            ],
        },
        {
            path: '/account/:account',
            component: Layout,
            children: [
                {
                    path: '',
                    component: () => import('@/pages/account/index.vue'),
                },
            ],
        },
    ],
});

export default router;
