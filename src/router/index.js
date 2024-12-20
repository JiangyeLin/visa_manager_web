import {
	createRouter,
	createWebHashHistory
}
from 'vue-router'
import Login from '../views/login.vue'
import Main from "../views/main.vue"
import Home from "../views/home.vue"

import User from "../views/user.vue"
import Dept from "../views/dept.vue"
import TeamAppointment from "../views/team_appointment.vue"
import PersonalAppointment from "../views/personal_appointment.vue"
import PageConf from "../views/page_conf.vue"
import BI from "../views/bi.vue"
import Session from "../views/session.vue"
import PersonalNotice from "../views/personal_notice.vue"
import TeamNotice from "../views/team_notice.vue"
import ReviewRecord from "../views/review_record.vue"
import NotFound from "../views/404.vue"
import storeInfo from "../views/storeInfo.vue";
import memberCard from "../views/memberCard.vue";
import { ComponentModel } from 'echarts'


const routes = [{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/',
		name: 'Main',
		component: Main,
		children: [
			{
				path: '/home',
				name: 'Home',
				component: Home,
				meta: {
					title: '首页',
					istab:true
				}
			},
			{
				path: '/teamappointment',
				name: 'TeamAppointment',
				component: TeamAppointment,
				meta: {
					title: '订单管理',
					isTab:true
				}
			},
			{
				path: '/personalappointment',
				name: 'PersonalAppointment',
				component: PersonalAppointment,
				meta: {
					title: '会员管理',
					isTab: true
				}
			},
			{
				path: '/session',
				name: 'Session',
				component: Session,
				meta: {
					title: '营销管理',
					isTab: true
				}
			},
			{
				path: '/memberCard',
				name: 'memberCard',
				component: memberCard,
				meta: {
					title: '储值卡管理',
					isTab: true
				}
			},
			{
				path: '/bi',
				name: 'BI',
				component: BI,
				meta: {
					title: '充值消费查询',
					isTab: true
				}
			},
			{
				path: '/storeInfo',
				name: 'storeInfo',
				component: storeInfo,
				meta: {
					title: '门店管理',
					isTab: true
				}
			},
			{
				path: '/teamNotice',
				name: 'TeamNotice',
				component: TeamNotice,
				meta: {
					title: '系统管理',
					isTab: true
				}
			},
			
			// {
			// 	path: '/pageconf',
			// 	name: 'PageConf',
			// 	component: PageConf,
			// 	meta: {
			// 		title: '系统配置',
			// 		isTab: true
			// 	}
			// },
			// {
			// 	path: '/reviewRecord',
			// 	name: 'ReviewRecord',
			// 	component: ReviewRecord,
			// 	meta: {
			// 		title: '评价记录',
			// 		isTab: true
			// 	}
			// },
		]
	},
	{
		path: "/404",
		name: "NotFound",
		component: NotFound
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: "/404"
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})
router.beforeEach((to, from, next) => {
	if (to.name != "Login") {
		let token = localStorage.getItem("token")
		if (token == null || token == "") {
			next({
				name: 'Login'
			})
		}
	}
	return next()
})

export default router
