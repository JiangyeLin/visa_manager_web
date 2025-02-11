<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item>
        <el-input
          v-model="dataForm.keyword"
          placeholder="请输入要查询的关键字"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="searchHandle()"
          >查询公司</el-button
        >
        <el-button
          size="medium"
          type="success"
          @click="addOrUpdate()"
          :disabled="!isAuth(['ROOT', 'STORE:INSERT'])"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      stripe
      v-loading="dataListLoading"
      :cell-style="{ padding: '4px 0' }"
      size="medium"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <!-- <el-table-column prop="id" header-align="center" align="center" label="用户ID" min-width="200" fixed /> -->
      <el-table-column
        prop="companyNameCn"
        header-align="center"
        align="center"
        label="公司名称"
        min-width="170"
      >
      </el-table-column>
      <el-table-column
        prop="companyNameEn"
        header-align="center"
        align="center"
        label="英文名"
        min-width="50"
      />
      <el-table-column
        prop="address"
        header-align="center"
        align="center"
        label="注册地址"
        min-width="170"
      />
      <el-table-column
        prop="unifiedSocialCreditCode"
        header-align="center"
        align="center"
        label="统一社会信用代码"
        min-width="100"
      />
      <!--       <el-table-column prop="familyName" header-align="center" align="center" label="姓" min-width="100" />
      <el-table-column prop="givenName"  header-align="center" align="center" label="名" min-width="100" /> -->
      <el-table-column
        prop="legalRepresentative"
        header-align="center"
        align="center"
        label="法定代表人"
        min-width="100"
      />
      <el-table-column
        prop="registrationDate"
        header-align="center"
        align="center"
        label="注册日期"
        min-width="100"
      />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-popconfirm
            title="确认删除此公司?"
            @confirm="deleteCompany(scope.row.id)"
          >
            <template #reference>
              <el-button link type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>

    <company-save
      v-if="addOrUpdateVisible"
      ref="companySave"
      @refreshDataList="loadDataList"
    />
  </div>
</template>

<script>
import { formatDateTime } from "../../utils";
import companySave from "./company_save.vue";
export default {
  components: {
    companySave,
  },
  data: function () {
    return {
      dataForm: {
        order: null,
        orderField: null,
        keyword: null,
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      dataListLoading: false,
      dataRule: {},
      addOrUpdateVisible: false,
    };
  },
  methods: {
    addOrUpdate(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        if (this.$refs.companySave) {
          this.$refs.companySave.init();
        }
      });
    },
    deleteCompany(id) {
      let that = this;
      that.dataListLoading = true;
      let data = {
        id: id,
      };

      that.$http("company/delete", "DELETE", data, true, function (resp) {
        that.$message({
          message: "操作成功",
          type: "success",
          duration: 1200,
        });
        that.dataListLoading = false;

        that.loadDataList(); // 刷新表格数据
      });
    },
    loadDataList: function () {
      let that = this;
      that.dataListLoading = true;
      let data = {
        keyword: that.dataForm.keyword,
        phoneNumber: that.dataForm.phoneNumber,
        page: that.pageIndex,
        size: that.pageSize,
        orderField: that.dataForm.orderField,
        order: that.dataForm.order,
      };
      that.$http("company/list", "POST", data, true, function (resp) {
        that.dataList = resp.records.map((item) => {
          return {
            ...item, //保留其他属性
            registrationDate: formatDateTime(item.registrationDate),
          };
        });

        that.totalCount = resp.total;
        that.dataListLoading = false;
      });
    },
    searchHandle: function () {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$refs["dataForm"].clearValidate();
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
  },
};
</script>

<style></style>
