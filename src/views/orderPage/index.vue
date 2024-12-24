<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >
      <el-form-item >
        <el-input v-model="dataForm.orderNo" placeholder="订单号" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="dataForm.userName" placeholder="操作员" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="dataForm.remarks" placeholder="备注" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
            @change="dateChange"
            v-model="dataForm.date"
            type="datetimerange"
            value-format="yyyy-MM-dd"
            range-separator="——"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="日期选择"
            unlink-panels
        />
      </el-form-item>
      <el-form-item >
        <el-select
            v-model="dataForm.orderField"
            placeholder="排序字段"
            size="large"
            style="width: 100%"
            @change="searchHandle()"
            clearable
        >
          <el-option
              key="amount"
              label="金额"
              value="amount"
          />
          <el-option
              key="createTime"
              label="订单时间"
              value="createTime"
          />
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-select
            v-model="dataForm.order"
            placeholder="排序方式"
            size="large"
            style="width: 100%"
            @change="searchHandle()"
            clearable
        >
          <el-option
              key="asc"
              label="升序"
              value="asc"
          />
          <el-option
              key="desc"
              label="降序"
              value="desc"
          />

        </el-select>
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
      <el-table-column prop="orderNo" header-align="center" align="center" label="订单号" min-width="170" fixed/>
      <el-table-column prop="amount" label="订单金额" >
        <template #default="scope" >
          <span style="text-align: center"> {{(+scope.row.amount).toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间" min-width="250" />
      <el-table-column prop="memberPhone" header-align="center" align="center" label="手机号"  min-width="170" />
      <el-table-column prop="storeName" header-align="center" align="center" label="门店"  min-width="170" />
      <el-table-column prop="userName" header-align="center" align="center" label="操作员" min-width="120" />
      <el-table-column prop="remarks" header-align="center" align="center" label="备注" min-width="270" />
      <el-table-column  label="状态" align="center" >
        <template #default="scope" >
          <el-tag
              effect="light"  v-if="scope.row.status"
              :type="scope.row.status==='已支付'? 'primary':'info' "
          >
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="120" label="操作">
        <template #default="scope">
          <el-button
              type="text"
              size="medium"
              v-if="scope.row.status==='已支付'"
              @click="handleRefund(scope.row.id)"
          >
            退款
          </el-button>
        </template>
      </el-table-column>
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
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  data: function() {
    return {
      dataForm: {
        order:null,
        orderField:null,
        orderNo:null,
        memberPhone:null,
        remarks:null,
        userName:null,
        date:null,
        startTime: null,
        endTime: null,
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
        orderNo: that.dataForm.orderNo,
        memberPhone:that.dataForm.memberPhone,
        remarks:that.dataForm.remarks,
        userName:that.dataForm.userName,
        page: that.pageIndex,
        size: that.pageSize,
        orderField: that.dataForm.orderField,
        order: that.dataForm.order,
        startTime: that.dataForm.startTime,
        endTime: that.dataForm.endTime,
      };
      that.$http('admin/order/page', 'POST', data, true, function (resp) {
        that.dataList = resp.records;
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
    dateChange(date){
      if(Array.isArray(date) && date.length > 0){
        this.dataForm.startTime=date[0];
        this.dataForm.endTime=date[1]
      }
      else{
        this.dataForm.startTime=null;
        this.dataForm.endTime=null;
      }
    },
    handleRefund(id){
      let that=this
      ElMessageBox.alert(
          '确认退款？',
          {
            showCancelButton:true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            // showInput:true,
            // inputPlaceholder:'审核码',
            // inputErrorMessage: '无效审核码',
            // inputValidator: (value) => {
            //   if (!value) {
            //     return '审核码不能为空！'; // 返回错误提示
            //   }}
          })
          .then(({ value }) => {
            let data={
              orderId:id,
              examineCode:'QSXCFT',
              storeId:0
            }
            this.$http('admin/order/refund', 'POST', data, true, function (resp) {
              ElMessage.success('退款成功')
              that.loadDataList()
            });

          }).catch(() => {})
    },
  },
  mounted() {
    this.loadDataList();
  }

};
</script>

<style></style>
