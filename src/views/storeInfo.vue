<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >
      <el-form-item >
        <el-input v-model="dataForm.name" placeholder="店名" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="dataForm.address" placeholder="地址" clearable></el-input>
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
      <el-table-column prop="name" header-align="center" align="center" label="店名" min-width="170" fixed/>
      <el-table-column prop="address" header-align="center" align="center" label="地址" sortable  min-width="170" fixed/>
<!--      <el-table-column prop="longitude" header-align="center" align="center" label="经度" min-width="270" />-->
<!--      <el-table-column prop="latitudes" header-align="center" align="center" label="纬度" min-width="170" />-->
      <el-table-column prop="principalName" header-align="center" align="center" label="负责人" min-width="170" />
      <el-table-column prop="bindCode" header-align="center" align="center" label="绑定码" min-width="170" fixed/>
<!--      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间" min-width="270" />-->
<!--      <el-table-column prop="updateTime" header-align="center" align="center" label="更新时间" min-width="270" />-->
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
        name:null,
        address:null,
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
        name:that.dataForm.name,
        address:that.dataForm.address,
        page: that.pageIndex,
        size: that.pageSize,
        orderField:that.dataForm.orderField,
        order:that.dataForm.order
      };

      that.$http('/admin/store/page', 'POST', data, true, function(resp) {
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

  },
  created: function() {
    this.loadDataList();
  }
};
</script>

<style></style>
