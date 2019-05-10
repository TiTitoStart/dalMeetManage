<template>
  <div class="look-wrap">
    <div class="look-content" v-if="rowChooseData">
      <div class="title">{{$route.query.options}}</div>
      <div class="info-item marginBottom20" width="200px">
        <span class="show-label">{{type === 'kb'?'问题:':'领域:'}}</span>
        <span class="show-content">{{rowChooseData.question}}</span>
      </div>
      <div class="info-item marginBottom20" width="200px">
        <span class="show-label">标准答案:</span>
        <span class="show-content" v-if="rowChooseData.answers">{{rowChooseData.answers[0]?rowChooseData.answers[0].content:''}}</span>
      </div>
      <div class="info-item marginBottom20" width="200px">
        <span class="show-label">链接:</span>
        <span class="show-content">
          <div class="link-list" v-if="rowChooseData.answers && rowChooseData.answers[0].attachments">
            <div class="item">
              <span>链接标题</span>
              <span>链接地址</span>
            </div>
            <div class="item" v-for="(item, index) in rowChooseData.answers[0].attachments" :key="index">
              <span>{{item.title}}</span>
              <span><a>{{item.url}}</a></span>
            </div>
          </div>
        </span>
      </div>
      <div class="info-item marginBottom20">
        <span class="show-label">状态:</span>
        <span class="show-content">{{rowChooseData.switch_config === 'disable'?'禁用': rowChooseData.state_option === 'timer_enable' ? '启用('+ timeFormatter(rowChooseData.timer.start_timestamp)+' ~ '+ timeFormatter(rowChooseData.timer.end_timestamp) +')': '启用'}}</span>
      </div>
      <div class="info-item marginBottom20">
        <span class="show-label">分类:</span>
        <span class="show-content">{{rowChooseData.cnames.replace(/,/g, '-')}}</span>
      </div>
      <div class="info-item marginBottom20" width="200px">
        <span class="show-label" style="font-weight: bold;">相似语料库:</span>
        <div class="show-content similar-qst">
          <div class="title-qst">语料</div>
          <div class="content-item" v-for="(item,index) in rowChooseData.similar_questions" :key="index" v-if="item">
            <Badge :count="index+1" class-name="bg-color-blue" ></Badge>
            <span class="marginLeft10">{{item}}</span>
          </div>
        </div>
      </div>
      <div class="info-item marginBottom20" v-if="type !== 'kb'">
        <span class="show-label">推荐知识点:</span>
        <div class="show-content similar-qst">
          <div class="title-qst">推荐知识点Top5</div>
          <div class="content-item" v-for="(item,index) in rowChooseData.recommend_knowledges" :key="index" v-if="item">
            <Badge :count="index+1" class-name="bg-color-blue" ></Badge>
            <span class="marginLeft10">{{item.question}}</span>
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
      <div class="info-item">
        <span class="title">更新记录</span>
        <div class="record-item">
          <div v-for="(item, index) in rowChooseData.action_recorders" v-if="item" :key="index">
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
    detailData(newVal) {
      if(newVal) {
        this.rowChooseData = newVal;
      }
    }
  },
  data() {
    return {
      rowChooseData: this.detailData || ''
    };
  },
  methods: {
    timeFormatter(time) {
      return this.$utils.formatDate((parseInt(time)),'yyyy-MM-dd hh:mm:ss');
    },
    actionFormatter(action) {
      switch(action) {
        case 'CREATE': return '创建';
        case 'UPDATE': return '修改';
        case 'APPEND': return '关联问题';
        case 'DELETE': return '删除';
        case 'ENDABLE': return '启用';
        case 'DISABLE': return '禁用';
      }
    }
  },
  mounted() {
    if(!this.detailData && this.$route.query.id) {
      this.$api.kb.get({
        kids: [this.$route.query.id]
      }).then(res => {
         this.rowChooseData = res[0];
      });
    }
  }
};
</script>
<style lang="less" scoped>
.look-wrap {
  width: 100%;
  background: #F0F2F5;
  padding: 0 24px;
  margin-bottom: 24px;
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
      width: 100%;
      margin-right: 24px;
      display: inline-block;
      color: rgba(0,0,0,0.65);
      .link-list {
        width: 400px;
        display: flex;
        justify-content: right;
        flex-direction: column;
        .item {
          width: 100%;
        }
        span {
          display: inline-block;
          width: 40%;
          // text-align: center;
          word-wrap:break-word;
          font-size: 14px;
          margin-right: 24px;
        }
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
    // padding: 24px 0;
    .info-item {
      display: flex;
      flex-direction: column;
      padding: 0;
      .title {
        border-bottom: 1px solid #F0F2F5;
        padding: 12px 24px;
      }
      .record-item {
        padding: 12px 24px;
        span {
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
