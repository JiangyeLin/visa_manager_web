<template>
	<el-dialog
		:title="!dataForm.id ? '新增' : '修改'"
		:close-on-click-modal="false"
		v-model="visible"
		width="450px"
	>
		<el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="100px">
			<!-- <el-form-item label="场次选择" prop="sessionId">
				<el-select
					v-model="dataForm.sessionId"
					size="medium"
					placeholder="选择场次"
					style="width: 100%;"
					clearable
				>
					<el-option
						v-for="one in sessionList"
						:key="one.id"
						:label="one.date +' '+one.timeSlot"
						:value="one.id"
						:disabled="one.isAppo"
					></el-option>
				</el-select>
			</el-form-item> -->
			<el-form-item label="日期选择" prop="date">
				<el-date-picker v-model="dataForm.date" type="date" placeholder="请选择日期" value-format="YYYY-MM-DD"/>
			</el-form-item>
			<el-form-item label="开始时间" prop="startTime" >
				<el-time-picker v-model="dataForm.startTime" placeholder="请选择开始时间" value-format="HH-mm-ss" format="HH:mm" @change="setMinTimeRange"/>
			</el-form-item>
			<el-form-item label="结束时间" prop="endTime" >
				<el-time-picker 
					v-model="dataForm.endTime"
					placeholder="请选择结束时间"
					value-format="HH-mm-ss"
					:disabled-hours="disabledHours"
					:disabled-minutes="disabledMinutes"
					:disabled-seconds="disabledSeconds"
          format="HH:mm"
					/>
			</el-form-item>
			<el-form-item label="联系人姓名" prop="contactsName">
				<el-input v-model="dataForm.contactsName" size="medium" clearable />
			</el-form-item>
			<el-form-item label="联系号码" prop="contactsTel">
				<el-input v-model="dataForm.contactsTel" size="medium" clearable />
			</el-form-item>
			<el-form-item label="团队人数" prop="number">
				<el-input v-model="dataForm.number" size="medium" clearable />
			</el-form-item>
			<el-form-item label="团队名称" prop="organization">
				<el-input v-model="dataForm.organization" size="medium" clearable />
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
import dayjs from 'dayjs';
export default {
	data: function() {
		return {
			visible: false,
			dataForm: {
				date: null,
				startTime: null,
				endTime: null,
				contactsName: null,
				contactsTel: null,
				number: null,
				organization: null
			},
			sessionList: [],
			dataRule: {
				date: [{ required: true, message: '日期不能为空' }],
				startTime: [{ required: true, message: '开始时间不能为空' }],
				endTime: [{ required: true, message: '结束时间不能为空' }],
				contactsName: [{ required: true, message: '联系人不能为空' }],
				contactsTel: [{ required: true, pattern: '^1\\d{10}$', message: '电话格式错误' }],
				number: [{ required: true, message: '团队人数不能为空' }],
				organization: [{ required: true, message: '部门名称不能为空' }],
			},
			minHour: 0,
			minMinute: 0,
			minSecond: 0,
		};
	},
	methods: {
		init: function(id) {
			let that = this;
			that.dataForm.id = id || 0;
			that.visible = true;
			that.$nextTick(() => {
				that.$refs['dataForm'].resetFields();
				// that.$http('admin/session/adminReservableTeamSessionList', 'GET', null, true, function(resp) {
				// 	that.sessionList = resp;
				// });
			});
		},
		// dataFormSubmit:function(){
		// 	let that=this
		// 	that.$refs["dataForm"].validate(function(valid){
		// 		if(valid){
		// 			let data = {
		// 				sessionId: that.dataForm.sessionId,
		// 				contactsName: that.dataForm.contactsName,
		// 				contactsTel: that.dataForm.contactsTel,
		// 				number: that.dataForm.number,
		// 				organization:that.dataForm.organization
		// 			};
					
		// 			that.$http('admin/teamAppointment/adminInsetAppointment',"POST",data,true,function(resp){
						
		// 					that.$message({
		// 						message: '操作成功',
		// 						type: 'success',
		// 						duration: 1200
		// 					});
		// 					that.visible=false
		// 					that.$emit('refreshDataList');
						
					
		// 			});


		// 		}
		// 	})
		// },
		
		dataFormSubmit: function(){
			let that = this;
			that.$refs["dataForm"].validate(function(valid){
				if(valid){
					let data = {
						date: that.getFullDate(that.dataForm.date),
						startTime: that.getFullTime(that.dataForm.startTime),
						endTime: that.getFullTime(that.dataForm.endTime),
						contactsName: that.dataForm.contactsName,
						contactsTel: that.dataForm.contactsTel,
						number: that.dataForm.number,
						organization:that.dataForm.organization
					};

					
					that.$http("admin/teamAppointment/adminInsetAppointment", "POST", data, true, function(resp){
						that.$message({
							message: '操作成功',
							type: 'success',
							duration: 1200
						});
						that.visible = false
						that.$emit('refreshDataList');
					})
				}
			})
		},
		
		getFullDate: function(date){
			let year = date.getFullYear().toString();
			let month = (date.getMonth() + 1).toString();
			let day = date.getDate().toString();
			
			if(month.length == 1){
				month = '0' + month
			}
			if(day.length == 1){
				day = '0' + day
			}
			
			let fullDate = year + '-' + month + '-' + day;
			return fullDate;
		},
		
		getFullTime: function(time){
			let hour = time.getHours().toString();
			let minute = time.getMinutes().toString();
			// let second = time.getSeconds().toString();
      let second = '0';
			if(hour.length == 1){
				hour = '0' + hour
			}
			if(minute.length == 1){
				minute = '0' + minute
			}
			if(second.length == 1){
				second = '0' + second
			}
			
			let fullTime = hour + ':' + minute + ':' + second;
			return fullTime;
		},
		
		setMinTimeRange: function(value){
			this.dataForm.endTime = null;
			let hour = value.getHours();
			let minute = value.getMinutes();
			let second = value.getSeconds();
			this.minHour = hour;
			this.minMinute = minute;
			this.minSecond = second;
		},
		
		disabledHours: function(){
			if(this.minHour == 0){
				return null;
			}
			else if(this.minHour == 1){
				return [0];
			}
			else{
				return this.setRange(0, this.minHour - 1);
			}
		},
		
		disabledMinutes: function(hour){
			if(hour == this.minHour){
				if(this.minMinute == 0){
					return null;
				}
				else if(this.minHour == 1){
					return [0];
				}
				else{
					return this.setRange(0, this.minMinute - 1);
				}
			}
			else{
				return null;
			}
		},
		
		disabledSeconds: function(hour, minute){
			if(hour == this.minHour){
				if(minute == this.minMinute){
					if(this.minSecond == 0){
						return null;
					}
					else if(this.minSecond == 1){
						return [0];
					}
					else{
						return this.setRange(0, this.minSecond - 1);
					}
				}
				else{
					return null;
				}
			}
			else{
				return null;
			}
		},
		
		setRange: function(start, end){
			let range = [];
			for(let index = start; index <= end; index++){
				range.push(index);
			}
			return range;
		}
	}
};
</script>

<style lang="less" scoped="scoped">
</style>
