<template>
    <div>
        <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm">
            <el-form-item >
<!--                <el-select-->
<!--                    v-model="dataForm.appoStatus"-->
<!--                    placeholder="预约状态"-->
<!--                    size="large"-->
<!--                    style="width: 100%"-->
<!--                    clearable-->
<!--                    multiple-->
<!--                    >-->
<!--                    <el-option-->
<!--                        key="待审核"-->
<!--                        label="待审核"-->
<!--                        value="待审核"-->
<!--                    />-->
<!--                    <el-option-->
<!--                        key="审核未通过"-->
<!--                        label="审核未通过"-->
<!--                        value="审核未通过"-->
<!--                    />-->
<!--                    <el-option-->
<!--                        key="未核销"-->
<!--                        label="未核销"-->
<!--                        value="未核销"-->
<!--                    />-->
<!--                    <el-option-->
<!--                        key="已核销"-->
<!--                        label="已核销"-->
<!--                        value="已核销"-->
<!--                    />-->
<!--                    <el-option-->
<!--                        key="已取消"-->
<!--                        label="已取消"-->
<!--                        value="已取消"-->
<!--                    />-->
<!--                </el-select>-->
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
                <el-date-picker
                    @change="dateChange"
                    v-model="date"
                    type="daterange"
                    range-separator="——"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    placeholder="日期选择"
                    unlink-panels
                />
            </el-form-item>
            <el-form-item>
                <el-button size="medium" type="primary" @click="searchHandle()">查询</el-button>
                <!-- <el-button
                    size="medium"
                    type="primary"
                    @click="addHandle()"
                >
                    新增
                </el-button> -->
				<!-- <el-button
				    size="medium"
				    type="primary"
				    @click="exportExcel()"
				>
				    导出excel
				</el-button> -->
              
            </el-form-item>
        </el-form>
        <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            :cell-style="{ padding: '4px 0'  }"
            size="medium"
            style="width: 100%;"
            highlight-current-row
            :row-class-name="tableRowClassName"
        >
            <el-table-column
                type="selection"
                :selectable="selectable"
                header-align="center"
                align="center"
                width="50"
            />
          <!-- <el-table-column header-align="center" align="center" width="200" label="操作"> -->
            <!-- <template #default="scope">
              <el-button
                  v-if="!checkList.includes(scope.row.id)"
                  type="text"
                  size="medium"
                  @click="updateIscheck(scope.row.id,'标记')"
              >
                标记
              </el-button>
              <el-button
                  v-if="checkList.includes(scope.row.id)"
                  type="text"
                  size="medium"
                  @click="updateIscheck(scope.row.id,'取消')"
              >
                取消
              </el-button>
            </template> -->
          <!-- </el-table-column> -->
            <el-table-column prop="orderNo" header-align="center" align="center" label="订单号" min-width="170" />
            <el-table-column prop="amount" header-align="center" align="center" label="订单金额" min-width="170" />
            <el-table-column prop="memberPhone" header-align="center" align="center" label="手机号"  min-width="170" />
            <el-table-column prop="storeName" header-align="center" align="center" label="门店名字"  min-width="170" />
            <el-table-column prop="userName" header-align="center" align="center" label="操作员" min-width="170" />
            <el-table-column prop="remarks" header-align="center" align="center" label="备注" min-width="270" />
            <el-table-column prop="status" header-align="center" align="center" label="订单状态" min-width="270" />
            <el-table-column prop="createTime" header-align="center" align="center" label="创建时间" min-width="270" />

           
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
import AddOrUpdate from './teme-appo-add-or-update.vue';
import * as XLSX from 'xlsx';
export default {
    components: {
        AddOrUpdate
    },
    data: function() {
        return {
            dataForm: {
                orderNo:null,
                amount:null,
                memberPhone:null,
                storeName:null,
                userName:null,
                remarks:null,
                status:null,
                createTime:null,
                order:null,
                orderField:null,
            },
            date: null,
            dataList: [],
            checkList:[],
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            dataRule: {
                deptName: [
                    { required: false, pattern: '^[a-zA-Z0-9\u4e00-\u9fa5]{1,10}$', message: '部门名称格式错误' }
                ]
            }
        };
    },
    methods: {
      updateIscheck(id,type){
        let that = this;
        console.log("获取数据")
        if(type==="标记"){
          that.checkList.push(id)
        }
        else if(type==="取消"){
          let index = that.checkList.findIndex(item => item === id);
          if (index !== -1) {
            that.checkList.splice(index, 1); // 移除索引为 indexToRemove 的元素
          }
        } 
        that.$http('/admin/order/page', 'POST', that.checkList, true, function(resp) {
        });
      },
      tableRowClassName({row}){
        if(this.checkList.includes(row.id)){
          return 'checked';
        }
      },
      dateChange(date){
        if(Array.isArray(date) && date.length > 0){
          this.dataForm.startDate=date[0];
          this.dataForm.endDate=date[1]
        }
        else{
          this.dataForm.startDate=null;
          this.dataForm.endDate=null;
        }
      },
        loadDataList: function() {
            let that = this;
            that.dataListLoading = true;
            let data = {
                page: that.pageIndex,
                size: that.pageSize,
                orderField:that.dataForm.orderField,
                order:that.dataForm.order
            };
            that.$http('/admin/order/page', 'POST', data, true, function(resp) {
                that.dataList = resp.records;
                that.totalCount = resp.total;
                that.dataListLoading = false;
            });
        },
        searchHandle: function() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$refs['dataForm'].clearValidate();
                    if (this.dataForm.deptName == '') {
                        this.dataForm.deptName = null;
                    }
                  if(Array.isArray(this.dataForm.appoStatus) && this.dataForm.appoStatus.length===0){
                    this.dataForm.appoStatus=null
                  }
                    if (this.pageIndex != 1) {
                        this.pageIndex = 1;
                    }
                    this.loadDataList();
                } else {
                    return false;
                }
            });
        },
        selectable: function(row, index) {
            if (row.emps > 0) {
                return false;
            }
            return true;
        },
        selectionChangeHandle: function(val) {
            this.dataListSelections = val;
        },
        sizeChangeHandle: function(val) {
            this.pageSize = val;
            this.pageIndex = 1;
            this.loadDataList();
        },
        currentChangeHandle: function(val) {
            this.pageIndex = val;
            console.log(this.pageIndex);
            this.loadDataList();
        },
 
        addHandle: function() {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init();
            });
        },
        appoStatusChange(val){
            let that=this;
            let data ={
                id:val.id,
                appoStatus:val.appoStatus
            }
            that.$http("/admin/order/page","POST",data,false);
            that.loadDataList();
        },
		 exportExcel: function(){
			let that = this;
			that.dataListLoading = true;
			let data = {
          startDate: that.dataForm.startDate,
          endDate: that.dataForm.endDate,
			    appoStatus:that.dataForm.appoStatus,
			    page: 1,
			    size: that.totalCount,
                orderField:that.dataForm.orderField,
                order:that.dataForm.order
			};
			
			let jsonData = null;
			that.$http('/admin/order/page', 'POST', data, false, function(resp) {
        jsonData = resp.records;
				that.dataListLoading = false;
			});
			
			let tableData = [['id','会员id',',门店id','操作员/用户id','设备id','订单号','备注','消费金额','创建时间','更新时间']];
			jsonData.forEach(item => {
				let rowData = [
                id,
                member_id,
                store_id,
                user_id,
                device_id,
                order_no,
                remark,
                consumption_amount,
                creat_time,
                updata_time,

				];
				tableData.push(rowData);
			})
			
			let workSheet = XLSX.utils.aoa_to_sheet(tableData);
			let bookNew = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(bookNew, workSheet, '数据')
			let name = '订单数据' + '.xlsx';
			XLSX.writeFile(bookNew, name);
		}
    },
      created: function() {

        this.loadDataList();
    }
};
</script>

<style >
 /* 选中某行时的背景色*/
 .el-table__body tr.current-row > td {
    background: rgb(197, 213, 255) !important;
  }
 .el-table .checked{
   background-color: #e0f7fa; /* 背景颜色 */
   color: #00695c; /* 字体颜色 */
   font-weight: bold; /* 字体加粗 */

   font-style: italic; /* 斜体 */
 }
</style>
