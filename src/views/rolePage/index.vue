<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >
      <el-form-item >
        <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="searchHandle()">查询</el-button>
        <el-button size="medium" type="success" @click="addOrUpdate()" :disabled="!isAuth(['ROOT', 'ROLE:INSERT'])">新增</el-button>
        <el-button size="medium" type="danger" @click="deleteHandle()" :disabled="!isAuth(['ROOT', 'ROLE:DELETE'])">删除</el-button>
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
      <el-table-column prop="roleName" header-align="center" align="center" label='角色名称' min-width="120" />
      <el-table-column prop="desc" header-align="center" align="center" label='描述' min-width="170" />
      <el-table-column prop="users" header-align="center" align="center" label='关联用户' min-width="170" />
      <el-table-column prop="permissions" header-align="center" align="center" label='权限数量' min-width="170" />
      <el-table-column header-align="center" align="center" min-width="150" label="操作">
        <template #default="scope">
          <el-button
              type="text"
              size="medium"
              @click="addOrUpdate(scope.row.id)"
              :disabled="!isAuth(['ROOT', 'ROLE:UPDATE'])"
          >
            更新
          </el-button>
          <el-button
              type="text"
              size="medium"
              @click="deleteHandle(scope.row.id)"
              :disabled="!isAuth(['ROOT', 'ROLE:DELETE'])"
          >
            删除
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
    <role-add-or-update v-if="addOrUpdateVisible" ref="roleAddOrUpdate" @refreshDataList="loadDataList"></role-add-or-update>
  </div>
</template>

<script>
import roleAddOrUpdate from "./role-add-or-update.vue";
export default {
  components:{
    roleAddOrUpdate
  },
  data: function() {
    return {
      dataForm: {
        order:null,
        orderField:null,
        roleName:null,
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      dataRule: {},
      dataListSelections: [],
      addOrUpdateVisible:false,
    };
  },
  methods: {
    selectionChangeHandle: function(val) {
      this.dataListSelections = val;
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
        that.$confirm('确定要删除选中的记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http('admin/role', 'DELETE', { ids:ids }, true, function(resp) {
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
        this.$refs.roleAddOrUpdate.init(id);
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
        roleName:that.dataForm.roleName
      };
      that.$http('admin/role/page', 'POST', data, true, function (resp) {
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

    this.loadDataList();
  }

};
</script>

<style></style>
