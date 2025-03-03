<template>
  <el-row>
    <!-- 左侧树形组件（公司信息） -->
    <el-col :span="6" style="height: 100vh; overflow-y: auto; padding: 8px">
      <el-tree
        :data="companyTreeData"
        :props="treeProps"
        @node-click="onNodeClick"
        accordion
        highlight-current
        node-key="id"
        ref="tree"
        :expand-on-click-node="false"
        style="max-height: 100%; overflow-y: auto"
      >
      </el-tree>
    </el-col>

    <!-- 右侧表格组件（客户数据） -->
    <el-col :span="18" style="height: 100vh; overflow-y: auto; padding: 10px">
      <el-form
        :inline="true"
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
      >
        <el-form-item>
          <el-input
            v-model="dataForm.keyword"
            placeholder="请输入要查询的关键字"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="searchHandle()"
            >查询</el-button
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

      <!-- 客户数据表格 -->
      <el-table
        :data="dataList"
        border
        stripe
        v-loading="dataListLoading"
        :cell-style="{ padding: '4px 0' }"
        @cell-dblclick="doubleClick"
        size="medium"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        />
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="姓名"
          min-width="170"
        >
        </el-table-column>
        <el-table-column
          prop="familyName"
          header-align="center"
          align="center"
          label="姓"
          min-width="100"
        />
        <el-table-column
          prop="givenName"
          header-align="center"
          align="center"
          label="名"
          min-width="100"
        />
        <el-table-column
          prop="companyName"
          header-align="center"
          align="center"
          label="所属公司"
          min-width="150"
        >
        </el-table-column>
        <el-table-column
          prop="gender"
          header-align="center"
          align="center"
          label="性别"
          min-width="50"
        />
        <el-table-column
          prop="phoneNumber"
          header-align="center"
          align="center"
          label="手机号"
          min-width="170"
        />
        <el-table-column
          prop="passportNumber"
          header-align="center"
          align="center"
          label="护照编号"
          min-width="100"
        />
        <el-table-column
          prop="passportIssuePlace"
          header-align="center"
          align="center"
          label="签发地"
          min-width="100"
        />
        <el-table-column
          prop="passportIssueDate"
          header-align="center"
          align="center"
          label="签发日期"
          min-width="100"
        />
        <el-table-column
          prop="passportValidity"
          header-align="center"
          align="center"
          label="护照有效期至"
          min-width="140"
        />
        <el-table-column
          prop="birthDate"
          header-align="center"
          align="center"
          label="出生日期"
          min-width="100"
        />
        <el-table-column
          prop="birthPlace"
          header-align="center"
          align="center"
          label="出生地"
          min-width="100"
        />
        <el-table-column fixed="right" label="操作" align="center">
          <template #default="scope">
            <el-popconfirm
              title="确认删除此客户?"
              @confirm="deleteCustomer(scope.row.id)"
            >
              <template #reference>
                <el-button link type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[20, 50, 100]"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-col>
  </el-row>

  <!-- 新增或修改公司信息弹窗 -->
  <customerAdd
    v-if="addOrUpdateVisible"
    ref="customerAdd"
    @refreshDataList="loadDataList"
  ></customerAdd>
</template>
<script>
import { formatDateTime } from "../../utils";
import customerAdd from "./customer_add.vue";

export default {
  components: {
    customerAdd,
  },
  data: function () {
    return {
      // 左侧公司树的数据
      companyTreeData: [], // 存储公司数据
      treeProps: {
        label: "companyNameCn", // 树节点的标签（公司名称）
        children: "children", // 树的子节点字段
      },
      dataForm: {
        order: null,
        orderField: null,
        keyword: null,
      },
      dataList: [], // 存储客户列表数据
      pageIndex: 1, // 当前页码
      pageSize: 20, // 每页数据条数
      totalCount: 0, // 总数据量
      dataListLoading: false, // 表格加载状态
      dataRule: {},
      addOrUpdateVisible: false,
      selectedCompanyId: null, // 当前选中的公司ID
    };
  },
  computed: {
    // 将公司树数据转换为 id -> companyName 的映射
    companyNameMap() {
      const map = {};
      const traverse = (nodes) => {
        nodes.forEach((node) => {
          map[node.id] = node.companyNameCn; // 假设 companyNameCn 是公司名称字段
          if (node.children && node.children.length > 0) {
            traverse(node.children);
          }
        });
      };
      traverse(this.companyTreeData);
      return map;
    },
  },
  methods: {
    // 加载公司树
    loadCompanyTree() {
      this.$http("company/list", "POST", null, true, (resp) => {
        this.companyTreeData = resp.records;
      });
    },

    // 左侧树节点点击事件，加载该公司下的客户列表
    onNodeClick(nodeData, node, component) {
      if (this.selectedCompanyId == nodeData.id) {
        //取消选中
        this.selectedCompanyId = null;
        //this.$refs.tree.setCheckedKeys([])
        this.$refs.tree.setCurrentKey(null);
      } else {
        this.selectedCompanyId = nodeData.id;
      }

      this.pageIndex = 1; // 重置分页到第一页
      this.loadDataList(); // 加载选中公司下的客户数据
    },

    addOrUpdate(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.customerAdd.init(id);
      });
    },

    // 加载客户列表数据
    loadDataList() {
      this.dataListLoading = true;
      let data = {
        companyId: this.selectedCompanyId, // 传递公司ID
        keyword: this.dataForm.keyword,
        page: this.pageIndex,
        size: this.pageSize,
        orderField: this.dataForm.orderField,
        order: this.dataForm.order,
      };

      this.$http("customer/list", "POST", data, true, (resp) => {
        this.dataList = resp.records.map((item) => {
          return {
            ...item,
            birthDate: formatDateTime(item.birthDate),
            passportIssueDate: formatDateTime(item.passportIssueDate),
            passportValidity: formatDateTime(item.passportValidity),
            companyName: this.companyNameMap[item.companyId] || null,
          };
        });

        this.totalCount = resp.total;
        this.dataListLoading = false;
      });
    },

    //删除客户
    deleteCustomer(id) {
      let that = this;
      that.dataListLoading = true;
      let data = {
        id: id,
      };

      that.$http("customer/delete", "DELETE", data, true, function (resp) {
        that.$message({
          message: "操作成功",
          type: "success",
          duration: 1200,
        });
        that.dataListLoading = false;

        that.loadDataList(); // 刷新表格数据
      });
    },

    doubleClick(row, column, cell, event) {
      // 双击复制
      const textToCopy = event.target.innerText;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          this.$message({ message: "复制成功", type: "success" }); // 提示
        })
        .catch((error) => {});
    },
    searchHandle() {
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

    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.loadDataList();
    },

    currentChangeHandle(val) {
      this.pageIndex = val;
      this.loadDataList();
    },
  },

  mounted() {
    this.loadCompanyTree(); // 初始化加载公司树
    this.loadDataList(); // 加载数据（可选，具体看是否需要在初始化时加载）
  },
};
</script>

<style scoped>
/* 左侧树形组件优化样式 */
.el-col {
  padding: 20px;
}

.el-tree {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.el-tree .el-tree-node__content {
  padding: 12px 16px; /* 增加内边距 */
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 8px;
  line-height: 36px; /* 增加行高 */
  font-size: 14px; /* 可选：根据需要调整字体大小 */
}

.el-tree .el-tree-node__content:hover {
  background-color: #e6f7ff;
}

.el-tree .el-tree-node__content.is-current {
  background-color: #1890ff;
  color: white;
}

/* 优化左侧树的高亮和选中效果 */
.el-tree .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1890ff;
  color: white;
}

/* 右侧表格区域优化 */
.el-col {
  padding: 10px;
  overflow: auto;
  background-color: #f9f9f9;
  border-radius: 4px;
}

/* 树形和表格之间的间距 */
.el-row {
  margin-left: 0;
  margin-right: 0;
}

/* 自定义表格的样式 */
.el-table {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
