<template>
    <div>
        <el-form :inline="true" :model="dataForm" ref="dataForm">
            <el-form-item>
                <el-date-picker
                    v-model="dataForm.date"
                    type="month"
                    placeholder="选择年"
                    value-format="yyyy-MM"
                    :size="size"
                    @change="monthChange"
                />
            </el-form-item>
			<el-form-item>
				<el-button size="medium" type="primary" @click="exportExcel('personal')">导出个人数据报表</el-button>
			</el-form-item>
			<el-form-item>
				<el-button size="medium" type="primary" @click="exportExcel('team')">导出团队数据报表</el-button>
			</el-form-item>
        </el-form>
		<div style="display: flex; justify-content: space-around;">
			<div ref="personalChart" style="width: 45%; height: 50vh;"></div>
			<div ref="teamChart" style="width: 45%; height: 50vh;"></div>
		</div>
    </div>
</template>

<script>
import { init } from 'echarts';
import { markRaw } from 'vue';
import * as XLSX from 'xlsx'
export default {
    data: function() {
        return {
            dataForm: {
                date:null
            },
            personal: null,
            team:null,
            personalChart :null,
            teamChart:null,
        };
    },
    methods: {
        loadDataList: function() {
            let that = this;
            let date = this.dataForm.date;
            let tmp = date.toString();

            const dateTmp = new Date(tmp);
            let yaer=dateTmp.getFullYear();

            let month=dateTmp.getMonth()+1;

            let data = {
                year:yaer,
                month:month
            };
            
            that.$http('admin/personalAppointment/bi/month', 'POST', data, false, function(resp) {
                that.personal = resp;
				console.log(that.personal);
            });
			
			that.$http('admin/teamAppointment/bi/month', 'POST', data, false, function(resp) {
			    that.team = resp;
				console.log(that.team);
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
        initEcharts:function(){
			let that = this;
			
            const personaloption = {
				title: [
					{
						left: "center",
						top: "bottom",
						text: "个人数据报表"
					}
				],
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
						type: 'shadow'
                    }
                },
                legend: {
                    data: ['成人人数','儿童人数']
                },
                xAxis: [
                    {
                        data: that.personal.xaxis,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                    type: 'value'
                    }
                ],
                series: [
                    {
                        name: '成人人数',
                        type: 'bar',
                        data: that.personal.adult,
                        stack: 'x',
                        label: {
                            show: true, // 显示 label
                            color: '#000', // 字体颜色
                            fontSize: 14 // 字体大小,
                        },
                        color:'#91CC75'
                    },
                    {
                        name: '儿童人数',
                        type: 'bar',
                        data: that.personal.child,
                        stack: 'x',
                        label: {
                            show: true, // 显示 label
                            color: '#000', // 字体颜色
                            fontSize: 14 // 字体大小,
                        },
                        color:'#FAE160'
                    },
                   
                ]
            };
            
			const teamOption = {
				title: [
					{
						left: "center",
						top: "bottom",
						text: "团队数据报表"
					}
				],
				tooltip: {
					trigger: 'item',
					axisPointer: {
						type: 'shadow'
					}
				},
				legend: {
					data: ['人数']
				},
				xAxis: [
					{
						data: that.team.xaxis,
						axisTick: {
							alignWithLabel: true
						}
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '人数',
						type: 'bar',
						data: that.team.data,
						stack: 'x',
						lable: {
							show: true,
							color: '#000',
							fontSize: 14
						},
						color: '#91CC75'
					}
				]
			}
			
			that.personalChart.setOption(personaloption);
			that.personalChart?.resize();
			window.addEventListener('resize', () => {
			    that.personalChart?.resize();
			});
			that.teamChart.setOption(teamOption);
			that.teamChart?.resize();
			window.addEventListener('resize',() => {
				that.teamChart?.resize();
			})
        },
        monthChange(){
            this.loadDataList();
            this.initEcharts();
        },
		exportExcel: function(type){
			let that = this;
			let jsonData = null;
			let tableData = null;
			let name = null;
			let firstRow = [''];
			
			switch(type){
				case 'personal':
					jsonData = that.personal;
					jsonData.xaxis.forEach(item => {
						firstRow.push(item);
					})
					tableData = [firstRow];
					
					let totalRow = ['总人数'];
					let adultRow = ['成人'];
					jsonData.adult.forEach(item => {
						adultRow.push(item);
						totalRow.push(item);
					})
					tableData.push(adultRow);
					
					let childRow = ['小孩'];
					for(let index = 1; index <= jsonData.child.length; index++){
						childRow.push(jsonData.child[index - 1]);
						totalRow[index] = totalRow[index] + jsonData.child[index - 1];
					}					
					tableData.push(childRow);
					tableData.push(totalRow);
					
					name = this.dataForm.date + '个人数据报表' + '.xlsx';
					break;
				case 'team':
					jsonData = that.team;
					jsonData.xaxis.forEach(item => {
						firstRow.push(item);
					})
					tableData = [firstRow];
					
					let numberRow = ['人数'];
					jsonData.data.forEach(item => {
						numberRow.push(item);
					})
					tableData.push(numberRow);
					
					name = this.dataForm.date + '团队数据报表' + '.xlsx';
					break;
			}
			
			let workSheet = XLSX.utils.aoa_to_sheet(tableData);
			let bookNew = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(bookNew, workSheet, '数据');
			XLSX.writeFile(bookNew, name);
		}
    },
    mounted(){
		let now = new Date();
		let year = now.getFullYear();
		let month = now.getMonth() + 1;
		this.dataForm.date = year + "-" + month;
		
		this.$nextTick(() => {
			if(!this.personalChart){
				let personalChartDom = this.$refs.personalChart;
				this.personalChart = markRaw(this.$echarts.init(personalChartDom));
			}
			if(!this.teamChart){
				let teamChartDom = this.$refs.teamChart;
				this.teamChart = markRaw(this.$echarts.init(teamChartDom));
			}
			
			this.loadDataList();
			this.initEcharts();
		})
    },
};
</script>

<style>
	
</style>
