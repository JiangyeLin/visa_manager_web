<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm" >
      <el-form-item >
        <el-input v-model="dataForm.nickName" placeholder="用户昵称" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-input v-model="dataForm.phoneNumber" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="searchHandle()">查询</el-button>
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
      <!-- <el-table-column prop="id" header-align="center" align="center" label="用户ID" min-width="200" fixed /> -->
      <el-table-column prop="name" header-align="center" align="center" label="姓名" min-width="170" fixed/>
      <el-table-column prop="phoneNumber" header-align="center" align="center" label="手机号" min-width="170" fixed/>
      <el-table-column prop="passportNumber" header-align="center" align="center" label="护照编号" min-width="100" />
      <el-table-column prop="gender" header-align="center" align="center" label="性别" min-width="50" />
      <el-table-column prop="familyName" header-align="center" align="center" label="姓" min-width="100" />
      <el-table-column prop="givenName"  header-align="center" align="center" label="名" min-width="100" />
      <el-table-column prop="passportValidity" header-align="center" align="center" label="护照有效期" min-width="100" />
      <el-table-column prop="birthDate" header-align="center" align="center" label="生日" min-width="100" />
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
import { convertToChinaTime } from '../../utils';
import { formatDateTime } from '../../utils';


export default {
  data: function() {
    return {
      dataForm: {
        order:null,
        orderField:null,
        nickName:null,
        phoneNumber:null,
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
        nickName: that.dataForm.nickName,
        phoneNumber: that.dataForm.phoneNumber,
        page: that.pageIndex,
        size: that.pageSize,
        orderField: that.dataForm.orderField,
        order: that.dataForm.order
      };
      that.$http('customer/list', 'POST', data, true, function (resp) {
        that.dataList=resp.map(item=>{
          //console.log(parseTime(item.birthDate,"{y}-{m}-{d}"))
            return {
              ...item, //保留其他属性
              birthDate:formatDateTime(item.birthDate),
              passportValidity:formatDateTime(item.passportValidity),
            }
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
  },
  mounted() {
    this.loadDataList();
  }

};
</script>

<style></style>
