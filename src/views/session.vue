<template>
    <div>
        <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm">
            <el-form-item>
                <el-date-picker
                    v-model="dataForm.date"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="日期选择"
                    :size="size"
                    :disabled-date="disabledDate"
                    @change="dateChange"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    size="medium"
                    type="primary"
                    @click="tempHandle()"
                >
                    生成临时场次
                </el-button>
            </el-form-item>
        </el-form>

        <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            cell-style="padding: 4px 0"
            size="medium"
            style="width: 100%;"
            highlight-current-row
        >
            <el-table-column
                type="selection"
                :selectable="selectable"
                header-align="center"
                align="center"
                width="50"
            />
            <el-table-column label="个人临时场次二维码" min-width="170" align="center" >
				<template #default="scope">
					<el-popover placement="bottom" trigger="click" :width="226">
						<template #reference>
							<el-button type="text" @click="ShowQr(scope.row.id)">显示</el-button>
					    </template>
					        <vue-qr :text="qrText" size="200"></vue-qr>
					</el-popover>
				</template>
            </el-table-column>
            <el-table-column prop="date" header-align="center" align="center" label="日期" min-width="170" fixed/>
			
			<el-table-column header-align="center" align="center" label="个人是否开放" min-width="140" fixed="">
				<template #default="scope">
				    <span>{{scope.row.isPersonalOpen? '是': '否'}}</span>
					<el-switch style="margin-left: 10px;" v-model="scope.row.isPersonalOpen" @change="Openswitch(scope.row)"/>
				</template>
			</el-table-column>
			
			<el-table-column header-align="center" align="center" label="团队是否开放" min-width="140" fixed="">
				<template #default="scope">
				    <span>{{scope.row.isTeamOpen? '是': '否'}}</span>
					<el-switch style="margin-left: 10px;" v-model="scope.row.isTeamOpen" @change="Openswitch(scope.row)"/>
				</template>
			</el-table-column>
			
            <el-table-column prop="startTime" header-align="center" align="center" label="开始时间" min-width="170" fixed/>
            <el-table-column prop="endTime" header-align="center" align="center" label="结束时间" min-width="170" fixed/>
            <el-table-column header-align="center" align="center" label="已预约成人人数" min-width="140">
                <template #default="scope">
                    <span>{{ scope.row.adultNumber }}人</span>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="已预约儿童人数" min-width="140">
                <template #default="scope">
                    <span>{{ scope.row.childNumber }}人</span>
                </template>
            </el-table-column> 
            <el-table-column header-align="center" align="center" label="已核销/总人数" min-width="140">
                <template #default="scope">
                    <span>{{ scope.row.verifiedNumber }}/{{ scope.row.totalNumber }}人</span>
                </template>
            </el-table-column> 




            <el-table-column header-align="center" align="center" label="剩余可预约人数" min-width="140">
                <template #default="scope">
                    <el-input-number v-model="dataList[scope.$index].remaining" :min="0" :max="1000" @change="remainingChange(dataList[scope.$index].remaining,dataList[scope.$index].id)" />
                </template>
            </el-table-column>
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
import AddOrUpdate from './dept-add-or-update.vue';
import * as XLSX from 'xlsx'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'

export default {
    components: {
        AddOrUpdate,
        VueQr
        },
    data: function() {
        return {
            dataForm: {
                date: null,
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            dataRule: {
                deptName: [
                    { required: false, pattern: '^[a-zA-Z0-9\u4e00-\u9fa5]{1,10}$', message: '部门名称格式错误' }
                ]
            },
            qrText:'https://example.com'
        };
    },
    methods: {
        loadDataList: function() {
            let that = this;
            that.dataListLoading = true;

            let data = {
                date: that.dataForm.date,
                page: that.pageIndex,
                size: that.pageSize
            };

            that.$http('admin/session/page', 'POST', data, true, function(resp) {
                that.dataList = resp.records;
                that.totalCount = resp.total;
                that.dataListLoading = false;
                console.log(that.dataList);
            });
        },
        searchHandle: function() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$refs['dataForm'].clearValidate();
                    if (this.dataForm.deptName == '') {
                        this.dataForm.deptName = null;
                    }
                    if (this.pageIndex != 1) {
                        this.pageIndex = 1;
                    }
                    this.loadDataList();
                } else {
                    return false;
                }
            });
        },
        selectable: function(row, index) {
            if (row.emps > 0) {
                return false;
            }
            return true;
        },
        selectionChangeHandle: function(val) {
            this.dataListSelections = val;
        },
        sizeChangeHandle: function(val) {
            this.pageSize = val;
            this.pageIndex = 1;
            this.loadDataList();
        },
        currentChangeHandle: function(val) {
            this.pageIndex = val;
            this.loadDataList();
        },
   
        addHandle: function() {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init();
            });
        },
        updateHandle: function(id) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },
        dateChange(){
            this.loadDataList();
        },
        remainingChange(remaining,sessionId){

            let that=this

            let data={
                sessionId:sessionId,
                remaining:remaining
            }
            that.$http('admin/session/updateRemaining', 'POST', data, true, function(resp) {
                
            });
        },
        tempHandle(){
            let that=this
            that.$http('admin/session/insertByNow', 'POST', null, false, function(resp) { 

                that.$message({
								message: '操作成功',
								type: 'success',
								duration: 1200
							});
            });
        },
        ShowQr: function(id){
			 this.qrText = "https://dyyx.wzgxgs.com/#/pages/TemporaryReservePage/TemporaryReservePage?sessionId=" + id;
			// this.qrText = "http://192.168.1.236:8080/#/pages/TemporaryReservePage/TemporaryReservePage?sessionId=" + id;
		},
		Openswitch: function(valueRow){
			let that = this;
			let data = {
				sessionId: valueRow.id,
				isPersonalOpen: valueRow.isPersonalOpen,
				isTeamOpen: valueRow.isTeamOpen
			}
			that.$http('admin/session/updateIsOpen', 'POST', data, false, function(resp){
				that.$message({
								message: '操作成功',
								type: 'success',
								duration: 1200
							});
			})
		},
        disabledDate:function(date){
             
            return date.getTime() > Date.now()+2592000000;
        }
    },
    created: function() {
        this.loadDataList();
    }
};
</script>

<style>
 /* 选中某行时的背景色*/
 .el-table__body tr.current-row > td {
    background: rgb(197, 213, 255) !important;
  }
</style>
