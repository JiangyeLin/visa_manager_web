<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >
      <el-form-item>
        <el-date-picker
            @change="dateChange"
            v-model="dataForm.date"
            type="datetimerange"
            value-format="yyyy-MM-dd"
            range-separator="——"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="日期选择"
            unlink-panels
        />
      </el-form-item>
      <el-form-item >
        <el-input v-model="dataForm.memberPhoneNumber" placeholder="持卡人手机号" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="dataForm.cardNumber" placeholder="卡号" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-select v-model="dataForm.cardType"  placeholder="卡片类型" size="medium" clearable>
          <el-option label="电子卡" value=0 />
          <el-option label="实体卡" value=1 />
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
              key="rechargeAmount"
              label="总充值金额"
              value="rechargeAmount"
          />
          <el-option
              key="consumptionAmount"
              label="总消费金额"
              value="consumptionAmount"
          />
          <el-option
              key="actualAmount"
              label="总实付金额"
              value="actualAmount"
          />
          <el-option
              key="cardBalance"
              label="余额"
              value="cardBalance"
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
        @header-dragend="handleDrag"
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
      <el-table-column type="index" header-align="center" align="center" :width="tableWidth[0]" label="序号">
        <template #default="scope">
          <span>{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="memberNickName" header-align="center" align="center" label="持卡人昵称" :width="tableWidth[1]" />
      <el-table-column prop="memberPhoneNumber" header-align="center" align="center" label="持卡人手机号" :width="tableWidth[2]" />
      <el-table-column prop="cardNumber" header-align="center" align="center" label="卡号"   :width="tableWidth[3]" />
      <el-table-column prop="cardType" header-align="center" align="center" label="卡片类型" :width="tableWidth[4]" />
      <el-table-column prop="consumptionAmount" header-align="center" align="center" label="总消费金额" :width="tableWidth[5]"/>
      <el-table-column prop="rechargeAmount" header-align="center" align="center" label="总充值金额" :width="tableWidth[6]" />
      <el-table-column prop="actualAmount" header-align="center" align="center" label="总实付金额" :width="tableWidth[7]" />
      <el-table-column prop="createTime" header-align="center" align="center" label="开卡时间" :width="tableWidth[8]" />
      <el-table-column header-align="center" align="center" label="开卡门店" :width="tableWidth[9]" />
      <el-table-column  header-align="center" align="center" label="初次充值金额" :width="tableWidth[10]" />
      <el-table-column prop="cardBalance" header-align="center" align="center" label="余额" :width="tableWidth[11]" />
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
        cardType: null,
        memberPhoneNumber:null,
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
      tableWidth:[]
    };
  },
  methods: {
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
    loadDataList: function () {
      let that = this;
      that.dataListLoading = true;
      let data = {
        page: that.pageIndex,
        size: that.pageSize,
        cardNumber:that.dataForm.cardNumber,
        memberPhoneNumber:that.dataForm.memberPhoneNumber,
        cardType:that.dataForm.cardType,
        startTime: that.dataForm.startTime,
        endTime: that.dataForm.endTime,
        orderField: that.dataForm.orderField || "",
        order: that.dataForm.order
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
        cardNumber:that.dataForm.cardNumber,
        memberPhoneNumber:that.dataForm.memberPhoneNumber,
        cardType:that.dataForm.cardType,
        startTime: that.dataForm.startTime,
        endTime: that.dataForm.endTime,
        orderField: that.dataForm.orderField || "",
        order: that.dataForm.order
      };
      that.$http('admin/report/card', 'POST', data, true, function (resp) {
        let dataList=resp.records.map(item => {
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
      let tableData = [['序号','持卡人昵称','持卡人手机号','卡号','卡片类型','总消费金额','总充值金额','总实付金额','开卡时间','开卡门店','初次充值金额','余额']];
      dataList.forEach((item,index) => {
        let rowData = [
          index+1,
          item.memberNickName,
          item.memberPhoneNumber,
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
        {wch: 10},  // 序号：宽度 5
        {wch: 15}, // 持卡人昵称：宽度 15
        {wch: 20}, // 持卡人手机号：宽度 20
        {wch: 20}, // 卡号：宽度 20
        {wch: 10}, // 卡片类型：宽度 15
        {wch: 15}, // 总消费金额：宽度 10
        {wch: 15}, // 总充值金额：宽度 10
        {wch: 15}, // 总实付金额：宽度 10
        {wch: 20}, // 开卡时间：宽度 15
        {wch: 20}, // 开卡门店 宽度 10
        {wch: 20},  // 初次充值金额：宽度 10
        {wch: 15}   //余额
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
    handleDrag(newWidth, oldWidth, column){
      this.tableWidth[column.no-1]=newWidth
      localStorage.setItem('cardInfoWidth',JSON.stringify(this.tableWidth))
    }
  },
  mounted() {
    if(localStorage.getItem('cardInfoWidth')){
      this.tableWidth=JSON.parse(localStorage.getItem('cardInfoWidth'))
    }
    else{
      for(let i=0;i<12;i++){
        this.tableWidth.push(170)
      }
    }
    this.loadDataList();
  }

};
</script>

<style></style>
