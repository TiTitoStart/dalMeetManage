<template>
  <div class="fileLoader" style="position:realtive;">
    <div v-for="(item,index) in uploadList" class="upload-item" :key="item.uid">
      <div v-if="item.status === 'finished'" class="upload-list">
        <div class="icon-type" :style="{'background': judgeFileType(item).bgcolor}">{{judgeFileType(item).content}}</div>
        <div class="upload-list-cover">
            <a :href="item.url" :download="item.title" style="margin-bottom: 4px;"><Icon type="ios-download-outline"></Icon></a>
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)" v-if="type!='look'"></Icon>
        </div>
      </div>
      <div v-else class="upload-list">
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </div>
      <Tooltip :content="item.title + '.' + (item.attach_type||item.extension)" placement="bottom">
        <div class="file-name">{{item.title + '.' + (item.attach_type||item.extension)}}</div>
      </Tooltip>
    </div>
    <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['doc','pdf','docx','wps','xls','ppt']"
        :max-size="5120"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        :action="actionUrl"
        :headers="headers"
        type="drag"
        v-if="type!='look'"
        style="display: inline-block;width:48px;float:left;">
        <div style="width: 48px;height:48px;line-height: 48px;">
            <Icon type="ios-cloud-upload" size="20"></Icon>
        </div>
    </Upload>
  </div>
</template>
<script>
import { baseUrl } from '@/assets/config/index';
  export default {
    props: ['attachments', 'type'],
    data () {
      return {
        // defaultList: this.attachments,
        imgName: '',
        visible: false,
        uploadList: this.attachments || [],
        actionUrl: baseUrl + '/kb/tool/upload/file',
        headers: {
          Token: this.$localStorage.getValue('userInfo', 'token') || '',
          Appid: 'CSKB_FE'
        },
        fileType: {
          content: '',
          bgcolor: ''
        }
      }
    },
    watch: {
      attachments(newVal, oldVal) {
        this.uploadList = newVal || [];
      }
    },
    computed: {
      defaultList() {
        let temp = this.attachments;
        if(temp) {
          temp.forEach(item => {
            item.status = 'finished';
            item.showProgress = 100;
          });
          return temp; 
        }
      }
    },
    methods: {
        handleRemove (file) {
          const fileList = this.$refs.upload.fileList;
          this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
          this.$emit('getAttachments', this.$refs.upload.fileList);
          this.uploadList = this.$refs.upload.fileList;
        },
        handleSuccess (res, file) {
          file.url = res.result.file_uri;
          file.title = res.result.name;
          file.attach_type = res.result.extension;
          this.uploadList = this.$refs.upload.fileList;
          this.$emit('getAttachments', this.$refs.upload.fileList);
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式错误',
                desc: '仅支持 .doc,.docx,.wps,.xls,.ppt格式'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件大小不超过5M'
            });
        },
        handleBeforeUpload () {
            const check = this.uploadList.length < 5;
            if (!check) {
                this.$Notice.warning({
                    title: '文件个数上限为5个'
                });
            }
            return check;
        },
        judgeFileType(data) {
          let fileType = {};
          let word = data.attach_type || data.response.extension;
          switch(word[0].toUpperCase()) {
            case 'W': fileType = {
              content: 'W',
              bgcolor: '#ed4014'
            };break;
            case 'P': fileType = {
              content: 'P',
              bgcolor: '#00a99d'
            };break;
            case 'D': fileType = {
              content: 'D',
              bgcolor: '#3a80fc'
            };break;
            default: 
            fileType = {
              content: word[0].toUpperCase(),
              bgcolor: '#2d8cf0'
            };
          }
          return fileType;
        }
    },
    mounted () {
      if(this.$refs.upload) {
        this.uploadList = this.$refs.upload.fileList;
      }
    }
  }
</script>
<style>
    .upload-item {
      margin-right: 6px;
      width: 70px;
      text-align: center;
      float: left;
    }
    .upload-list{
        display: inline-block;
        width: 50px;
        height: 50px;
        text-align: center;
        border-radius: 12px;
        background: #fff;
        position: relative;
        box-shadow: 1px 2px 4px rgba(0,0,0,.2);
        margin-right: 4px;
        position: relative;
        overflow: hidden;
    }
    .upload-list img{
        width: 100%;
        height: 100%;
    }
    .upload-list .icon-type {
      width: 100%;
      height: 100%;
      background: #3a80fc;
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      line-height: 50px;
    }
    .upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .upload-list:hover .upload-list-cover{
        display: block;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .file-name{
      color: #333;
      width: 70px;
      line-height: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
</style>