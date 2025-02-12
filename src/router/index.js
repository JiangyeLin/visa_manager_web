import {
	createRouter,
	createWebHashHistory
}
from 'vue-router'
import Login from '../views/login.vue'
import Main from "../views/main.vue"
import Home from "../views/home.vue"
<<<<<<< HEAD
import customerPage from "../views/customerPage/index.vue"
import companyPage from "../views/companyPage/index.vue"
import orderPage from "../views/orderPage/index.vue";
import storePage from "../views/storePage/index.vue";
import cardPage from "../views/cardPage/index.vue";
import storeTransaction from "../views/storeTransaction/index.vue";
import cardInfo from "../views/cardInfo/index.vue";
import NotFound from "../views/404.vue"
import userPage from "../views/userPage/index.vue";
import rolePage from "../views/rolePage/index.vue";
=======
import Role from "../views/role.vue"
import User from "../views/user.vue"
import Dept from "../views/dept.vue"
import MeetingRoom from '../views/meeting_room.vue'
import OfflineMeeting from "../views/offline_meeting.vue"
import OnlineMeeting from "../views/online_meeting.vue"
import MeetingVideo from "../views/meeting_video.vue"
import Approval from "../views/approval.vue"
import Leave from "../views/leave.vue"
import Amect from "../views/amect.vue"
import AmectType from "../views/amect_type.vue"
import AmectReport from "../views/amect_report.vue"
import Reim from "../views/reim.vue"
import NotFound from "../views/404.vue"

>>>>>>> 9ce7889 (init commit)

const routes = [{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/',
		name: 'Main',
		component: Main,
<<<<<<< HEAD
		children: [
			{
=======
		children: [{
>>>>>>> 9ce7889 (init commit)
				path: '/home',
				name: 'Home',
				component: Home,
				meta: {
					title: '首页',
				}
			},
			{
<<<<<<< HEAD
				path: '/customerPage',
				name: 'customerPage',
				component: customerPage,
				meta: {
					title: '客户管理',
=======
				path: "/role",
				name: "Role",
				component: Role,
				meta: {
					title: "角色管理",
>>>>>>> 9ce7889 (init commit)
					isTab: true
				}
			},
			{
<<<<<<< HEAD
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
=======
				path: '/user',
				name: 'User',
				component: User,
>>>>>>> 9ce7889 (init commit)
				meta: {
					title: '用户管理',
					isTab: true
				}
			},
			{
<<<<<<< HEAD
				path: '/rolePage',
				name: 'rolePage',
				component: rolePage,
				meta: {
					title: '角色管理',
					isTab: true
				}
			},


=======
				path: '/dept',
				name: 'Dept',
				component: Dept,
				meta: {
					title: '部门管理',
					isTab: true
				}
			},
			{
				path: '/meeting_room',
				name: 'MeetingRoom',
				component: MeetingRoom,
				meta: {
					title: '会议室',
					isTab: true
				}
			},
			{
				path: '/offline_meeting',
				name: 'OfflineMeeting',
				component: OfflineMeeting,
				meta: {
					title: '线下会议',
					isTab: true
				}
			},
			{
				path: '/online_meeting',
				name: 'OnlineMeeting',
				component: OnlineMeeting,
				meta: {
					title: '线上会议',
					isTab: true
				}
			},
			{
				path: '/meeting_video/:meetingId/:uuid',
				name: 'MeetingVideo',
				component: MeetingVideo,
				meta: {
					title: '视频会议',
					isTab: true
				}
			}, {
				path: '/approval',
				name: 'Approval',
				component: Approval,
				meta: {
					title: '在线审批',
					isTab: true
				}
			},
			{
				path: '/leave',
				name: 'Leave',
				component: Leave,
				meta: {
					title: '员工请假',
					isTab: true
				}
			},
			{
				path: '/amect',
				name: 'Amect',
				component: Amect,
				meta: {
					title: '违纪罚款',
					isTab: true
				}
			},
			{
				path: '/amect_type',
				name: 'AmectType',
				component: AmectType,
				meta: {
					title: '罚款类型',
					isTab: true
				}
			},
			{
				path: '/amect_report',
				name: 'AmectReport',
				component: AmectReport,
				meta: {
					title: '违纪报告',
					isTab: true
				}
			},
			{
				path: '/reim',
				name: 'Reim',
				component: Reim,
				meta: {
					title: '报销管理',
					isTab: true
				}
			}
>>>>>>> 9ce7889 (init commit)
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
<<<<<<< HEAD
		let token = localStorage.getItem("token")
		if (token == null || token == "") {
=======
		let permissions = localStorage.getItem("permissions")
		let token = localStorage.getItem("token")
		if (permissions == null || permissions == ""||token == null || token == "") {
>>>>>>> 9ce7889 (init commit)
			next({
				name: 'Login'
			})
		}
	}
	return next()
})

export default router
