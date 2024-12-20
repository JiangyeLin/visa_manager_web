<template>
    <div>
        <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >
            <el-form-item >
              <el-input v-model="dataForm.nickName" placeholder="用户昵称" clearable></el-input>
            </el-form-item>
          <el-form-item >
            <el-input v-model="dataForm.phoneNumber" placeholder="手机号" clearable></el-input>
          </el-form-item>
<!--            <el-form-item >-->
<!--                <el-select-->
<!--                    v-model="dataForm.orderField"-->
<!--                    placeholder="排序字段"-->
<!--                    size="large"-->
<!--                    style="width: 100%"-->
<!--                    @change="searchHandle()"-->
<!--                    clearable -->
<!--                    >-->
<!--                    <el-option-->
<!--                        key="pa.create_time"-->
<!--                        label="创建时间"-->
<!--                        value="createTime"-->
<!--                    />-->
<!--                    <el-option-->
<!--                        key="pa.update_time"-->
<!--                        label="更新时间"-->
<!--                        value="balance"-->
<!--                    />-->
<!--                    <el-option-->
<!--                        key="se.date"-->
<!--                        label="日期"-->
<!--                        value="se.date"-->
<!--                    />-->
<!--                </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item >-->
<!--                <el-select-->
<!--                    v-model="dataForm.order"-->
<!--                    placeholder="排序方式"-->
<!--                    size="large"-->
<!--                    style="width: 100%"-->
<!--                    @change="searchHandle()"-->
<!--                    clearable -->
<!--                    >-->
<!--                    <el-option-->
<!--                        key="asc"-->
<!--                        label="升序"-->
<!--                        value="asc"-->
<!--                    />-->
<!--                    <el-option-->
<!--                        key="desc"-->
<!--                        label="降序"-->
<!--                        value="desc"-->
<!--                    />-->
<!--     -->
<!--                </el-select>-->
<!--            </el-form-item>-->
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
            :row-class-name="tableRowClassName"
        >
            <el-table-column
                type="selection"
                :selectable="selectable"
                header-align="center"
                align="center"
                width="50"
            />
<!--          <el-table-column header-align="center" align="center" width="200" label="操作">-->
<!--            <template #default="scope">-->
<!--              <el-button-->
<!--                  v-if="!checkList.includes(scope.row.id)"-->
<!--                  type="text"-->
<!--                  size="medium"-->
<!--                  @click="updateIscheck(scope.row.id,'标记')"-->
<!--              >-->
<!--                标记-->
<!--              </el-button>-->
<!--              <el-button-->
<!--                  v-if="checkList.includes(scope.row.id)"-->
<!--                  type="text"-->
<!--                  size="medium"-->
<!--                  @click="updateIscheck(scope.row.id,'取消')"-->
<!--              >-->
<!--                取消-->
<!--              </el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
          
            <el-table-column prop="id" header-align="center" align="center" label="会员ID" min-width="170" fixed />
            <el-table-column prop="nickName" header-align="center" align="center" label="用户昵称" min-width="170" fixed/>
            <el-table-column prop="phoneNumber" header-align="center" align="center" label="手机号" sortable  min-width="170" fixed/>
            <el-table-column prop="balance" header-align="center" align="center" label="余额" min-width="270" />
            <el-table-column prop="points" header-align="center" align="center" label="积分" min-width="170" />
            <el-table-column prop="level" header-align="center" align="center" label="等级" min-width="170" />
          <el-table-column prop="status" header-align="center" align="center" label="状态" min-width="170" fixed/>
            <el-table-column prop="creatTime" header-align="center" align="center" label="创建时间" min-width="270" />

            <!-- <el-table-column header-align="center" align="center" label="成人人数" min-width="140">
                <template #default="scope">
                    <span>{{ scope.row.adultNumber }}人</span>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="儿童人数" min-width="140">
                <template #default="scope">
                    <span>{{ scope.row.childNumber }}人</span>
                </template>
            </el-table-column>

            <el-table-column header-align="center" align="center" label="是否评价" min-width="270" >
                <template #default="scope">
                    <span>{{ scope.row.isTop500 == 1 ? '是' : '否' }}</span>
                </template>
            </el-table-column> -->
           
           
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
import AddOrUpdate from './dept-add-or-update.vue';
import * as XLSX from 'xlsx'
export default {
    components: {
        AddOrUpdate
    },
    data: function() {
        return {
            dataForm: {
              order:null,
              orderField:null,
              nickName:null,
              phoneNumber:null,
                id:null,
                member_id:null,
                store_id:null,
                user_id:null,
                device_id:null,
                order_no:null,
                remark:null,
                consumption_amount:null,
                creat_time:null,
                updata_time:null,
                status:null

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
        console.log('获取数据')
        if(type==="标记"){
          that.checkList.push(id)
        }
        else if(type==="取消"){
          let index = that.checkList.findIndex(item => item === id);
          if (index !== -1) {
            that.checkList.splice(index, 1); // 移除索引为 indexToRemove 的元素
          }
        }
        that.$http('/admin/member/page', 'POST', that.checkList, true, function(resp) {
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
            if(Array.isArray(that.dataForm.appoStatus) && that.dataForm.appoStatus.length===0){
                that.dataForm.appoStatus=null
            }
            let data = {
              nickName:that.dataForm.nickName,
              phoneNumber:that.dataForm.phoneNumber,
                page: that.pageIndex,
                size: that.pageSize,
                orderField:that.dataForm.orderField,
                order:that.dataForm.order
            };

            that.$http('/admin/member/page', 'POST', data, true, function(resp) {
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
            this.loadDataList();
        },
   
        addHandle: function() {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init();
            });
        },
        updateHandle: function(id) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },
        
        appoStatusChange(val){
            let that=this;
            let data ={
                id:val.id,
                appoStatus:val.appoStatus
            }
            that.$http("/admin/member/page","POST",data,true);
        },
        exportExcel:function(){
            let that = this;

            let data = {
                startDate: that.dataForm.startDate,
                endDate: that.dataForm.endDate,
                appoStatus:that.dataForm.appoStatus,
                page: 1,
                size: that.totalCount,
                orderField:that.dataForm.orderField,
                order:that.dataForm.order
            };
            
            let jsonData=null;
            that.$http('/admin/member/page', 'POST', data, false, function(resp) {
                jsonData = resp.records;
            });

            let tableData = [['日期','时间','联系人姓名','联系人电话','成人人数','儿童人数','预约状态','创建时间','更新时间','微信用户昵称',]];
            
            jsonData.forEach(item => {
                let rowData = [
					        item.date,
                  item.startTime,
					        item.contactsName,
					        item.contactsTel,
                  item.adultNumber,
					        item.childNumber,
					        item.appoStatus,

					        item.createTime,
				        	item.updateTime,
                  item.wxUserNickName,
                ];
                tableData.push(rowData);
            });
            let workSheet = XLSX.utils.aoa_to_sheet(tableData);
            let bookNew = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(bookNew, workSheet, '数据') 
            let name = '个人预约数据'  + '.xlsx'
            XLSX.writeFile(bookNew, name)
        }
    },
    created: function() {
        this.loadDataList();
    }
};
</script>

<style></style>
