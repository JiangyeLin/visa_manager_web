<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm">
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
              key="create_time"
              label="评价时间"
              value="create_time"
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
        @selection-change="selectionChangeHandle"
        cell-style="padding: 4px 0"
        size="medium"
        style="width: 100%;"
    >
      <el-table-column
          type="selection"
          :selectable="selectable"
          header-align="center"
          align="center"
          width="50"
      />

      <el-table-column prop="date" header-align="center" align="center" label="预约日期" sortable min-width="170" fixed />
      <el-table-column prop="startTime" header-align="center" align="center" label="场次时间" min-width="170" fixed/>

      <el-table-column prop="createTime" header-align="center" align="center" label="评价时间" sortable  min-width="170" fixed/>

      <el-table-column prop="appointmentCategory" header-align="center" align="center" label="类型" min-width="130" />
      <el-table-column  header-align="center" align="center" label="整体评价(满分5)" min-width="130" >
        <template #default="scope">
          <span style="font-weight: bold">{{ scope.row.overallRating }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="serviceRating" header-align="center" align="center" label="服务评价(满分5)" min-width="130" />
      <el-table-column prop="contentRating" header-align="center" align="center" label="内容评价(满分5)" min-width="130" />
      <el-table-column prop="explainRating" header-align="center" align="center" label="讲解评价(满分5)" min-width="130" />
      <el-table-column prop="reviewText" header-align="center" align="center" label="留言" min-width="270" />
      <el-table-column prop="wxUserName" header-align="center" align="center" label="用户名" min-width="130" />

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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="loadDataList"></add-or-update>
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
        startDate:null,
        endDate:null,
        appoStatus:null,
        orderField:"create_time",
        order:null
      },
      date: null,
      dataList: [],
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
    searchHandle: function() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$refs['dataForm'].clearValidate();
          if (this.pageIndex != 1) {
            this.pageIndex = 1;
          }
          this.loadDataList();
        } else {
          return false;
        }
      });
    },
    convertToCST(isoString,type) {
      // 创建一个 Date 对象
      const date = new Date(isoString);
      // 使用 toLocaleString 方法转换为中国时间
      const option1 = {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const option2 = {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      };
      let formattedCSTString;
      if(type==="YYYY-MM-DD HH:MM:SS"){
        let cstString = date.toLocaleString('zh-CN', option1);
        formattedCSTString = cstString.replace(/(\d{4})\/(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})/, '$1-$2-$3 $4:$5:$6');
      }
      else if(type==="YYYY-MM-DD"){
        let cstString = date.toLocaleString('zh-CN', option2);
        formattedCSTString = cstString.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3');
      }
      return formattedCSTString;
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

      that.$http('admin/review/page', 'GET', data, true, function(resp) {
        that.dataList = resp.records;
        that.dataList.forEach(item => {
          item.date = that.convertToCST(item.date,"YYYY-MM-DD");
          item.createTime = that.convertToCST(item.createTime,"YYYY-MM-DD HH:MM:SS");
        })
        that.totalCount = resp.total;
        that.dataListLoading = false;
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
  },
  created: function() {
    this.loadDataList();
  }
};
</script>

<style>
</style>
