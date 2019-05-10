<template>
 <div class="test-wrap">
    <Loading :isShow="isLoading"></Loading>
    <div class="main-conetnt">
      <div class="title-part">模型测试</div>
      <div class="content">
        <div class="title"><span>正式环境</span></div>
        <div class="chat-wrap">
          <Chatting :isShowInput="true" :chatData="content"></Chatting>
        </div>
      </div>
    </div> 
 </div>
</template>
<script>
const Chatting = r => require.ensure([], () => r(require('@/components/chat/Chatting'), 'Chatting'));
const Loading = r => require.ensure([], () => r(require('@/components/Loading'), 'Loading'));
export default {
  components: {
    Chatting, Loading
  },
  data() {
    return {
      isLoading: false,
      content: sessionStorage.getItem('modelTestData') && JSON.parse(sessionStorage.getItem('modelTestData')) || []
    };
  },
  created() {

  },
  mounted() {
    // sessionStorage.setItem('modelTestData', '');
  }
};
</script>
<style lang="less" scoped>
.test-wrap {
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  .main-conetnt {
    height: 100%;
    .content {
      margin: 24px;
      background: #fff;
      min-height: 67vh;
      max-height: 80vh;
      // overflow-y: auto;
      .title {
        padding: 12px 12px 0 12px;
        border-bottom: 1px solid #F3F3F3;
        span {
          display: inline-block;
          border-bottom: 2px solid #1890FF;
          color: #1890FF;
          font-size: 14px;
          padding-bottom: 12px;
          margin-left: 12px;
        }
      }
      .chat-wrap {
        padding: 12px 24px;
        width: 100%;
        // max-height: 79vh;
        overflow: hidden;
      }
    }
  }
}
</style>
