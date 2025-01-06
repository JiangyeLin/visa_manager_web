<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >
      <el-form-item >
        <el-input v-model="dataForm.name" placeholder="店名" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="dataForm.address" placeholder="地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="searchHandle()">查询</el-button>
        <el-button size="medium" type="success" @click="addOrUpdate()"   :disabled="!isAuth(['ROOT', 'STORE:INSERT'])">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :cell-style="{ padding: '4px 0'  }"
        size="medium"
        style="width: 100%;"
    >
      <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
      />
      <el-table-column prop="name" header-align="center" align="center" label="门店" min-width="130" />
      <el-table-column prop="address" header-align="center" align="center" label="地址"   min-width="220" />
      <el-table-column prop="longitude" header-align="center" align="center" label="经度" min-width="100" />
      <el-table-column prop="latitude" header-align="center" align="center" label="纬度" min-width="100" />
      <el-table-column prop="principalName" header-align="center" align="center" label="负责人" min-width="100" />
      <el-table-column prop="bindCode" header-align="center" align="center" label="绑定码" min-width="100" />
<!--      <el-table-column header-align="center" align="center" min-width="150" label="操作">-->
<!--        <template #default="scope">-->
<!--          <el-button-->
<!--              type="text"-->
<!--              size="medium"-->
<!--              @click="addOrUpdate(scope.row.id)"-->
<!--          >-->
<!--            更新-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间" min-width="170" />
      <el-table-column prop="updateTime" header-align="center" align="center" label="更新时间" min-width="170" />-->
    </el-table>
    <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <store-add-or-update v-if="addOrUpdateVisible" ref="storeAddOrUpdate" @refreshDataList="loadDataList"></store-add-or-update>
  </div>
</template>

<script>
import storeAddOrUpdate from "./store-add-or-update.vue";
import {convertToChinaTime} from "../../utils";
export default {
  components:{
    storeAddOrUpdate
  },
  data: function() {
    return {
      dataForm: {
        order:null,
        orderField:null,
        name:null,
        address:null,
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      dataRule: {},
      addOrUpdateVisible:false,
    };
  },
  methods: {
    addOrUpdate(id){
      this.addOrUpdateVisible=true
      this.$nextTick(() => {
        this.$refs.storeAddOrUpdate.init(id);
      });
    },
    loadDataList: function () {
      let that = this;
      that.dataListLoading = true;
      let data = {
        name: that.dataForm.name,
        address: that.dataForm.address,
        page: that.pageIndex,
        size: that.pageSize,
        orderField: that.dataForm.orderField,
        order: that.dataForm.order
      };
      that.$http('admin/store/page', 'POST', data, true, function (resp) {
        that.dataList=resp.records.map(item => {
          return {
            ...item, // 保留其他属性
            createTime:  convertToChinaTime(item.createTime) ,// 转换时间
            updateTime:  convertToChinaTime(item.updateTime) // 转换时间
          };
        })
        that.totalCount = resp.total;
        that.dataListLoading = false;
      });
    },
    searchHandle: function () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$refs['dataForm'].clearValidate();
          if (this.pageIndex !== 1) {
            this.pageIndex = 1;
          }
          this.loadDataList();
        } else {
          return false;
        }
      });
    },
    sizeChangeHandle: function (val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.loadDataList();
    },
    currentChangeHandle: function (val) {
      this.pageIndex = val;
      this.loadDataList();
    },
  },
  mounted() {
    this.loadDataList();
  }

};
</script>

<style></style>
