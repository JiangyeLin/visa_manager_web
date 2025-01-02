<template>
	<el-dialog
		:title="!dataForm.id ? '新增' : '修改'"
		:close-on-click-modal="false"
		v-model="visible"
		width="450px"
    v-loading="loading"
	>
		<el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="80px">
			<el-form-item label="门店名称" prop="name">
				<el-input v-model="dataForm.name" size="medium" clearable />
			</el-form-item>
      <el-form-item label="负责人" prop="principalId">
        <el-select
            v-model="dataForm.principalId"
            size="medium"
            placeholder="查询负责人姓名"
            style="width: 100%;"
            filterable
            remote
            remote-show-suffix
            :remote-method="remoteMethod"
        >
          <el-option
              v-for="one in userList"
              :key="one.id"
              :label="one.userName"
              :value="one.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="dataForm.address" size="medium" clearable />
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input v-model="dataForm.longitude" size="medium" clearable />
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input v-model="dataForm.latitude" size="medium" clearable />
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
        principalId:null,
        longitude:null,
        latitude:null,
			},
      type:null,
      userList:null,
      loading:false,
			dataRule: {
        address:[{required:true,message:'地址不能为空'}],
				name: [{ required: true, message: '名称不能为空' }],
        principalId: [{ required: true, message: '负责人不能为空' }],
        longitude:[{required:true,pattern:'^[-+]?((1[0-7]\\d|[1-9]?\\d)(\\.\\d+)?|180(\\.0+)?)$',message:'经度格式错误'}],
        latitude:[{required:true,pattern:'^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?)$',message:'纬度格式错误'}]
			}
		};
	},
	methods: {
    // 防抖函数
    debounce(fn, delay) {
      let timer = null;
      return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      };
    },
    remoteMethod(value){
      let that = this;
      if(value)
      that.$http('admin/user/search/'+value, 'GET', null, true, function(resp) {
        that.userList=resp
      });
      else{
        that.userList=null
      }
    },
		init: function(id) {
			let that = this;
      that.type = id?'update':'add';
			that.dataForm.id = id || null;
			that.visible = true;
			that.$nextTick(() => {
				that.$refs['dataForm'].resetFields();
				if (that.dataForm.id) {
					that.$http('admin/role/'+id, 'GET', null, true, function(resp) {
						that.dataForm.name = resp.name;
						that.dataForm.permissions = resp.permissions.map(Number);
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
            that.addStore()
          }
          else {
            that.updateRole()
          }
        }
			})
      that.loading=false
		},
    addStore(){
      let that=this
      let data = {
        name: that.dataForm.name,
        address:that.dataForm.address,
        longitude: that.dataForm.longitude,
        latitude:that.dataForm.latitude,
        principalId:that.dataForm.principalId
      };
      that.$http(`admin/store`,"POST",data,true,function(resp){
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
      that.$http(`admin/role`,"PUT",data,true,function(resp){
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
