<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >
      <el-form-item >
        <el-input v-model="dataForm.number" placeholder="卡号" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="medium" type="primary" @click="searchHandle()">查询</el-button>
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
      <el-table-column prop="id" header-align="center" align="center" label="ID" min-width="100"  />
      <el-table-column prop="number" header-align="center" align="center" label="卡号" min-width="170" />
      <el-table-column prop="secret" header-align="center" align="center" label="秘钥"   min-width="170"/>
      <el-table-column prop="balance" header-align="center" align="center" label="余额" min-width="170" >
        <template #default="scope" >
          <span style="text-align: center"> {{(+scope.row.balance).toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="effectiveDate" header-align="center" align="center" label="生效日期" min-width="170" />
      <el-table-column prop="expirationDate" header-align="center" align="center" label="过期时间" min-width="170" />
      <el-table-column prop="status" header-align="center" align="center" label="状态" min-width="170" />
      <el-table-column prop="type" header-align="center" align="center" label="类型" min-width="170" />
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
  </div>
</template>

<script>
import {convertToChinaTime} from "../../utils";

export default {
  data: function() {
    return {
      dataForm: {
        order:null,
        orderField:null,
        number:null
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      dataRule: {}
    };
  },
  methods: {
    loadDataList: function () {
      let that = this;
      that.dataListLoading = true;
      let data = {
        number:that.dataForm.number,
        page: that.pageIndex,
        size: that.pageSize,
        orderField: that.dataForm.orderField,
        order: that.dataForm.order
      };
      that.$http('admin/prepaidCard/page', 'POST', data, true, function (resp) {
        that.dataList=resp.records.map(item => {
          return {
            ...item, // 保留其他属性
            effectiveDate:  convertToChinaTime(item.effectiveDate) ,// 转换时间
            expirationDate:  convertToChinaTime(item.expirationDate) // 转换时间
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
