<template>
  <div class="chatting">
      <div class="content-top"  v-if="!isShowInput">
        <!-- <span class="left">用户:xxxxopenid</span> -->
        <span class="right">来源:微信公众号-绿米智慧生活</span>
      </div>
      <div class="chat">
        <div class="chat-item" v-for="(item, index) in (isShowInput ? content : contentReverse)">
          <div class="time" v-if="item.timestamp">{{$utils.formatDate((parseInt(item.timestamp)),'yyyy-MM-dd hh:mm:ss')}}</div>
          <div class="user" v-if="item.question">
            <Avatar icon="ios-person" size="large"/>
            <div class="chat-content bg-green" @click="addSimilarQst(item.question, index)" :class="activeQstIndex === index ? ['bg-blue', 'tri-dot-right-bgblue'] : 'tri-dot-right'">{{item.question}}</div>
          </div>
          <div class="robot" v-if="item.answer_content">
            <Avatar :src="require('../../assets/images/robot-icon.png')" size="large"/>
            <div class="chat-content" @click="submitError(item, index)" :class="activeAnswerIndex === index ? ['bg-blue', 'tri-dot-left-bgblue'] : 'tri-dot-left'" v-html="item.answer_content"></div>
          </div>
        </div>
      </div>
      <div class="content-bottom" v-if="isShowInput">
        <textarea class="replay" placeholder="输入回复..." v-model="testContent"></textarea>
        <div style="background: #F3F3F3;padding-left: 24px;width:100px;height: 30px;position: absolute; top: 52px;right:1px;"><Button @click="modelTest" type="default" size="small" style="">发&nbsp;&nbsp;送</Button></div>
      </div>
    </div>
</template>
<script>
export default {
  props: ['isShowInput', 'chatData'],
  watch: {
    chatData(newVal, oldVal) {
      if(!this.isShowInput) {
        this.contentReverse = newVal.concat([]).reverse();
      }
      else {
        this.content = newVal;
      }
      this.content = newVal;
      this.activeAnswerIndex = '';
      this.activeQstIndex = '';
      document.querySelector('.chat').scrollTop = 0;
    }
  },
  data() {
    return {
      content: this.chatData,
      activeAnswerIndex: '',
      activeQstIndex: '',
      testContent: '',
      contentReverse: this.chatData.concat([]).reverse()
    }
  },
  methods: {
    addSimilarQst(question, index) {
      this.activeQstIndex = index;
      this.activeAnswerIndex = '';
      this.$emit('addSimilarQst', question);
    },
    submitError(item, index) {
      this.activeAnswerIndex = index;
      this.activeQstIndex = '';
      this.$emit('submitError', item);
    },
    modelTest() {
      if(this.$validation.trimStr(this.testContent)) {
        let singleContent = {
          question: this.testContent,
          answer_content: '',
          timestamp:  Math.round(new Date())
        };
        this.content.push(singleContent);
        let index = this.content.length -1;
        let session_id = index -1 < 0 ? this.content[0].session_id : this.content[index -1].session_id;
        this.$api.test({
          question: this.testContent,
          session_id: session_id
        }).then(res => {
          this.content[index].answer_content = res.content;
          this.content[index].session_id = res.session_id;
          sessionStorage.setItem('modelTestData', JSON.stringify(this.content));
          this.testContent = '';
        }).then(() => {
          document.querySelector('.chat').scrollTop = document.querySelector('.chat').scrollHeight;
        });
      }
      else {
        this.$Message.error('信息不能为空');
      }
    }
  },
  created() {
    let that = this;
    document.onkeypress = function(e) {
      let keycode = document.all ? event.keyCode : e.which;
      if (keycode == 13) {
        that.modelTest();
        return false;
      }
    }
  },
  mounted() {
    if(this.isShowInput) {
      document.querySelector('.chat').scrollTop = document.querySelector('.chat').scrollHeight;
    }
  }
};
</script>
<style lang="less" scoped>
.chatting {
  overflow: hidden;
  background: #F3F3F3;
  position: relative;
  height: 100%;
  .content-top {
    border-bottom: 1px solid #E2E2E2;
    height: 44px;
    span {
      display: inline-block;
      margin: 14px;
      color: #999;
    }
  }
  .content-bottom {
    width: 98%;
    margin: 0 auto;
    background: #F3F3F3;
    position: relative;
    border-top: 1px solid #E2E2E2;
    padding-top: 12px;
    .replay {
      background: #F3F3F3;
      width: 100%;
      height: 70px;
      border: none;
      &:focus {
      outline: none;
      border: 1px solid #F3F3F3;
      outline: 0;
      transition: 0.5s;
      }
      &:hover {
        border: 1px solid #F3F3F3;
      }
    }
  }
  .chat {
    width: 100%;
    min-height: 58vh;
    max-height: 60vh;
    overflow-y: auto;
    flex: auto;
    .chat-item {
      width: 100%;
      .time {
        text-align: center;
        width: 100%;
        margin: 12px 0;
      }
      .chat-content {
        border-radius: 6px;
        padding: 12px;
        background: #fff;
        border: 2px solid #e2e2e2;
        margin-left: 12px;
        margin-right: 12px;
        position: relative;
        text-align: left;
        max-width: 56%;
        cursor: pointer;
      }          
      .bg-green {
        background: #85f042;
      }
      .bg-blue {
        background: #daebff;
      }
      .robot {
        width: 100%;
        display: flex;
        flex-direction: row;
        padding: 12px;
        align-items: left;
        position: relative;
      }
      .user {
        width: 100%;
        display: flex;
        padding: 12px;
        flex-direction: row-reverse;
        position: relative
      }
    }
  }
}
</style>
