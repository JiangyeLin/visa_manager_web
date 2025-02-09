import {
	createRouter,
	createWebHashHistory
}
from 'vue-router'
import Login from '../views/login.vue'
import Main from "../views/main.vue"
import Home from "../views/home.vue"
import memberPage from "../views/memberPage/index.vue"
import companyPage from "../views/companyPage/index.vue"
import orderPage from "../views/orderPage/index.vue";
import storePage from "../views/storePage/index.vue";
import cardPage from "../views/cardPage/index.vue";
import storeTransaction from "../views/storeTransaction/index.vue";
import cardInfo from "../views/cardInfo/index.vue";
import NotFound from "../views/404.vue"
import userPage from "../views/userPage/index.vue";
import rolePage from "../views/rolePage/index.vue";

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
				}
			},
			{
				path: '/memberPage',
				name: 'memberPage',
				component: memberPage,
				meta: {
					title: '客户管理',
					isTab: true
				}
			},
			{
				path: '/companyPage',
				name: 'companyPage',
				component: companyPage,
				meta: {
					title: '公司管理',
					isTab: true
				}
			},
			{
				path: '/storePage',
				name: 'storePage',
				component: storePage,
				meta: {
					title: '门店管理',
					isTab: true
				}
			},
			{
				path: '/cardPage',
				name: 'cardPage',
				component: cardPage,
				meta: {
					title: '储值卡管理',
					isTab: true
				}
			},
			{
				path: '/storeTransaction',
				name: 'storeTransaction',
				component: storeTransaction,
				meta: {
					title: '门店交易记录',
					isTab: true
				}
			},
			{
				path: '/cardInfo',
				name: 'cardInfo',
				component: cardInfo,
				meta: {
					title: '会员卡信息中心',
					isTab: true
				}
			},
			{
				path: '/userPage',
				name: 'userPage',
				component: userPage,
				meta: {
					title: '用户管理',
					isTab: true
				}
			},
			{
				path: '/rolePage',
				name: 'rolePage',
				component: rolePage,
				meta: {
					title: '角色管理',
					isTab: true
				}
			},


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
