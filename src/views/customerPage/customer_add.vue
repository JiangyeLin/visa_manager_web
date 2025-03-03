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
      <el-row span="24">
        <el-col>
          <el-form-item label="护照照片" prop="photo">
            <el-upload
              drag
              :show-file-list="false"
              :on-change="handleTempPreview"
              :http-request="uploadPassport"
              :before-upload="beforeUpload"
              class="custom-upload"
              action="#"
              :disabled="tempImageURL"
            >
              <div v-if="tempImageURL" class="image-container">
                <el-image
                  ref="previewImageRef"
                  :src="tempImageURL"
                  :hide-on-click-modal="true"
                  fit="cover"
                  class="preview-image"
                  :preview-src-list="[tempImageURL]"
                />
                <div class="action-overlay">
                  <i
                    class="el-icon-zoom-in"
                    @click.stop="handleImagePreview"
                  ></i>
                  <i class="el-icon-delete" @click.stop="handleRemoveImage"></i>
                </div>
              </div>

              <div v-if="!tempImageURL" class="upload-text-container">
                <i class="el-icon-UploadFilled"></i>
                <div class="el-upload__text">
                  <em>点击按钮</em>
                  或拖拽护照图片至此处上传
                </div>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 中文名字段：姓 + 名 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="dataForm.name" size="medium" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phoneNumber">
            <el-input v-model="dataForm.phoneNumber" size="medium" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
              <el-option label="男" value="M" />
              <el-option label="女" value="F" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国籍" prop="nationality">
            <el-input v-model="dataForm.nationality" size="medium" clearable />
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
        <el-col :span="12">
          <el-form-item label="出生地点" prop="birthPlace">
            <el-input
              v-model="dataForm.birthPlace"
              placeholder="请输入出生地"
              size="medium"
              clearable
            />
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
        <el-col :span="12">
          <el-form-item label="签发地" prop="passportIssuePlace">
            <el-input
              v-model="dataForm.passportIssuePlace"
              placeholder="请输入护照签发地"
              size="medium"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 护照有效期至 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="签发日期" prop="passportIssueDate">
            <el-date-picker
              v-model="dataForm.passportIssueDate"
              type="date"
              placeholder="选择日期"
              size="medium"
              clearable
            />
          </el-form-item>
        </el-col>

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
      <el-form-item label="所属公司" prop="principalId">
        <el-select
          v-model="dataForm.companyId"
          size="medium"
          placeholder="查询所属公司"
          style="width: 100%"
          filterable
          remote
          remote-show-suffix
          :remote-method="debounceSearch"
          clearable
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.companyNameCn"
            :value="item.id"
          ></el-option>
        </el-select>
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
import COS from "cos-js-sdk-v5";
import { debounce } from "../../utils";
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: null,

        name: null, //姓名
        familyName: null, // 姓
        givenName: null, // 名
        gender: null, // 性别
        phoneNumber: null, // 手机号

        nationality: null, //国籍

        passportNumber: null, // 护照编号
        passportValidity: null, // 护照有效期
        passportIssuePlace: null, //护照签发地
        passportIssueDate: null, //护照签发时间

        birthDate: null, // 出生日期
        birthPlace: null, // 出生地点

        photo: null, // 图片链接

        companyId: null, //所属公司
      },

      type: null,
      loading: false,
      dataRule: {},
      debounceSearch: null,

      tempImageURL: null,
      previewSrcList: [],

      companyList: [],

      tempCredentials: {
        tmpSecretId: null,
        tmpSecretKey: null,
        sessionToken: null,
        startTime: null,
        expiredTime: null,

        bucket: "visa-1316966592",
        region: "ap-guangzhou", // COS 所在的区域
      },
    };
  },
  mounted() {
    this.debounceSearch = debounce(this.remoteMethod, 300);
    this.remoteMethod(null);
  },
  methods: {
    // 初始化方法
    init(id) {
      this.type = id ? "update" : "add";
      this.dataForm.id = id || null;
      this.visible = true;
      this.tempImageURL = null;
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

    //获取临时密钥
    getTemporaryCredentials() {
      return new Promise((resolve, reject) => {
        // 假设这里你会通过接口获取临时密钥信息
        this.$http("cos/getCredential", "GET", null, true, (resp) => {
          this.tempCredentials.sessionToken = resp.credentials.sessionToken;
          this.tempCredentials.tmpSecretId = resp.credentials.tmpSecretId;
          this.tempCredentials.tmpSecretKey = resp.credentials.tmpSecretKey;
          this.tempCredentials.startTime = resp.startTime;
          this.tempCredentials.expiredTime = resp.expiredTime;

          this.tempCredentials.bucket = "visa-1316966592";
          this.tempCredentials.region = "ap-chongqing"; // COS 所在的区域

          resolve();
        });
      });
    },

    handleImagePreview() {
      // 触发 el-image 的点击事件以显示预览
      if (this.$refs.previewImageRef) {
        this.$refs.previewImageRef.clickHandler();
      }
    },
    handleTempPreview(file) {
      this.tempImageURL = URL.createObjectURL(file.raw);
    },
    // 限制上传文件类型为图片
    beforeUpload(file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        this.$message.error("只能上传图片文件!");
      }
      return isImage;
    },

    //远程查找所属公司
    remoteMethod(value) {
      let that = this;
      let data = {
        keyword: value,
      };
      that.$http("company/list", "POST", data, true, function (resp) {
        that.companyList = resp.records;
      });
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
      this.$http("customer/update", "POST", data, true, () => {
        this.$message({
          message: "操作成功",
          type: "success",
          duration: 1200,
        });
        this.visible = false;
        this.$emit("refreshDataList");
      });
    },
    handleRemoveImage() {
      this.tempImageURL = null;
      this.dataForm = {};
    },

    /**
     * 上传护照
     * @param file
     */
    uploadPassport(file) {
      this.getTemporaryCredentials()
        .then(() => {
          this.uploadFile(file);
        })
        .catch((error) => {
          console.error("获取临时密钥失败", error);
        });
    },
    uploadFile(file) {
      console.log("开始上传文件");
      console.log(this.tempCredentials.tmpSecretId);
      console.log(file.file.name);
      const cos = new COS({
        SecretId: this.tempCredentials.tmpSecretId,
        SecretKey: this.tempCredentials.tmpSecretKey,
        SecurityToken: this.tempCredentials.sessionToken,
        StartTime: this.tempCredentials.startTime,
        ExpiredTime: this.tempCredentials.expiredTime,
      });

      cos
        .uploadFile({
          Bucket: this.tempCredentials.bucket,
          Region: this.tempCredentials.region,
          Key: this.generateUniqueKey(file.file.name),
          Body: file.file, // 上传文件对象
        })
        .then((data) => {
          this.$message.success("上传成功!");
          this.ocrPassport("https://" + data.Location);
        })
        .catch((err) => {
          console.log("上传失败", err);
        });
    },

    /**
     * 护照识别ocr
     * @param url
     */
    ocrPassport(url) {
      let data = {
        passportUrl: url, // 护照url
      };
      this.$http("cos/passportOcr", "POST", data, true, (resp) => {
        this.dataForm = resp;
        this.$message.success("护照识别成功!");
        this.dataForm.photo = url;
      }).catch((error) => {
        console.error("OCR识别失败", error);
        this.$message.error("护照识别失败，请手动填写信息");
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
    generateUniqueKey(fileName) {
      const timestamp = Date.now(); // 获取当前时间戳
      const randomString = Math.random().toString(36).substring(2, 8); // 生成6位随机字符串
      const extension = fileName.split(".").pop(); // 获取文件扩展名
      return `${timestamp}_${randomString}.${extension}`;
    },
  },
};
</script>

<style lang="less" scoped>
.image-container {
  position: relative; /* 作为绝对定位子元素的参考 */
  display: inline-block;
  width: 100%; /* 确保容器宽度与图片一致 */
  height: 100%;
}

.preview-image {
  width: 100%;
  height: 100%; /* 固定高度或根据需求调整 */
  display: block; /* 避免图片下方间隙 */
}

.action-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  padding-bottom: 30px;
  justify-content: center;

  background: rgba(0, 0, 0, 0.3); /* 半透明背景（可选） */
  opacity: 0; /* 默认隐藏 */
  transition: opacity 0.3s;
  z-index: 2; /* 确保按钮在图片上层 */
}

/* 悬停时显示操作按钮 */
.image-container:hover .action-overlay {
  opacity: 1;
}

/* 调整图标样式*/
.el-icon-zoom-in,
.el-icon-delete {
  color: white;
  font-size: 24px;
  background: rgba(0, 0, 0, 0.5);
  padding: 6px;
  border-radius: 50%;
  margin: 8px;
  cursor: pointer;
  z-index: 3; /* 确保按钮图标在最上层 */
}

.custom-upload :deep(.el-upload) {
  width: 100%;
  height: 260px;
  display: block;
}
.custom-upload :deep(.el-upload-dragger) {
  width: 100%;
  height: 100%;
}
.upload-text-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}
</style>
