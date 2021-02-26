import Vue from 'vue'
import Router from 'vue-router'

import Login from 'views/login/Login'

import Layout from '@/layout/index' 

Vue.use(Router)

const routes = [
    {
        path: '',
        redirect: '/login'
    }, 
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Layout,
        redirect: '/infolist',
        children: [
            {
                path: '/infolist',
                component: () => import('views/InfoList')
            },
            {
                path: '/controllist',
                component: () => import('views/ControlList')
            },
            {
                path: '/staffmanage',
                component: () => import('views/StaffManage')
            },
            {
                path: '/carsmanage',
                component: () => import('views/CarsManage')
            }
        ]
    }


]

const router = new Router({
    routes,
    mode: 'history'
})

export default router