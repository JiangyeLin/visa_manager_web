<template>
  <div>
    <el-button @click="exportToExcel">导出</el-button>
<!--    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >-->
<!--      <el-form-item >-->
<!--        <el-input v-model="dataForm.name" placeholder="单据时间" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item >-->
<!--        <el-input v-model="dataForm.cardNumber" placeholder="卡号" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item >-->
<!--        <el-input v-model="dataForm.store" placeholder="交易门店" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item >-->
<!--        <el-input v-model="dataForm.cashier" placeholder="收银员" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item >-->
<!--        <el-select v-model="dataForm.cardType" class="input" placeholder="卡片类型" size="medium" clearable>-->
<!--          <el-option label="实体卡" value="true" />-->
<!--          <el-option label="虚拟卡" value="false" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item >-->
<!--        <el-select-->
<!--            v-model="dataForm.orderField"-->
<!--            placeholder="排序字段"-->
<!--            size="large"-->
<!--            style="width: 100%"-->
<!--            @change="searchHandle()"-->
<!--            clearable-->
<!--        >-->
<!--          <el-option-->
<!--              key="amount"-->
<!--              label="金额"-->
<!--              value="amount"-->
<!--          />-->
<!--          <el-option-->
<!--              key="createTime"-->
<!--              label="订单时间"-->
<!--              value="createTime"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item >-->
<!--        <el-select-->
<!--            v-model="dataForm.order"-->
<!--            placeholder="排序方式"-->
<!--            size="large"-->
<!--            style="width: 100%"-->
<!--            @change="searchHandle()"-->
<!--            clearable-->
<!--        >-->
<!--          <el-option-->
<!--              key="asc"-->
<!--              label="升序"-->
<!--              value="asc"-->
<!--          />-->
<!--          <el-option-->
<!--              key="desc"-->
<!--              label="降序"-->
<!--              value="desc"-->
<!--          />-->

<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button size="medium" type="primary" @click="searchHandle()">查询</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--    <el-table-->
<!--        :data="dataList"-->
<!--        border-->
<!--        v-loading="dataListLoading"-->
<!--        :cell-style="{ padding: '4px 0'  }"-->
<!--        size="medium"-->
<!--        style="width: 100%;"-->
<!--    >-->
<!--      <el-table-column-->
<!--          type="selection"-->
<!--          header-align="center"-->
<!--          align="center"-->
<!--          width="50"-->
<!--      />-->
<!--      <el-table-column prop="id" header-align="center" align="center" label="序号" min-width="100" fixed />-->
<!--      <el-table-column prop="name" header-align="center" align="center" label="日期" min-width="170" />-->
<!--      <el-table-column prop="address" header-align="center" align="center" label="充值卡号"   min-width="170" />-->
<!--      <el-table-column prop="principalName" header-align="center" align="center" label="单据时间" min-width="170" />-->
<!--      <el-table-column prop="bindCode" header-align="center" align="center" label="单据编号" min-width="170" />-->
<!--      <el-table-column prop="bindCode" header-align="center" align="center" label="销售金额" min-width="170" />-->
<!--      <el-table-column prop="bindCode" header-align="center" align="center" label="充值金额" min-width="170" />-->
<!--      <el-table-column prop="bindCode" header-align="center" align="center" label="实付金额" min-width="170" />-->
<!--      <el-table-column prop="bindCode" header-align="center" align="center" label="交易门店" min-width="170" />-->
<!--      <el-table-column prop="bindCode" header-align="center" align="center" label="收银员" min-width="170" />-->
<!--      <el-table-column prop="bindCode" header-align="center" align="center" label="卡片类型" min-width="170" />-->
<!--    </el-table>-->
<!--    <el-pagination-->
<!--        @size-change="sizeChangeHandle"-->
<!--        @current-change="currentChangeHandle"-->
<!--        :current-page="pageIndex"-->
<!--        :page-sizes="[10, 20, 50]"-->
<!--        :page-size="pageSize"-->
<!--        :total="totalCount"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--    ></el-pagination>-->
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default {
  data: function() {
    return {
      dataForm: {
        order:null,
        orderField:null,
        cardNumber:null,
        store:null,
        cashier:null,
        cardType:null
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
        name: that.dataForm.name,
        address: that.dataForm.address,
        page: that.pageIndex,
        size: that.pageSize,
        orderField: that.dataForm.orderField,
        order: that.dataForm.order
      };
      that.$http('admin/report/storeTransactionRecord', 'GET', data, true, function (resp) {
        that.dataList = resp;
        // that.totalCount = resp.total;
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
    exportToExcel() {


      let tableData = [['序号','日期','充值卡号','单据时间','单据编号','销售金额','充值金额','实付金额','交易门店','收银员','卡片类型']];
      this.dataList.forEach(item => {
        let rowData = [
          item.id,
          item.date,
          item.cardNumber,
          item.createTime,
          item.orderNo,
          item.consumptionAmount,
          item.rechargeAmount,
          item.actualPayAmount,
          item.storeName,
          item.userName,
          item.cardType,
          item.status
        ];
        tableData.push(rowData);
      })
      // 2. 将数据转换为工作表
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);

      // 3. 创建工作簿并添加工作表
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "门店交易记录");

      // 4. 将工作簿导出为二进制数据
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // 5. 使用 file-saver 保存文件
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, "门店交易记录.xlsx");
    },
  },
  mounted() {
    this.loadDataList();
  }

};
</script>

<style></style>
