<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >
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
      <el-table-column prop="orderNo" header-align="center" align="center" label="订单号" min-width="170" />
      <el-table-column prop="amount" header-align="center" align="center" label="订单金额" min-width="170" />
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间" min-width="270" />
      <el-table-column prop="memberPhone" header-align="center" align="center" label="手机号"  min-width="170" />
      <el-table-column prop="storeName" header-align="center" align="center" label="门店"  min-width="170" />
      <el-table-column prop="userName" header-align="center" align="center" label="操作员" min-width="170" />
      <el-table-column prop="remarks" header-align="center" align="center" label="备注" min-width="270" />
      <el-table-column prop="status" header-align="center" align="center" label="订单状态" min-width="270" />
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
export default {
  data: function() {
    return {
      dataForm: {
        order:null,
        orderField:null,
        nickName:null,
        phoneNumber:null,
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
        nickName: that.dataForm.nickName,
        phoneNumber: that.dataForm.phoneNumber,
        page: that.pageIndex,
        size: that.pageSize,
        orderField: that.dataForm.orderField,
        order: that.dataForm.order
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
  },
  mounted() {
    this.loadDataList();
  }

};
</script>

<style></style>
