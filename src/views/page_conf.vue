<template>
  <div>
    <el-row>
      <el-col :span="5"  v-for="(item,index) in dataList">
        <el-card style="max-width: 330px" >
          <template #header>
            
              <h3>{{ item.pageName }}</h3>
           
          </template>

          <el-form :model="item" ref="item">
            <el-form-item label="是否开放">
              <el-switch
                v-model="item.disable"
                size="large"
                active-text="关闭"
                inactive-text="开放"
              />
            </el-form-item>
           
            <el-form-item>
            <el-button style="float: right;" type="large" @click="save(item)">保存</el-button>
          </el-form-item>
          </el-form>

        
        </el-card>
      </el-col>
     
    </el-row>
    <el-row style="margin-top: 10px;">
      <el-col  >
        <el-card style="width: 33vw" >
          <template #header>
            
              <h3>场次时间段</h3>
           
          </template>

          <!-- <el-form>
            <el-form-item label="上午">
              <el-time-select
                v-model="timePeriodList[0].startTime"
                style="width: 240px"
                :max-time="timePeriodList[0].endTime"
                class="mr-4"
                placeholder="开始时间"
                start="08:30"
                step="00:15"
                end="18:30"
                value-format="HH:mm:ss"

              />
              至
              <el-time-select
                v-model="timePeriodList[0].endTime"
                style="width: 240px"
                :min-time="timePeriodList[0].startTime"
                placeholder="结束时间"
                start="08:30"
                step="00:15"
                end="18:30"
                value-format="HH:mm:ss"
              />
            </el-form-item>



            <el-form-item label="上午">
              <el-time-select
                v-model="timePeriodList[1].startTime"
                style="width: 240px"
                :max-time="timePeriodList[1].endTime"
                class="mr-4"
                placeholder="开始时间"
                start="08:30"
                step="00:15"
                end="18:30"
                value-format="HH:mm:ss"

              />
              至
              <el-time-select
                v-model="timePeriodList[1].endTime"
                style="width: 240px"
                :min-time="timePeriodList[1].startTime"
                placeholder="结束时间"
                start="08:30"
                step="00:15"
                end="18:30"
                value-format="HH:mm:ss"
              />
            </el-form-item>


            <el-form-item label="下午">
              <el-time-select
                v-model="timePeriodList[1].startTime"
                style="width: 240px"
                :max-time="timePeriodList[1].endTime"
                class="mr-4"
                placeholder="开始时间"
                start="08:30"
                step="00:15"
                end="18:30"
                value-format="HH:mm:ss"
              />
              至
              <el-time-select
                v-model="timePeriodList[1].endTime"
                style="width: 240px"
                :min-time="timePeriodList[1].startTime"
                placeholder="结束时间"
                start="08:30"
                step="00:15"
                end="18:30"
                value-format="HH:mm:ss"
              />
            </el-form-item>



            <el-form-item label="下午">
              <el-time-select
                v-model="timePeriodList[1].startTime"
                style="width: 240px"
                :max-time="timePeriodList[1].endTime"
                class="mr-4"
                placeholder="开始时间"
                start="08:30"
                step="00:15"
                end="18:30"
                value-format="HH:mm:ss"
              />            
              至
              <el-time-select
                v-model="timePeriodList[1].endTime"
                style="width: 240px"
                :min-time="timePeriodList[1].startTime"
                placeholder="结束时间"
                start="08:30"
                step="00:15"
                end="18:30"
                value-format="HH:mm:ss"
                format="HH:mm:ss"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button style="float: right;" type="large" @click="timePeriodSave()">保存</el-button>
            </el-form-item>
          </el-form> -->

      
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
  data: function () {
    return {
      
      dataList: [],
      timePeriodList:[
        {
          startTime:"12:00",
          endTiem:"13:00"
        },
        {
          startTime:"12:00",
          endTiem:"13:00"
        }
      ]
    };
  },
  methods: {
    loadDataList: function () {
      let that = this;
      let data = {
      
      };

      that.$http("admin/pageconf/list", "POST", data, true, function (resp) {
        that.dataList = resp;
      });

      that.$http("admin/timeperiod", "GET", data, true, function (resp) {
        that.timePeriodList = resp;
      });
    },
    save(item){
        console.log(item);
        let that = this;
        that.$http("admin/pageconf/update", "POST", item, true, function (resp) {
            ElMessage({
                message: '保存成功！',
                type: 'success',
            });
            that.loadDataList()
        });
    },
    timePeriodSave(){
        let that = this;
        let data=that.timePeriodList;
        that.$http("admin/timeperiod", "POST", data, true, function (resp) {
            ElMessage({
                message: '保存成功！',
                type: 'success',
            });
            that.loadDataList()
        });
    },
  },
  created: function () {
    this.loadDataList();
  },
};
</script>

<style>
.cark-div {
  display: flex;
  
}
</style>
