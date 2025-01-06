<template>
	<el-dialog
		:title="!dataForm.id ? '新增' : '修改'"
		:close-on-click-modal="false"
		v-model="visible"
		width="450px"
    v-loading="loading"
	>
		<el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="80px">
			<el-form-item label="名称" prop="name">
				<el-input v-model="dataForm.name" size="medium" clearable />
			</el-form-item>
			<el-form-item label="权限" prop="permissions">
				<el-select
					v-model="dataForm.permissions"
					size="medium"
					placeholder="选择权限"
					style="width: 100%;"
					multiple
					clearable
				>
					<el-option
						v-for="one in permissionList"
						:key="one.id"
						:label="one.moduleName+'/'+one.actionName"
						:value="one.id"
					></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="dataForm.desc" size="medium" clearable />
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
				name: null,
        permissions:null,
        desc:""
			},
      type:null,
      permissionList:null,
      loading:false,
			dataRule: {
				name: [{ required: true, message: '名称不能为空' }],
        permissions: [{ required: true, message: '权限不能为空' }],
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
				that.$http('admin/permissions', 'GET', null, true, function(resp) {
					that.permissionList = resp;

				});
				if (that.dataForm.id) {
					that.$http('admin/role/'+id, 'GET', null, true, function(resp) {
						that.dataForm.name = resp.name;
						that.dataForm.permissions = resp.permissions.map(Number);
            if(that.dataForm.permissions.includes(0)){
              that.$message({
                message: '无法修改超级管理员',
                type: 'warning',
                duration: 1200
              });
              that.visible=false
            }
						that.dataForm.desc = resp.desc;
					});
				}
			});
		},
		dataFormSubmit:function(){
			let that=this
      that.loading=true
			that.$refs["dataForm"].validate(function(valid){
        if(valid){
          if(that.type==='add'){
            that.addRole()
          }
          else {
            that.updateRole()
          }
        }
			})
      that.loading=false
		},
    addRole(){
      let that=this
      let data = {
        name: that.dataForm.name,
        permissions: that.dataForm.permissions,
        desc:that.dataForm.desc,
      };
      that.$http(`admin/role`,"POST",data,true,function(resp){
        that.$message({
          message: '操作成功',
          type: 'success',
          duration: 1200
        });
        that.visible=false
        that.$emit('refreshDataList');
      });
    },
    updateRole(){
      let that=this
      let data = {
        id:that.dataForm.id,
        name: that.dataForm.name,
        permissions: that.dataForm.permissions,
        desc:that.dataForm.desc,
      };
      that.$http(`admin/role/update`,"POST",data,true,function(resp){
        that.$message({
          message: '操作成功',
          type: 'success',
          duration: 1200
        });
        that.visible=false
        that.$emit('refreshDataList');
      });

    }
	},
};
</script>

<style lang="less" scoped>
</style>
