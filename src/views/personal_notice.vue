<template>
    <h1>个人预约须知</h1>
    <div>
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="120px">
        <!-- <el-form-item label="开馆时间">
            <el-time-picker v-model="dataForm.startTime" placeholder="Arbitrary time"  :default-value="dataForm.startTime" value-format="HH:mm:ss" format='HH:mm:ss'/>
        </el-form-item> -->
        <el-form-item id="editor-item" label="内容" style="line-height: 0" prop="content">
          <QuillEditor
              id="editorId" ref="myQuillEditor" v-model:content="dataForm.content"
              theme="snow" contentType="html" :options="editorOption"
              placeholder="请输入文章内容"
          >
          </QuillEditor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dataFormSubmit">提交</el-button>
          <el-button>取消</el-button>
        </el-form-item>
		<el-form-item>
			<el-button type="primary" @click="onClickUpLoadFile">上传附件</el-button>
			<input type="file" id="upLoadFile" @change="upLoadFile" style="display: none;"/>
		</el-form-item>
		<el-form-item>
			<el-table :data="fileListForm" border style="width: 100%;" max-height="250">
				<el-table-column label="文件">
					<template #default="scope">
						<a :href="scope.row.path">{{scope.row.name}}</a>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="160">
					<template #default="scope">
						<div style="display: flex; justify-content: center;">
							<el-button size="small" type="primary" @click="deleteFile(scope)">删除</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-form-item>
      </el-form>
    </div>
  </template>
  

<script>
import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import $ from 'jquery';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // 加粗，斜体，下划线，删除线
  ['blockquote', 'code-block'],                      //引用，代码块
  [{ 'header': 1 }, { 'header': 2 }],               // 几级标题
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],     // 有序列表，无序列表
  [{ 'script': 'sub' }, { 'script': 'super' }],      // 下角标，上角标
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // 缩进
  [{ 'direction': 'rtl' }],                         // 文字输入方向
  [{ 'size': ['small', false, 'large', 'huge'] }],  // 字体大小
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],// 标题
  [{ 'color': [] }, { 'background': [] }],          // 颜色选择
  [{ 'font': ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial'] }],// 字体
  [{ 'align': [] }], // 居中
  ['clean'],                                       // 清除样式,
]

export default {
    components: {
        QuillEditor
    },
    data:function(){
        return{
            dataForm:{
                id:null,
                startTime:'09:00:00',
                stopTime:null,
                endTime:null,
                content:"aas"
            },
			fileListForm: [],
            editorOption: {
                debug: 'info',
                readOnly: false,
                theme: 'snow',
                myQuillEditor: null,
                modules: {
                    history: {
                        delay: 1000,
                        maxStack: 50,
                        userOnly: false
                    },
                    toolbar: {
                        container: toolbarOptions,
                       
                    }

                }
            },

        }   
    },
    methods:{
        dataFormSubmit(){
            let that=this
            
            that.$http('admin/notice/save', 'POST', that.dataForm, true, function(resp) {
                
							that.$message({
								message: '操作成功',
								type: 'success',
								duration: 1200
							});
            });
        },
        loadData(){
            let that=this
            that.$http('notice/1', 'GET', null, true, function(resp) {
                that.dataForm=resp
				that.loadFileList();
            });
        },
		loadFileList: function(){
			let that = this;
			that.fileListForm = [];
			that.$http("notice/fileList/1", "GET", null, true,function(resp){
				resp.forEach(item => {
					console.log(item);
					let split = item.split('/');
					let fileName = split[split.length - 1];
					let file = {
						name: fileName,
						path: item,
					}
					that.fileListForm.push(file);
				})
			})
		},
		onClickUpLoadFile: function(){
			document.getElementById("upLoadFile").click();
		},
		upLoadFile: function(){
			let that = this;
			let input = document.getElementById("upLoadFile");
			let formData = new FormData();
			formData.append('file', input.files[0]);
			formData.append('id', that.dataForm.id);
			
			$.ajax({
				url: that.$baseUrl + "notice/upload",
				type: "POST",
				dataType: 'json',
				contentType: "multipart/form-data",
				processData: false,
				contentType: false,
				xhrFields: {
					withCredentials: true
				},
				async: true,
				data: formData,
				success: function(resp){
					input.value = null;
					if(resp.code == 200){
						that.$message({
							message: '上传成功',
							type: 'success',
							duration: 1200
						});
						that.loadData();
					}
					else{
						ElMessage.error({
						    message: resp.msg,
						    duration: 1200
						});
					}
				}
			})
		},
		deleteFile: function(scope){
			let that = this;
			let data = {
				id: that.dataForm.id,
				fileName: scope.row.path
			}
			that.$http("notice/dltfile", "POST", data, true, function(resp){
				that.$message({
					message: '删除成功',
					type: 'success',
					duration: 1200
				});
				that.loadData();
			})
		}
    }
    ,created: function() {
        this.loadData();
    }
}
</script>

<style scoped>
/*强制修改样式*/
/deep/ #editor-item .el-form-item__content{
  line-height: 20px !important;

}
.editor-img-uploader {
  display: none;
}
.ql-editor {
  min-height: 300px;
}
</style>
