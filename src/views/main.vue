<template>
    <div
        class="site-wrapper"
        :class="{ 'site-sidebar--fold': sidebarFold }"
        element-loading-text="拼命加载中"
    >
        <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
            <div class="site-navbar__header">
                <h1 class="site-navbar__brand">
                    
                    <a class="site-navbar__brand-lg">签证管理系统</a>
                    <a class="site-navbar__brand-mini">VISA</a>
                </h1>
            </div>
            <div class="site-navbar__body clearfix">
                <el-menu class="site-navbar__menu" mode="horizontal">
                    <el-menu-item class="site-navbar__switch" index="0" @click="handleSwitch">
                        <SvgIcon name="zhedie" class="icon-svg" />
                    </el-menu-item>
                </el-menu>
                <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
                    <el-menu-item index="1" class="site-navbar__switch">
                        <template #title>
                            <el-badge value="0"><SvgIcon name="duanxin" class="icon-svg duanxin-svg" /></el-badge>
                        </template>
                    </el-menu-item>
                    <el-menu-item class="site-navbar__avatar" index="3">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <img :src="photo" />
                                {{ name }}
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="updatePasswordHandle()">修改密码</el-dropdown-item>
                                    <el-dropdown-item @click="logout">退出</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </el-menu-item>
                </el-menu>
            </div>
            <update-password v-if="updatePasswordVisible" ref="updatePassword"></update-password>
        </nav>
        <aside class="site-sidebar site-sidebar--dark">
            <div class="site-sidebar__inner">
                <el-menu
                    :default-active="menuActiveName || 'home'"
                    :collapse="sidebarFold"
                    :collapseTransition="false"
                    class="site-sidebar__menu"
                >
                    <el-menu-item index="home" @click="$router.push({ name: 'Home' })">
                        <SvgIcon name="home" class="icon-svg" />
                        <span slot="title">首页</span>
                    </el-menu-item>
                 <!--  <el-menu-item index="teamAppointment" @click="$router.push({ name: 'orderPage' })"    v-if="isAuth(['ROOT', 'ORDER:SELECT'])">
                    <SvgIcon name="log" class="icon-svg" />
                    <span slot="title">订单管理</span>
                  </el-menu-item> -->
                    <el-menu-item index="teamAppointment" @click="$router.push({ name: 'customerPage' })"  v-if="isAuth(['ROOT', 'MEMBER:SELECT'])">
                        <SvgIcon name="admin" class="icon-svg" />
                        <span slot="title">客户管理</span>
                    </el-menu-item>
                    <el-menu-item index="teamAppointment" @click="$router.push({ name: 'companyPage' })"  v-if="isAuth(['ROOT', 'MEMBER:SELECT'])">
                        <SvgIcon name="admin" class="icon-svg" />
                        <span slot="title">公司管理</span>
                    </el-menu-item>
                    <el-menu-item index="teamAppointment" @click="$router.push({ name: 'memberPage' })"  v-if="isAuth(['ROOT', 'MEMBER:SELECT'])">
                        <SvgIcon name="admin" class="icon-svg" />
                        <span slot="title">展会管理</span>
                    </el-menu-item>
                 <!--  <el-menu-item index="teamAppointment" @click="$router.push({ name: 'storePage' })" v-if="isAuth(['ROOT', 'STORE:SELECT'])">
                    <SvgIcon name="company_fill" class="icon-svg" />
                    <span slot="title">门店管理</span>
                  </el-menu-item> -->
                 <!--  <el-menu-item index="teamAppointment" @click="$router.push({ name: 'cardPage' })" v-if="isAuth(['ROOT', 'PREPAID_CARD:SELECT'])">
                    <SvgIcon name="card" class="icon-svg" />
                    <span slot="title">储值卡管理</span>
                  </el-menu-item> -->
                 <!--  <el-submenu index="数据报表" v-if="isAuth(['ROOT', 'REPORT:SELECT'])">
                    <template #title>
                      <SvgIcon name="tubiao"   class="icon-svg"/>
                      <span slot="title">数据报表</span>
                    </template>
                    <el-menu-item index="门店交易记录" @click="$router.push({ name: 'storeTransaction' })">
                      <SvgIcon name="tubiao" class="icon-svg" />
                      <span slot="title">门店交易记录</span>
                    </el-menu-item>
                    <el-menu-item index="会员卡信息中心" @click="$router.push({ name: 'cardInfo' })">
                      <SvgIcon name="tubiao" class="icon-svg" />
                      <span slot="title">会员卡信息中心</span>
                    </el-menu-item>
                  </el-submenu> -->
                  <el-submenu index="系统配置">
                    <template #title>
                      <SvgIcon name="system"   class="icon-svg"/>
                      <span slot="title">系统配置</span>
                    </template>
                    <el-menu-item index="角色管理" @click="$router.push({ name: 'rolePage' })" v-if="isAuth(['ROOT', 'ROLE:SELECT'])">
                      <SvgIcon name="tool_fill" class="icon-svg" />
                      <span slot="title">角色管理</span>
                    </el-menu-item>
                    <el-menu-item index="用户管理" @click="$router.push({ name: 'userPage' })" v-if="isAuth(['ROOT', 'USER:SELECT'])">
                      <SvgIcon name="users_fill" class="icon-svg" />
                      <span slot="title">用户管理</span>
                    </el-menu-item>
                  </el-submenu>
                </el-menu>
            </div>
        </aside>
        <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
            <main class="site-content" :class="{ 'site-content--tabs': $route.meta.isTab }">
                <el-tabs
                    v-if="$route.meta.isTab"
                    v-model="mainTabsActiveName"
                    :closable="true"
                    @tab-click="selectedTabHandle"
                    @tab-remove="removeTabHandle"
                >
                    <el-dropdown class="site-tabs__tools" trigger="click">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                        <template #dropdown>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="tabsCloseCurrentHandle">
                                    关闭当前标签页
                                </el-dropdown-item>
                                <el-dropdown-item @click.native="tabsCloseOtherHandle">关闭其它标签页</el-dropdown-item>
                                <el-dropdown-item @click.native="tabsCloseAllHandle">关闭全部标签页</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-tab-pane v-for="item in mainTabs" :label="item.title" :name="item.name">

                    </el-tab-pane>
                  <el-card :body-style="siteContentViewHeight">
                    <router-view v-slot="{ Component }"   >
                      <keep-alive>
                        <component :is="Component" />
                      </keep-alive>
                    </router-view>
                  </el-card>
                </el-tabs>
                <!-- 主入口标签页 e -->
                <el-card v-else :body-style="siteContentViewHeight"><router-view /></el-card>
            </main>
        </div>
    </div>
</template>

<script>
import SvgIcon from '../components/SvgIcon.vue';
import { isURL } from '../utils/validate';
import UpdatePassword from './update-password.vue';
import { ref, provide } from 'vue';
export default {
    components: { SvgIcon, UpdatePassword },
    data: function() {
        return {
            navbarLayoutType: '',
            sidebarFold: false,
            sidebarLayoutSkin: 'dark',
            name: '',
            photo: '',
            documentClientHeight: 0,
            siteContentViewHeight: {},
            height: null,
            mainTabs: [],
            mainTabsActiveName: '',
            menuActiveName: '',
            updatePasswordVisible: false
        };
    },
    created() {
        let that = this;
        that.routeHandle(that.$route);

    },
    watch: {
        $route: {
            handler(to, from) {
                if (to.path != from.path) {
                    // this.$router.push(to);
                    this.routeHandle(to);
                }
            }
        }
    },
    methods: {
        handleSwitch: function() {
            if (this.sidebarFold) {
                this.navbarLayoutType = '';
            } else {
                this.navbarLayoutType = 'fold';
            }
            this.sidebarFold = !this.sidebarFold;
        },
        resetDocumentClientHeight: function() {
            this.documentClientHeight = document.documentElement['clientHeight'];
            window.onresize = () => {
                this.documentClientHeight = document.documentElement['clientHeight'];
                this.loadSiteContentViewHeight();
            };
        },
        loadSiteContentViewHeight: function() {
            let height = this.documentClientHeight - 50 - 30 - 2;
            if (this.$route.meta.isTab) {
                height -= 40;
                this.siteContentViewHeight = isURL(this.$route.meta.iframeUrl)
                    ? { height: height + 'px' }
                    : { minHeight: height + 'px' };
                this.height = provide('height', { height: height - 40 + 'px' });
            }
            this.siteContentViewHeight = { minHeight: height + 'px' };
        },
        routeHandle: function(route) {
            //每次切换页面，重新计算页面高度和内容区高度
            this.resetDocumentClientHeight();
            this.loadSiteContentViewHeight();

            if (route.meta.isTab) {
                // tab选中, 不存在先添加
                var tab = this.mainTabs.filter(item => item.name === route.name)[0];
                if (!tab) {
                    if (route.meta.isDynamic) {
                        route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0];

                        if (!route) {
                            return console.error('未能找到可用标签页!');
                        }
                    }
                    tab = {
                        menuId: route.meta.menuId || route.name,
                        name: route.name,
                        title: route.meta.title,
                        type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
                        iframeUrl: route.meta.iframeUrl || '',
                        params: route.params,
                        query: route.query
                    };
                    this.mainTabs = this.mainTabs.concat(tab);
                }
                this.menuActiveName = tab.menuId + '';
                this.mainTabsActiveName = tab.name;
            }
        },
        logout: function() {
            let that = this;
          that.$http('logout', 'POST', null, true, function (resp) {
            localStorage.removeItem('permissions');
            localStorage.removeItem('token');
            that.$router.push({ name: 'Login' });
          });


        },
        updatePasswordHandle: function() {
            this.updatePasswordVisible = true;
            this.$nextTick(() => {
                this.$refs.updatePassword.init();
            });
        },
        selectedTabHandle: function(tab, e) {
            tab = this.mainTabs.filter(item => item.name === tab.paneName);
            if (tab.length >= 1) {
                this.$router.push({
                    name: tab[0].name,
                    query: tab[0].query,
                    params: tab[0].params
                });
            }
        },
        removeTabHandle: function(tabName) {
            this.mainTabs = this.mainTabs.filter(item => item.name !== tabName);
            if (this.mainTabs.length >= 1) {
                // 当前选中tab被删除
                if (tabName === this.mainTabsActiveName) {
                    var tab = this.mainTabs[this.mainTabs.length - 1];
                    this.$router.push({ name: tab.name, query: tab.query, params: tab.params }, () => {
                        this.mainTabsActiveName = this.$route.name;
                    });
                }
            } else {
                this.menuActiveName = '';
                this.$router.push({ name: 'Home' });
            }
        },
        // tabs, 关闭当前
        tabsCloseCurrentHandle: function() {
            this.removeTabHandle(this.mainTabsActiveName);
        },
        // tabs, 关闭其它
        tabsCloseOtherHandle: function() {
            this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName);
        },
        // tabs, 关闭全部
        tabsCloseAllHandle: function() {
            this.mainTabs = [];
            this.menuActiveName = '';
            this.$router.push({ name: 'Home' });
        }
    },
    mounted: function() {
        let that = this;
        //加载用户数据
        that.$http('loadUserInfo', 'GET', null, true, function(resp) {
            let json = resp;
            let name = json.name;
            let photo = json.photo;
            that.name = name;
            that.photo = photo;
        });
        that.resetDocumentClientHeight();
        that.loadSiteContentViewHeight();
    }
};
</script>

<style lang="scss">
@import '../assets/scss/index.scss';
</style>
