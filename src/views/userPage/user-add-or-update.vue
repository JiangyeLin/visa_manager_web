<template>
	<el-dialog
		:title="!dataForm.id ? '新增' : '修改'"
		:close-on-click-modal="false"
		v-model="visible"
		width="450px"
	>
		<el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="80px">
			<el-form-item label="用户名" prop="userName">
				<el-input v-model="dataForm.userName" size="medium" clearable :disabled="type==='update'"/>
			</el-form-item>
      <el-form-item label="密码" v-if="type==='add'">
        <el-input v-model="dataForm.passWord" size="medium" :disabled="true"  clearable />
      </el-form-item>
			<el-form-item label="角色" prop="roleIds">
				<el-select
					v-model="dataForm.roleIds"
					size="medium"
					placeholder="选择角色"
					style="width: 100%;"
					multiple
					clearable
				>
					<el-option
						v-for="one in roleList"
						:key="one.id"
						:label="one.name"
						:value="one.id"
            :disabled="one.name==='admin'"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="门店" prop="storeId">
				<el-select
					v-model="dataForm.storeId"
					size="medium"
					placeholder="选择门店"
					style="width: 100%;"
					clearable
				>
					<el-option v-for="one in storeList" :key="one.id" :label="one.storeName" :value="one.id" />
				</el-select>
			</el-form-item>
      <el-form-item label="电话" prop="phoneNumber">
        <el-input v-model="dataForm.phoneNumber" size="medium" clearable />
      </el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button size="medium" @click="visible = false">取消</el-button>
				<el-button type="primary" size="medium" @click="dataFormSubmit">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>

export default {
	data: function() {
		return {
			visible: false,
			dataForm: {
				id: null,
				userName: null,
				phoneNumber: null,
        roleIds: null,
				storeId: null,
        passWord:'88888888'
			},
      type:null,
			roleList: [],
      storeList: [],
			dataRule: {
				userName: [{ required: true, pattern: '^.{1,20}$', message: '用户名格式错误' }],
				// phoneNumber: [{  pattern: '^1\\d{10}$', message: '电话格式错误' }],
        roleIds: [{ required: true, message: '角色不能为空' }],
			}
		};
	},
	methods: {
		init: function(id) {
			let that = this;
      that.type = id?'update':'add';
			that.dataForm.id = id || null;
			that.visible = true;
			that.$nextTick(() => {
				that.$refs['dataForm'].resetFields();
				that.$http('admin/role/all', 'GET', null, true, function(resp) {
					that.roleList = resp;
          that.$http('admin/store/list', 'GET', null, true, function(resp) {
            that.storeList = Object.entries(resp).map(([key, value]) => {
              return { id: key, storeName: value };
            });
          if (that.dataForm.id) {
            that.$http('admin/user/'+that.dataForm.id, 'GET', null, true, function(resp) {
              that.dataForm.userName = resp.userName;
              that.dataForm.phoneNumber = resp.phoneNumber;
              let store=that.storeList.find(item => item.storeName === resp.storeName)
              that.dataForm.storeId= store.id;
              that.dataForm.roleIds=resp.roles.map(Number)
            });
          }
        });
				});
			});
		},
    resetFields: function() {
      this.dataForm.userName = null;
      this.dataForm.phoneNumber = null;
      this.dataForm.roleIds = null;
      this.dataForm.storeId = null;
    },
		dataFormSubmit:function(){
			let that=this
			that.$refs["dataForm"].validate(function(valid){
				if(valid){
          if(that.type==='add'){
            that.addUser()
          }
          else {
            that.updateUser()
          }
				}
			})
		},
    addUser(){
      let that=this
      let data = {
        userName: that.dataForm.userName,
        roleIds: that.dataForm.roleIds,
        storeId:that.dataForm.storeId,
        phoneNumber:that.dataForm.phoneNumber
      };
      that.$http(`admin/user`,"POST",data,true,function(resp){
        that.$message({
          message: '操作成功',
          type: 'success',
          duration: 1200
        });
        that.visible=false
        that.$emit('refreshDataList');
      });
    },
    updateUser(){
      let that=this
      let data = {
        id:that.dataForm.id,
        roleIds: that.dataForm.roleIds,
        storeId:that.dataForm.storeId,
        phoneNumber:that.dataForm.phoneNumber
      };
      that.$http(`admin/user/update`,"POST",data,true,function(resp){
        that.$message({
          message: '操作成功',
          type: 'success',
          duration: 1200
        });
        that.visible=false
        that.$emit('refreshDataList');
      });

    }
	}
};
</script>

<style lang="less" scoped>
</style>
