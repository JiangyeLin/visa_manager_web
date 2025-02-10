<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >
      <el-form-item >
        <el-input v-model="dataForm.keyword" placeholder="请输入要查询的关键字" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="searchHandle()">查询</el-button>
        <el-button size="medium" type="success" @click="addOrUpdate()"   :disabled="!isAuth(['ROOT', 'STORE:INSERT'])">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        stripe 
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
      <!-- <el-table-column prop="id" header-align="center" align="center" label="用户ID" min-width="200" fixed /> -->
      <el-table-column prop="familyName,givenName" header-align="center" align="center" label="中文名" min-width="170" fixed>
        <template v-slot="scope">
	          {{scope.row.familyName}} {{scope.row.givenName}}
	      </template>
      </el-table-column>
      
      <el-table-column prop="familyName" header-align="center" align="center" label="姓" min-width="100" />
      <el-table-column prop="givenName"  header-align="center" align="center" label="名" min-width="100" />
      <el-table-column prop="gender" header-align="center" align="center" label="性别" min-width="50" />
      <el-table-column prop="phoneNumber" header-align="center" align="center" label="手机号" min-width="170"/>
      <el-table-column prop="passportNumber" header-align="center" align="center" label="护照编号" min-width="100" />
      <el-table-column prop="passportValidity" header-align="center" align="center" label="护照有效期至" min-width="100" />
      <el-table-column prop="birthDate" header-align="center" align="center" label="出生日期" min-width="100" />
    </el-table>
    <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[20, 50, 100]"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>

    <store-add-or-update v-if="addOrUpdateVisible" ref="storeAddOrUpdate" @refreshDataList="loadDataList"></store-add-or-update>
  </div>
</template>

<script>
import { formatDateTime } from '../../utils';
import storeAddOrUpdate from "../storePage/store-add-or-update.vue";
export default {
  components:{
    storeAddOrUpdate
  },
  data: function() {
    return {
      dataForm: {
        order:null,
        orderField:null,
        keyword:null
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      dataListLoading: false,
      dataRule: {},
      addOrUpdateVisible:false
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
        keyword: that.dataForm.keyword,
        phoneNumber: that.dataForm.phoneNumber,
        page: that.pageIndex,
        size: that.pageSize,
        orderField: that.dataForm.orderField,
        order: that.dataForm.order
      };
      that.$http('customer/list', 'POST', data, true, function (resp) {
        that.dataList=resp.records.map(item=>{
            return {
              ...item, //保留其他属性
              birthDate:formatDateTime(item.birthDate),
              passportValidity:formatDateTime(item.passportValidity),
            }
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
