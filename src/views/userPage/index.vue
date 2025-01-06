<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >
      <el-form-item >
        <el-select v-model="dataForm.storeId" placeholder="门店" clearable>
          <el-option
              v-for="item in storeOption"
              :key="item.id"
              :label="item.storeName"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="dataForm.phoneNumber" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="searchHandle()">查询</el-button>
        <el-button size="medium" type="success" @click="addOrUpdate()" :disabled="!isAuth(['ROOT', 'USER:INSERT'])">新增</el-button>
        <el-button size="medium" type="danger" @click="deleteHandle()" :disabled="!isAuth(['ROOT', 'USER:DELETE'])">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :cell-style="{ padding: '4px 0'  }"
        size="medium"
        style="width: 100%;"
        @selection-change="selectionChangeHandle"
    >
      <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
      />
      <el-table-column type="index" header-align="center" align="center" width="100"  label="序号">
        <template #default="scope">
          <span>{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" header-align="center" align="center" label='用户名' min-width="120" />
      <el-table-column prop="phoneNumber" header-align="center" align="center" label='手机号' min-width="170" />
      <el-table-column prop="storeName" header-align="center" align="center" label='门店' min-width="150" />
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间" min-width="170" />
      <el-table-column header-align="center" align="center" min-width="150" label="操作">
        <template #default="scope">
          <el-button
              type="text"
              size="medium"
              @click="addOrUpdate(scope.row.id)"
          >
            更新
          </el-button>
          <el-button
              type="text"
              size="medium"
              @click="deleteHandle(scope.row.id)"
              :disabled="!isAuth(['ROOT', 'USER:UPDATE'])"
          >
            删除
          </el-button>
          <el-button
              type="text"
              size="medium"
              @click="repass(scope.row.id)"
              :disabled="!isAuth(['ROOT', 'USER:DELETE'])"
          >
            重置密码
          </el-button>
        </template>
      </el-table-column>
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
    <user-add-or-update v-if="addOrUpdateVisible" ref="userAddOrUpdate" @refreshDataList="loadDataList"></user-add-or-update>
  </div>
</template>

<script>
import userAddOrUpdate from "./user-add-or-update.vue";
export default {
  components:{
    userAddOrUpdate
  },
  data: function() {
    return {
      dataForm: {
        order:null,
        orderField:null,
        phoneNumber:null,
        storeId:null,
        userName:null
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      dataRule: {},
      addOrUpdateVisible:false,
      dataListSelections: [],
      storeTree:null,
      storeOption:[]
    };
  },
  methods: {
    selectionChangeHandle: function(val) {
      this.dataListSelections = val;
    },
    repass:function (id){
      let that = this;
      that.$confirm('重置密码：88888888', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http('admin/user/repass', 'POST', { userId:id }, true, function(resp) {
            that.$message({
              message: '操作成功',
              type: 'success',
              duration: 1200
            });
          that.$http('logout', 'POST', null, true, function (resp) {
            localStorage.removeItem('permissions');
            localStorage.removeItem('token');
            that.$router.push({ name: 'Login' });
          });
        });
      });

    },
    deleteHandle: function(id) {
      let that = this;
      let ids = id
          ? [id]
          : that.dataListSelections.map(item => {
            return item.id;
          });
      if (ids.length === 0) {
        that.$message({
          message: '没有选中记录',
          type: 'warning',
          duration: 1200
        });
      } else {
        that.$confirm('确定要删除选中的用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http('admin/user/delete', 'POST', { ids:ids }, true, function(resp) {
            that.$message({
              message: '操作成功',
              type: 'success',
              duration: 1200
            });
            that.loadDataList();
          });
        }).catch(()=>{});
      }
    },
    addOrUpdate(id){
      this.addOrUpdateVisible=true
      this.$nextTick(() => {
        this.$refs.userAddOrUpdate.init(id);
      });
    },
    loadDataList: function () {
      let that = this;
      that.dataListLoading = true;
      let data = {
        page: that.pageIndex,
        size: that.pageSize,
        orderField: that.dataForm.orderField,
        order: that.dataForm.order,
        phoneNumber:that.dataForm.phoneNumber,
        storeId:that.dataForm.storeId,
        userName:that.dataForm.userName,
      };
      that.$http('admin/user/page', 'POST', data, true, function (resp) {
        that.dataList=resp.records
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
    let that=this
    this.$http('admin/store/idlist', 'GET', null, true, function (resp) {
      that.storeOption=resp
    });
    this.loadDataList();
  }
};
</script>

<style></style>
