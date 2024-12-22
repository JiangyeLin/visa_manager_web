import {
	createRouter,
	createWebHashHistory
}
from 'vue-router'
import Login from '../views/login.vue'
import Main from "../views/main.vue"
import Home from "../views/home.vue"
import memberPage from "../views/memberPage/index.vue"
import orderPage from "../views/orderPage/index.vue";
import storePage from "../views/storePage/index.vue";
import NotFound from "../views/404.vue"


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
					title: '会员管理',
					isTab: true
				}
			},
			{
				path: '/orderPage',
				name: 'orderPage',
				component: orderPage,
				meta: {
					title: '订单管理',
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
