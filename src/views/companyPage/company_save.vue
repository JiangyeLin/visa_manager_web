<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    v-model="visible"
    width="750px"
    v-loading="loading"
  >
    <el-form
      :model="dataForm"
      ref="dataForm"
      :rules="dataRule"
      label-width="150px"
    >
      <el-form-item label="公司名称" prop="companyNameCn">
        <el-input v-model="dataForm.companyNameCn" size="medium" clearable />
      </el-form-item>
      <el-form-item label="英文名" prop="companyNameEn">
        <el-input v-model="dataForm.companyNameEn" size="medium" clearable />
      </el-form-item>
      <el-form-item label="法定代表人" prop="legalRepresentative">
        <el-input
          v-model="dataForm.legalRepresentative"
          size="medium"
          clearable
        />
      </el-form-item>
      <el-form-item label="注册地址" prop="address">
        <el-input v-model="dataForm.address" size="medium" clearable />
      </el-form-item>
      <el-form-item label="统一社会信用代码" prop="unifiedSocialCreditCode">
        <el-input
          v-model="dataForm.unifiedSocialCreditCode"
          size="medium"
          clearable
        />
      </el-form-item>
      <el-form-item label="注册日期" prop="registrationDate">
        <el-date-picker
          v-model="dataForm.registrationDate"
          type="date"
          default-value="2020-01-01"
          placeholder="请选择注册日期"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="medium" @click="visible = false">取消</el-button>
        <el-button type="primary" size="medium" @click="dataFormSubmit"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data: function () {
    return {
      visible: false,
      dataForm: {
        id: null,
        companyNameCn: null,
        companyNameEn: null,
        address: null,
        unifiedSocialCreditCode: null,
        registrationDate: null,
        legalRepresentative: null,
      },
      type: null,
      userList: null,
      loading: false,
      dataRule: {},
      debounceSearch: null,
    };
  },
  mounted() {},
  methods: {
    init: function (id) {
      let that = this;
      that.type = id ? "update" : "add";
      that.dataForm.id = id || null;
      that.visible = true;
      that.$nextTick(() => {
        that.$refs["dataForm"].resetFields();
        if (that.dataForm.id) {
          this.$http(`company/info/${id}`, "GET", null, true, (res) => {
            that.dataForm = res;
          });
        }
      });
    },
    dataFormSubmit: function () {
      let that = this;
      that.loading = true;
      that.$refs["dataForm"].validate(function (valid) {
        if (valid) {
          /*  if (that.type === "add") {
            that.save();
          } else {
            that.updateRole();
          } */
          that.save();
        }
      });
      that.loading = false;
    },
    save() {
      let that = this;
      let data = {
        id: that.dataForm.id,
        companyNameCn: that.dataForm.companyNameCn,
        companyNameEn: that.dataForm.companyNameEn,
        address: that.dataForm.address,
        unifiedSocialCreditCode: that.dataForm.unifiedSocialCreditCode,
        registrationDate: that.dataForm.registrationDate,
        legalRepresentative: that.dataForm.legalRepresentative,
      };
      that.$http(`company/update`, "POST", data, true, function (resp) {
        that.$message({
          message: "操作成功",
          type: "success",
          duration: 1200,
        });
        that.visible = false;
        that.$emit("refreshDataList");
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
