<template>
  <div>

    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >
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
      <el-form-item>
<!--        <el-button size="medium" type="primary" @click="searchHandle()">查询</el-button>-->
        <el-button  size="medium" type="success" @click="exportAll">导出</el-button>
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
      <el-table-column type="index" header-align="center" align="center" width="100" label="序号">
        <template #default="scope">
          <span>{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="memberNickName" header-align="center" align="center" label="持卡人/昵称" min-width="170" />
      <el-table-column prop="cardNumber" header-align="center" align="center" label="卡号"   min-width="170" />
      <el-table-column prop="cardType" header-align="center" align="center" label="卡片类型" min-width="170" />
      <el-table-column prop="consumptionAmount" header-align="center" align="center" label="总消费金额" min-width="170"/>
      <el-table-column prop="rechargeAmount" header-align="center" align="center" label="总充值金额" min-width="170" />
      <el-table-column prop="actualAmount" header-align="center" align="center" label="总实付金额" min-width="170" />
      <el-table-column prop="createTime" header-align="center" align="center" label="开卡时间" min-width="170" />
      <el-table-column header-align="center" align="center" label="开卡门店" min-width="170" />
      <el-table-column  header-align="center" align="center" label="初次充值金额" min-width="170" />
      <el-table-column prop="cardBalance" header-align="center" align="center" label="余额" min-width="170" />
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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default {
  data: function () {
    return {
      dataForm: {
        order: null,
        orderField: null,
        cardNumber: null,
        store: null,
        cashier: null,
        cardType: null
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
        page: that.pageIndex,
        size: that.pageSize,
        orderField: that.dataForm.orderField,
        order: that.dataForm.order,
      };
      that.$http('admin/report/card', 'POST', data, true, function (resp) {
        that.dataList=resp.records.map(item => {
          return {
            ...item, // 保留其他属性
            createTime:  convertToChinaTime(item.createTime) ,// 转换时间
            consumptionAmount: item.consumptionAmount?.toFixed(2) || null,
            rechargeAmount: item.rechargeAmount?.toFixed(2) || null,
            actualAmount: item.actualAmount?.toFixed(2) || null,
            cardBalance: item.cardBalance?.toFixed(2) || null,
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
    exportAll(){
      let that=this
      let data = {
        page: 1,
        size: that.totalCount,
      };
      that.$http('admin/report/card', 'POST', data, true, function (resp) {
        let dataList = resp.records;
        dataList=resp.records.map(item => {
          return {
            ...item, // 保留其他属性
            createTime:  convertToChinaTime(item.createTime) ,// 转换时间
            consumptionAmount: item.consumptionAmount?.toFixed(2) || null,
            rechargeAmount: item.rechargeAmount?.toFixed(2) || null,
            actualAmount: item.actualAmount?.toFixed(2) || null,
            cardBalance: item.cardBalance?.toFixed(2) || null,
          };
        })
        that.exportToExcel(dataList)
      });
    },
    exportToExcel(dataList) {
      let tableData = [['序号','持卡人/昵称','卡号','卡片类型','总消费金额','总充值金额','总实付金额','开卡时间','开卡门店','初次充值金额','余额']];
      dataList.forEach((item,index) => {
        let rowData = [
          index+1,
          item.memberNickName,
          item.cardNumber,
          item.cardType,
          item.consumptionAmount,
          item.rechargeAmount,
          item.actualAmount,
          item.createTime,
          null,
          null,
          item.cardBalance
        ];
        tableData.push(rowData);
      })
      // 2. 将数据转换为工作表
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let R = 1; R <= range.e.r; R++) { // 从第 2 行（索引 1）开始
        worksheet[`A${R + 1}`].t = 'S'; // 序号设为字符串
      }
      worksheet["!cols"] = [
        {wch: 20},  // 序号：宽度 5
        {wch: 20}, // 日期：宽度 15
        {wch: 20}, // 充值卡号：宽度 20
        {wch: 20}, // 单据时间：宽度 20
        {wch: 20}, // 单据编号：宽度 15
        {wch: 10}, // 销售金额：宽度 10
        {wch: 10}, // 充值金额：宽度 10
        {wch: 20}, // 实付金额：宽度 10
        {wch: 20}, // 交易门店：宽度 15
        {wch: 20}, // 收银员：宽度 10
        {wch: 10}  // 卡片类型：宽度 10
      ];

      // 3. 创建工作簿并添加工作表
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "会员卡信息");

      // 4. 将工作簿导出为二进制数据
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // 5. 使用 file-saver 保存文件
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, "会员卡信息.xlsx");
    },
  },
  mounted() {
    this.loadDataList();
  }

};
</script>

<style></style>
