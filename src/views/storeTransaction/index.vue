<template>
  <div>
    <div class="statistic" >
      <div class="statistic-item">
        <p>销售总金额</p>
        <p class="statistic-number">{{consumptionAmountTotal}}</p>
      </div>
      <div class="statistic-item">
        <p>充值总金额</p>
        <p class="statistic-number">{{rechargeAmountTotal}}</p>
      </div>
      <div class="statistic-item">
        <p>实付总金额</p>
        <p class="statistic-number">{{actualPayTotal}}</p>
      </div>
    </div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >
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
        <el-input v-model="dataForm.name" placeholder="单据时间" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="dataForm.cardNumber" placeholder="卡号" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="dataForm.storeName" placeholder="交易门店" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="dataForm.userName" placeholder="收银员" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-select v-model="dataForm.cardType"  placeholder="卡片类型" size="medium" clearable>
          <el-option label="实体卡" value="实体卡" />
          <el-option label="电子卡" value="电子卡" />
        </el-select>
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
              key="consumptionAmount"
              label="销售金额"
              value="consumptionAmount"
          />
          <el-option
              key="rechargeAmount"
              label="充值金额"
              value="rechargeAmount"
          />
          <el-option
              key="actualPayAmount"
              label="实付金额"
              value="actualPayAmount"
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
      <el-table-column prop="date" header-align="center" align="center" label="日期" min-width="170" />
      <el-table-column prop="cardNumber" header-align="center" align="center" label="卡号"   min-width="170" />
      <el-table-column prop="createTime" header-align="center" align="center" label="单据时间" min-width="170" />
      <el-table-column prop="orderNo" header-align="center" align="center" label="单据编号" min-width="170" />
      <el-table-column prop="consumptionAmount" header-align="center" align="center" label="销售金额" min-width="170" />
      <el-table-column prop="rechargeAmount" header-align="center" align="center" label="充值金额" min-width="170" />
      <el-table-column prop="actualPayAmount" header-align="center" align="center" label="实付金额" min-width="170" />
      <el-table-column prop="storeName" header-align="center" align="center" label="交易门店" min-width="170" />
      <el-table-column prop="userName" header-align="center" align="center" label="收银员" min-width="170" />
      <el-table-column prop="cardType" header-align="center" align="center" label="卡片类型" min-width="170" />
      <el-table-column prop="status" header-align="center" align="center" label="状态" min-width="170" />
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
  data: function() {
    return {
      dataForm: {
        order:null,
        orderField:null,
        cardNumber:null,
        storeName:null,
        userName:null,
        cardType:null,
        date:null,
        startTime: null,
        endTime: null,
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      dataRule: {},
      consumptionAmountTotal:null,
      rechargeAmountTotal:null,
      actualPayTotal:null,
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
        cardNumber:that.dataForm.cardNumber,
        storeName:that.dataForm.storeName,
        userName: that.dataForm.userName,
        cardType: that.dataForm.cardType,
      };

      that.$http('admin/report/storeTransactionRecord', 'POST', data, true, function (resp) {
        that.dataList=resp.page.records.map(item => {
          return {
            ...item, // 保留其他属性
            createTime:  convertToChinaTime(item.createTime) ,// 转换时间
            consumptionAmount: item.consumptionAmount?.toFixed(2) || null,
            rechargeAmount: item.rechargeAmount?.toFixed(2) || null,
            actualPayAmount: item.actualPayAmount?.toFixed(2) || null,
          };
        })
        that.consumptionAmountTotal=resp.consumptionAmountTotal
        that.rechargeAmountTotal=resp.rechargeAmountTotal
        that.actualPayTotal=resp.actualPayTotal
        that.totalCount = resp.page.total;
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
    exportAll(){
      let that=this
      let data = {
        page: 1,
        size: that.totalCount,
      };
      that.$http('admin/report/storeTransactionRecord', 'POST', data, true, function (resp) {
        let dataList=resp.page.records.map(item => {
          return {
            ...item, // 保留其他属性
            createTime:  convertToChinaTime(item.createTime) ,// 转换时间
            consumptionAmount: item.consumptionAmount?.toFixed(2) || null,
            rechargeAmount: item.rechargeAmount?.toFixed(2) || null,
            actualPayAmount: item.actualPayAmount?.toFixed(2) || null,
          };
        })
        that.exportToExcel(dataList)
      });
    },
    exportToExcel(dataList) {
      let tableData = [['序号','日期','充值卡号','单据时间','单据编号','销售金额','充值金额','实付金额','交易门店','收银员','卡片类型','状态']];
      dataList.forEach((item,index) => {
        let rowData = [
          index+1,
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
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let R = 1; R <= range.e.r; R++) { // 从第 2 行（索引 1）开始
        worksheet[`A${R + 1}`].t = 'S'; // 序号设为数字
      }
      worksheet["!cols"] = [
        { wch: 20 },  // 序号：宽度 5
        { wch: 20 }, // 日期：宽度 15
        { wch: 15 }, // 充值卡号：宽度 20
        { wch: 20 }, // 单据时间：宽度 20
        { wch: 20 }, // 单据编号：宽度 15
        { wch: 10 }, // 销售金额：宽度 10
        { wch: 10 }, // 充值金额：宽度 10
        { wch: 10 }, // 实付金额：宽度 10
        { wch: 20 }, // 交易门店：宽度 15
        { wch: 10 }, // 收银员：宽度 10
        { wch: 10 }  // 卡片类型：宽度 10
      ];

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

<style scoped>
.statistic{
  display: grid;
  grid-template-columns: auto auto auto;
  background-color: #f1f4f5;
  margin-bottom: 20px;
}
.statistic-item{
  text-align: center;
}
.statistic-number{
  font-weight: bold;
  font-size: 20px;
}
</style>
