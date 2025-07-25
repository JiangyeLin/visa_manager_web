import { createApp } from "vue";

import App from "./App.vue";

//导入Svg图片插件，可以在页面上显示Svg图片
import "vite-plugin-svg-icons/register";

//导入JQuery库，因为Ajax用起来非常方便，支持同步和异步的Ajax请求
import $ from "jquery";

const app = createApp(App); //创建VUE对象

//导入路由配置
import router from "./router";
app.use(router); //挂载路由插件

//导入ElementUI
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import locale from "element-plus/lib/locale/lang/zh-CN";

//导入ElementUI的消息通知组件，下面封装全局Ajax的时候处理异常的时候需要弹出通知
import { ElMessage } from "element-plus";

//挂载ElementUl-Plus插件
app.use(ElementPlus, {
  locale,
});

//导入echarts库
import * as echarts from "echarts";
app.config.globalProperties.$echarts = echarts; //设置全局变量$echarts

//后端项目的URL根路径
let baseUrl = "http://localhost:8383/"
//let baseUrl = "https://server.migao.life/";
//let baseUrl = 'http://visa.migao.life:8383/'	//正式环境

app.config.globalProperties.$baseUrl = baseUrl; //设置全局变量$baseUrl

//封装全局Ajax公共函数
app.config.globalProperties.$http = function (url, method, data, async, fun) {
  $.ajax({
    url: baseUrl + url,
    type: method,
    dataType: "json",
    contentType: "application/json",
    xhrFields: {
      withCredentials: true,
    },
    headers: {
      token: localStorage.getItem("token"),
    },
    async: async,
    data: method === "GET" ? data : JSON.stringify(data),
    success: function (resp) {
      if (resp.code == 200) {
        fun(resp.data);
      } else {
        if (resp.code == 10010) {
          localStorage.removeItem("token");
          router.push({ name: "Login" });
        }
        ElMessage.error({
          message: resp.msg,
          duration: 1200,
        });
      }
    },
    error: function (e) {
      if (e.status == undefined) {
        ElMessage.error({
          message: "前端页面错误",
          duration: 1200,
        });
      } else {
        let status = e.status;
        if (e.responseJSON?.code == 10010) {
          ElMessage.error({
            message: e.responseJSON.msg,
            duration: 1200,
          });
          localStorage.removeItem("token");
          router.push({ name: "Login" });
        }
        if (status == 401) {
          router.push({
            name: "Login",
          });
        } else {
          ElMessage.error({
            message: e.responseText,
            duration: 1200,
          });
        }
      }
    },
  });
};

//封装用于判断用户是否具有某些权限的公共函数
app.config.globalProperties.isAuth = function (permission) {
  let permissions = localStorage.getItem("permissions");
  let flag = false;
  for (let one of permission) {
    if (permissions.includes(one)) {
      flag = true;
      break;
    }
  }
  return flag;
};

app.mount("#app");
