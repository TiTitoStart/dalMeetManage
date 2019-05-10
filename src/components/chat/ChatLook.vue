<template>
  <div class="look-wrap" style="height: 75vh;overflow-y:auto;">
    <div class="look-content">
      <div class="title">{{$route.query.options}}</div>
      <div class="info-item marginBottom20" width="200px">
        <span class="show-label">{{type === 'kb'?'问题:':'领域:'}}</span>
        <span class="show-content">{{rowChooseData.question}}</span>
      </div>
      <div class="info-item marginBottom20" width="200px">
        <span class="show-label">标准答案:</span>
        <span class="show-content">{{rowChooseData.answers[0]?rowChooseData.answers[0].content:''}}</span>
      </div>
      <div class="info-item marginBottom20">
        <span class="show-label">状态:</span>
        <span class="show-content">{{rowChooseData.state_option === 'disable'?'禁用': rowChooseData.state_option === 'timer_enable' ? '启用('+ timeFormatter(rowChooseData.timer.start_timestamp)+' ~ '+ timeFormatter(rowChooseData.timer.end_timestamp) +')': '启用'}}</span>
      </div>
      <div class="info-item marginBottom20">
        <span class="show-label">分类:</span>
        <span class="show-content">{{rowChooseData.cnames}}</span>
      </div>
      <div class="info-item marginBottom20" width="200px">
        <span class="show-label">相似语料库:</span>
        <div class="show-content similar-qst">
          <div class="title-qst">语料</div>
          <div class="content-item" v-for="(item,index) in rowChooseData.similar_questions" :key="index" v-if="item">
            <Badge :count="index+1" class-name="bg-color-blue" ></Badge>
            <span class="marginLeft10">{{item}}</span>
          </div>
        </div>
      </div>
      <!-- <div class="info-item marginBottom20" width="200px">
        <span class="marginBottom20 show-label">附件:</span>
        <div class="show-content" style="margin-top: -22px;">
          <FileLoader :attachments="attachments" type="look"></FileLoader>
        </div>
      </div> -->
    </div>
    <div class="look-bottom">
      <div class="info-item marginBottom20">
        <span class="show-label">更新记录:</span>
        <div class="record-item show-content">
          <div v-for="(item, index) in rowChooseData.action_recorders" v-if="item">
            <span>{{actionFormatter(item.action)}}</span>
            <span>{{item.real_name}}</span>
            <span>{{timeFormatter(item.timestamp)}}</span>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>
<script>
const FileLoader = r => require.ensure([], () => r(require('@/components/FileLoader'), 'FileLoader'));
export default {
  props: ['detailData', 'type'],
  components: {FileLoader},
  watch: {
    detailData(newVal, oldVal) {
      this.rowChooseData = newVal;
    }
  },
  data() {
    return {
      rowChooseData: this.detailData || {}
    };
  },
  methods: {
    timeFormatter(time) {
      return this.$utils.formatDate((parseInt(time)),'yyyy-MM-dd hh:mm:ss');
    },
    actionFormatter(action) {
      switch(action) {
        case 'CREATE': return '创建';break;
        case 'UPDATE': return '修改';break;
        case 'APPEND': return '关联问题';break;
        case 'DELETE': return '删除';break;
        case 'ENDABLE': return '启用';break;
        case 'DISABLE': return '禁用';break;
      }
    }
  },
  mounted() {
  }
};
</script>
<style lang="less" scoped>
.look-wrap {
  width: 100%;
  background: #F0F2F5;
  padding: 0 24px;
  .info-item {
    padding-left: 24px;
    display: flex;
    flex-direction: row;
    .show-label {
      display: inline-block;
      text-align: left;
      width: 100px;
    }
    .show-content {
      display: inline-block;
      color: rgba(0,0,0,0.65);
    }
    .record-item {
      span {
        display: inline-block;
        margin-left: 20px;
      }
    }
    .similar-qst {
      border: 1px solid #E9E9E9;
      border-radius: 2px;
      width: 100%;
      margin-right: 24px;
      .title-qst {
        background: #FAFAFA;
        height: 40px;
        line-height: 40px;
        font-weight: bold;
        border-bottom: 1px solid #E9E9E9;
        padding-left: 24px;
      }
      .content-item {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #E9E9E9;
        margin: 0 24px;
      }
    }
  }
  .look-content {
    background: #fff;
    margin-bottom: 12px;
    border-radius: 2px;
    padding-bottom: 24px;
    .title {
      font-size: 14px;
      font-weight: bold;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #F0F2F5;
      margin-bottom: 12px;
      padding-left: 24px;
    }
  }
  .look-bottom {
    border-radius: 2px;
    background: #fff;
    padding: 24px 0;
  }
}
</style>
