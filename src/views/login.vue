<template>
    <div class="page">
        <el-row type="flex" justify="center" align="middle" class="container">
            <el-col :lg="14" :xl="7" class="hidden-md-and-down">
                <el-row class="panel">
                    <el-col :span="22">
                        <div class="right">
                            <div class="title-container">
                                <h2>医药后台管理系统</h2>
                                <span>( Ver 1.0 )</span>
                            </div>
                            <div v-if="!qrCodeVisible">
                                <div class="row">
                                    <el-input
                                        v-model="username"
                                        placeholder="用户名"
                                        prefix-icon="el-icon-user"
                                        clearable
                                    ></el-input>
                                </div>
                                <div class="row">
                                    <el-input
                                        type="password"
                                        v-model="password"
                                        placeholder="密码"
                                        prefix-icon="el-icon-lock"
                                        clearable
                                    ></el-input>
                                </div>
                                <div class="row">
                                    <el-button type="primary" class="btn" @click="login">登陆系统</el-button>
                                </div>
                            </div>

                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { isUsername, isPassword } from '../utils/validate.js';
import router from '../router/index.js';
export default {
    data: function() {
        return {
            username: null,
            password: null,
            qrCodeVisible: false,
            downloadButton: false,
            qrCode: '',
            uuid: null,
            qrCodeTimer: null,
            loginTimer: null
        };
    },

    methods: {
        login: function() {
            let that = this;
            if (!isUsername(that.username)) {
                that.$message({
                    message: '用户名格式不正确',
                    type: 'error',
                    duration: 1200
                });
            } else if (!isPassword(that.password)) {
                that.$message({
                    message: '密码格式不正确',
                    type: 'error',
                    duration: 1200
                });
            } else {
                let data = { username: that.username, password: that.password };
                //发送登陆请求
                that.$http('login', 'POST', data, true, function(resp) {
                    if (resp) {
                      console.log( JSON.stringify(resp.pharmacies[0]))
                        //取出Token令牌，保存到storage中
                        let token = resp.token;
                        localStorage.setItem('token', token);
                        localStorage.setItem('permissions', JSON.stringify(resp.pharmacies[0]));
                        //让路由跳转页面，这里的Home是home.vue页面的名字
                        router.push({ name: 'Home' });

                    } else {
                        that.$message({
                            message: '登陆失败',
                            type: 'error',
                            duration: 1200
                        });
                    }

                });
            }
        },
    }
};
</script>

<style lang="less" scoped>
@import url('login.less');
</style>
