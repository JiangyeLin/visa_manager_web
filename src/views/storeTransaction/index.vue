<template>
  <div>
    <div class="statistic" >
      <div class="statistic-item">
        <p>销售总金额</p>
        <p class="statistic-number">￥{{consumptionAmountTotal}}</p>
      </div>
      <div class="statistic-item">
        <p>充值总金额</p>
        <p class="statistic-number">￥{{rechargeAmountTotal}}</p>
      </div>
      <div class="statistic-item">
        <p>实付总金额</p>
        <p class="statistic-number">￥{{actualPayTotal}}</p>
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
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="日期选择"
            unlink-panels
        />
      </el-form-item>
      <el-form-item >
        <el-input v-model="dataForm.cardNumber" placeholder="卡号" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-cascader  v-model="dataForm.cascaderValue" @change="cascaderChange" :options="cascaderOption" placeholder="交易门店/收银员"  :props="{ checkStrictly: true }" clearable></el-cascader>
      </el-form-item>
      <el-form-item >
        <el-select v-model="dataForm.cardType"  placeholder="卡片类型" size="medium" clearable>
          <el-option label="电子卡" value=0 />
          <el-option label="实体卡" value=1 />
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-select v-model="dataForm.queryType"  @change="typeChange" placeholder="记录类型" size="medium" clearable>
          <el-option label="销售记录" value=1  :disabled="dataForm.orderField==='rechargeAmount' || dataForm.orderField==='actualPayAmount'" />
          <el-option label="充值记录" value=2  :disabled="dataForm.orderField==='consumptionAmount'" />
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-select
            v-model="dataForm.orderField"
            placeholder="排序字段"
            size="large"
            style="width: 100%"
            @change="orderFieldChange"
            clearable
        >
          <el-option
              key="consumptionAmount"
              label="销售金额"
              value="consumptionAmount"
              :disabled="dataForm.queryType==='2'"
          />
          <el-option
              key="rechargeAmount"
              label="充值金额"
              value="rechargeAmount"
              :disabled="dataForm.queryType==='1'"
          />
          <el-option
              key="actualPayAmount"
              label="实付金额"
              value="actualPayAmount"
              :disabled="dataForm.queryType==='1'"
          />
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-select
            v-model="dataForm.order"
            placeholder="排序方式"
            size="large"
            style="width: 100%"

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
        <el-button size="medium" type="warning" @click="clearQuery">清空条件</el-button>
        <el-button  size="medium" type="success" @click="exportAll">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        @header-dragend="handleDrag"
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
      <el-table-column prop="date" header-align="center" align="center" label="日期" :width="tableWidth[1]" />
      <el-table-column prop="cardNumber" header-align="center" align="center" label="卡号"   :width="tableWidth[2]" />
      <el-table-column prop="createTime" header-align="center" align="center" label="单据时间" :width="tableWidth[3]" />
      <el-table-column prop="orderNo" header-align="center" align="center" label="单据编号" :width="tableWidth[4]" />
      <el-table-column prop="consumptionAmount" header-align="center" align="center" label="销售金额" :width="tableWidth[5]" />
      <el-table-column prop="rechargeAmount" header-align="center" align="center" label="充值金额" :width="tableWidth[6]" />
      <el-table-column prop="actualPayAmount" header-align="center" align="center" label="实付金额" :width="tableWidth[7]" />
      <el-table-column prop="storeName" header-align="center" align="center" label="交易门店" :width="tableWidth[8]" />
      <el-table-column prop="userName" header-align="center" align="center" label="收银员" :width="tableWidth[9]" />
      <el-table-column prop="cardType" header-align="center" align="center" label="卡片类型" :width="tableWidth[10]" />
      <el-table-column prop="status" header-align="center" align="center" label="状态" :width="tableWidth[11]" />
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
        cardType:null,
        date:null,
        startTime: null,
        endTime: null,
        cascaderValue:null,
        storeId:null,
        userId:null,
        queryType: null,
      },
      cascaderOption:[ ],
      dataList: [],
      userTree:null,
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      dataRule: {},
      consumptionAmountTotal:null,
      rechargeAmountTotal:null,
      actualPayTotal:null,
      tableWidth:[]
    };
  },
  methods: {
    loadDataList: function () {
      let that = this;
      that.dataListLoading = true;
      let data = {
        page: that.pageIndex,
        size: that.pageSize,
        orderField: that.dataForm.orderField ,
        order: that.dataForm.order || 'asc' ,
        cardNumber:that.dataForm.cardNumber,
        cardType: that.dataForm.cardType,
        queryType : that.dataForm.queryType || 0,
        startTime: that.dataForm.startTime,
        endTime: that.dataForm.endTime,
        userId: that.dataForm.userId,
        storeId: that.dataForm.storeId
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
    orderFieldChange(value){
      if(value==='consumptionAmount'){
        this.dataForm.queryType = '1'
      }
      if(value === 'rechargeAmount' || value === 'actualPayAmount'){
        this.dataForm.queryType = '2'
      }
      // this.searchHandle()
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
        orderField: that.dataForm.orderField ,
        order: that.dataForm.order || 'asc' ,
        cardNumber:that.dataForm.cardNumber,
        cardType: that.dataForm.cardType,
        queryType : that.dataForm.queryType || 0,
        startTime: that.dataForm.startTime,
        endTime: that.dataForm.endTime,
        userId: that.dataForm.userId,
        storeId: that.dataForm.storeId
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
      let tableData = [['序号','日期','卡号','单据时间','单据编号','销售金额','充值金额','实付金额','交易门店','收银员','卡片类型','状态']];
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
    handleDrag(newWidth, oldWidth, column){
      this.tableWidth[column.no-1]=newWidth
      localStorage.setItem('storeTransWidth',JSON.stringify(this.tableWidth))
    },
    typeChange(value){
      if(value===''){
        this.dataForm.orderField=null
      }
    },
    clearQuery(){
      this.dataForm= {
        order:null,
        orderField:null,
        cardNumber:null,
        cardType:null,
        date:null,
        startTime: null,
        endTime: null,
        cascaderValue:null,
        storeId:null,
        userId:null,
        queryType: null,
      }
    },
    cascaderChange(value){
      if(!value){
        this.dataForm.storeId=null
        this.dataForm.userId=null
      }
      else if( Array.isArray(value) && value.length===1){
        this.dataForm.storeId=value[0]
      }
      else if( Array.isArray(value) && value.length===2){
        this.dataForm.storeId=value[0]
        this.dataForm.userId=value[1]
      }
    }
  },
  mounted() {
    let that=this
    that.$http('admin/store/idlist', 'GET', null, true, function (resp) {
      that.userTree=resp;
      that.cascaderOption=that.userTree.map(store => {
        return {
          value: store.id,
          label: store.storeName,
          children: store.users.map(user => ({
            value: user.id,
            label: user.userName
          }))
        }
      });
    });
    if(localStorage.getItem('storeTransWidth')){
      this.tableWidth=JSON.parse(localStorage.getItem('storeTransWidth'))
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
