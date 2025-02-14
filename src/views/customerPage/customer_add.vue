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
      label-width="120px"
    >
      <!-- 上传图片 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="护照照片" prop="imageUrl">
            <el-upload
              class="upload-demo"
              drag
              :before-upload="beforeUpload"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                <em>点击按钮</em>
                或拖拽护照图片至此处上传
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 中文名字段：姓 + 名 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓" prop="familyName">
            <el-input v-model="dataForm.familyName" size="medium" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名" prop="givenName">
            <el-input v-model="dataForm.givenName" size="medium" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 性别字段 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select
              v-model="dataForm.gender"
              size="medium"
              placeholder="请选择性别"
              clearable
            >
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 手机号 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号" prop="phoneNumber">
            <el-input v-model="dataForm.phoneNumber" size="medium" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 护照编号 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="护照编号" prop="passportNumber">
            <el-input
              v-model="dataForm.passportNumber"
              size="medium"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 护照有效期至 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="护照有效期至" prop="passportValidity">
            <el-date-picker
              v-model="dataForm.passportValidity"
              type="date"
              placeholder="选择日期"
              size="medium"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 出生日期 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birthDate">
            <el-date-picker
              v-model="dataForm.birthDate"
              type="date"
              placeholder="选择出生日期"
              size="medium"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <template #footer>
        <span class="dialog-footer">
          <el-button size="medium" @click="visible = false">取消</el-button>
          <el-button type="primary" size="medium" @click="dataFormSubmit"
            >确定</el-button
          >
        </span>
      </template>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: null,
        familyName: null, // 姓
        givenName: null, // 名
        gender: null, // 性别
        phoneNumber: null, // 手机号
        passportNumber: null, // 护照编号
        passportValidity: null, // 护照有效期
        birthDate: null, // 出生日期
        imageUrl: null, // 图片链接
      },
      type: null,
      userList: null,
      loading: false,
      dataRule: {},
      debounceSearch: null,
    };
  },
  methods: {
    // 初始化方法
    init(id) {
      this.type = id ? "update" : "add";
      this.dataForm.id = id || null;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http("admin/role/" + id, "GET", null, true, (resp) => {
            this.dataForm.name = resp.name;
            this.dataForm.permissions = resp.permissions.map(Number);
            this.dataForm.desc = resp.desc;
          });
        }
      });
    },
    
    // 上传图片成功回调
    handleUploadSuccess(response) {
      console.log("上传成功")
      this.dataForm.imageUrl = response.url;
    },

    // 限制上传文件类型为图片
    beforeUpload(file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        this.$message.error("只能上传图片文件!");
      }
      return isImage;
    },

    // 提交表单
    dataFormSubmit() {
      this.loading = true;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.type === "add") {
            this.save();
          } else {
            this.updateRole();
          }
        }
      });
      this.loading = false;
    },

    // 保存数据
    save() {
      const data = { ...this.dataForm };
      this.$http("company/update", "POST", data, true, () => {
        this.$message({
          message: "操作成功",
          type: "success",
          duration: 1200,
        });
        this.visible = false;
        this.$emit("refreshDataList");
      });
    },

    // 更新数据
    updateRole() {
      const data = { ...this.dataForm };
      this.$http("admin/role", "PUT", data, true, () => {
        this.$message({
          message: "操作成功",
          type: "success",
          duration: 1200,
        });
        this.visible = false;
        this.$emit("refreshDataList");
      });
    },
  },
};
</script>

<style lang="less" scoped>

</style>
