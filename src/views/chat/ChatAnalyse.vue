<template>
  <div class="ca-wrap">
    <!-- <Loading :isShow="isLoading"></Loading> -->
    <div class="main-conetnt" v-if="!$route.params.options">
      <div class="title-part">会话分析</div>
      <div class="search-area" style="padding: 12px 0 0 24px">
        <div class="search-item" ><Button type="primary" @click="modalCondition.selectOrigin = true">拉取会话</Button></div>  
        <div class="search-item" ><Button type="default" @click="getRecordersList" size="small"><Icon type="ios-refresh" />刷新</Button></div>  
      </div>
      <div class="table-part">
        <Table :columns="rcColumnsData" :data="rcListData" :height="$store.state.tableHeight" :loading="isLoading"></Table>
        <div class="page-section marginTop20 right">
          <Page :total="total" :current="page"  :page-size="$store.state.pageize" show-total @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <div class="options-part"  v-else>
      <div class="opt-title">标记会话</div>
      <div class="chat-part" style="margin: 24px;">
        <div class="content">
          <div class="left-side">
            <span :class="[item.is_checked ? 'checked':'', activeSessionTab === index? 'activeTab': '']" v-for="(item, index) in sessionsData" :key="item.session_id" :data-index="index" @click="showChatContent(index, item)">{{item.session_id}}</span>
          </div>
          <div class="center">
            <Chatting :chatData="sessionContent" @addSimilarQst="setSimilarQst" @submitError="submitErrorAnswer"></Chatting>
          </div>
          <div class="right-side">
            <div class="option-item" v-if="showQstTag">
              <div class="title">语料标注</div>
              <div v-if="!isTagSuccess">
                <Form>
                  <FormItem>
                    <Input type="textarea" :rows="5" v-model="tagForm.question"/>   
                  </FormItem>
                  <FormItem label="标注：">
                    <Button class="left" style="border: 1px solid #1890FF;color:#1890FF;" @click="showKbTable">{{kbCurrentRow.question?kbCurrentRow.question:'选择问题或领域'}}</Button>  
                  </FormItem>
                </Form>
                <div class="submit-btn"><Button type="primary" @click="submitTag(1)">提交</Button></div>
              </div>
              <div v-else class="tag-success">
                <div class="icon"><Icon type="ios-checkmark" :size="80" color="#fff"/></div>
                <div class="message">语料提交成功</div>
              </div>
            </div>
            <div class="option-item"  v-if="showAnswerTag">
              <div class="title">会话标记</div>
              <div v-if="!isTagSuccess">
                <Form :label-width="80">
                  <FormItem label="出错类型:">
                    <CheckboxGroup  v-model="tagForm.answer.error_types" size="small">
                      <Checkbox  :label="item.label" v-for="(item, index) in errorSelection" :key="index" >
                        <span style="font-size:12px">{{item.content}}</span>
                      </Checkbox >
                    </CheckboxGroup >  
                  </FormItem>
                  <FormItem label="是否达标:">
                    <RadioGroup v-model="tagForm.answer.is_reach" style="display:inline-block">
                      <Radio :label="1">
                        <span style="font-size:12px">达标</span>
                      </Radio>
                      <Radio :label="0">
                        <span style="font-size:12px">不达标</span>
                      </Radio>
                    </RadioGroup> 
                  </FormItem>
                  <FormItem label="备注:">
                    <Input type="textarea" :rows="3" v-model="tagForm.answer.info"/>   
                  </FormItem>
                </Form>
                <div class="submit-btn"><Button type="primary" @click="submitTag(2)">提交</Button></div>
              </div>
              <div v-else class="tag-success">
                <div class="icon"><Icon type="ios-checkmark" :size="80" color="#fff"/></div>
                <div class="message">会话标记成功</div>
              </div>
            </div>
            <div class="hint" v-if="!showQstTag && !showAnswerTag">请点击选择左边会话进行标注</div>
          </div>
        </div> 
      </div>
    </div>
    <!-- 拉取会话 -->
    <Modal
        v-model="modalCondition.selectOrigin"
        title="拉取会话"
        @on-ok="addRecordersList">
        <Form :labelWidth="80" ref="searchForm">
          <!-- <FormItem label="选择渠道:" >
            <Select placehold="请选择渠道" style="width: 300px;" v-model="searchForm.origin">
              <Option v-for="item in originList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="选择业务:" >
            <Select placehold="请选择业务" style="width: 300px;" v-model="searchForm.service">
              <Option v-for="item in serviceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem> -->
          <FormItem label="选择会话数:" >
            <Select placehold="请选择会话数" style="width: 200px;" v-model="searchForm.num">
              <Option v-for="item in numList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="选择时间段">
             <DatePicker type="daterange" split-panels placeholder="选择时间段" style="width: 200px" :value="searchForm.timer" @on-change="getTimeHandle"></DatePicker>
          </FormItem>
        </Form>
    </Modal>
    <!-- 选择问题/领域 -->
    <Modal
        v-model="modalCondition.selectFiled"
        title="选择问题或领域"
        width="900px"
        @on-cancel="cancelRowChange"
        @on-ok="confirmRowChange">
        <KbSelect @handleRowChange="handleRowChange"></KbSelect>
    </Modal>
  </div>  
</template>
<script>
const Chatting = r => require.ensure([], () => r(require('@/components/chat/Chatting'), 'Chatting'));
const Loading = r => require.ensure([], () => r(require('@/components/Loading'), 'Loading'));
const KbSelect = r => require.ensure([], () => r(require('@/components/kb/KbSelect'), 'KbSelect'));
export default {
  components: {
    Chatting, Loading, KbSelect
  },
  data() {
    return {
      total:0,
      page:1,//当前页数
      isLoading: false,
      modalCondition: {
        selectOrigin: false,
        selectFiled: false
      },
      errorSelection: [{
        label: '缺乏知识点',
        content: '缺乏知识点'
        },{
          label: '模糊问题推荐不准',
          content: '模糊问题推荐不准'
        },{
          label: '未识别上文',
          content: '未识别上文'
        },{
          label: '答案匹配错误',
          content: '答案匹配错误'
        },{
          label: '答案啰嗦不规范',
          content: '答案啰嗦不规范'
        },{
          label: '接口超时或返回失败',
          content: '接口超时或返回失败'
        },{
          label: '答案本身有问题',
          content: '答案本身有问题'
      }],
      searchForm: {
        // origin: '',
        // service: '',
        num: '',
        timer: []
      },
      originList: [{
          value: '0',
          label: '全部'
        },{
          value: '1',
          label: 'Aqara智慧生活（公众号）'
        },{
          value: '2',
          label: '绿米智慧生活（公众号）'
        },{
          value: '3',
          label: 'Aqara Home'
        }],
        serviceList: [{
          value: '0',
          label: '全部'
        },{
          value: '1',
          label: '客户服务'
        },{
          value: '2',
          label: '新零售'
      }],
      numList: [{
          value: '100',
          label: '随机100条'
        },{
          value: '300',
          label: '随机300条'
        },{
          value: '500',
          label: '随机500条'
      }],
      kbCurrentRow: '',
      //拉取记录
      rcColumnsData: [
        {
          title: '拉取时间',
          key: 'timestamp',
          align: 'center',
          render: (h, params) => {
            return h('div', this.$utils.formatDate((parseInt(params.row.timestamp)),'yyyy-MM-dd hh:mm:ss'));
          }
        },
        // {
        //   title: '拉取数',
        //   key: 'total_num',
        //   align: 'center'
        // },
        {
          title: '检查进度',
          key: 'checked_num',
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.checked_num + '/' + params.row.total_num);
          }
        },
        {
          title: '已标记',
          key: 'marked_num',
          align: 'center'
        },
        {
          title: '状态',
          key: 'is_finished',
          align: 'center',
          render: (h, params) => {
            if(params.row.is_finished) {
              return h('div', '已完成');
            }
            else {
              return h('div', '未完成');
            }
          }
        },{
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning'
                },
                on: {
                  click: () => {
                    this.nowChooseData = this.$utils.deepClone(params.row);
                    this.getSessionList({
                      spid: params.row.spid
                    });
                  }
                }
              }, '查看标记')
          ])}
        }],
      rcListData: [],
      //会话拉取内容
      sessionsData: [],
      //会话具体内容
      sessionContent: [],
      //会话来源appid
      sessionsAppid: '',
      //当前选中项
      nowChooseData: {},
      activeSessionTab: 0,
      //标记表单
      tagForm: {
        question: '',
        qst: {
          kid: '',
          similar_questions: []
        },
        answer: {
          error_types: [],
          is_reach: '',
          info: ''
        }
      },
      showQstTag: false,
      showAnswerTag: false,
      isTagSuccess: false
    };
  },
  methods:{
    changePage(page) {
      this.page = page;
      this.getSessionList();
    },
    //拉取随机会话
    addRecordersList() {
      this.isLoading = true;
      this.$api.chat.pull({
        session_num: parseInt(this.searchForm.num),
        start_date: this.searchForm.timer[0] || '',
        end_date: this.searchForm.timer[1] || ''
      }).then(res => {
        this.isLoading = false;
        this.$Message.success('拉取成功');
        this.getRecordersList();
      }).catch((res) => {
        this.isLoading = false;
        if(res.code === 303) {
          this.$Message.warning({
            content: '该时间段没有足够的会话数, 请重新选择时间段',
            duration: 3
          });
        }
        else {
          this.$Message.error('请稍后重试', res);
        }
      });
    },
    //获取拉取历史记录
    getRecordersList(params) {
       params = params || {};
       params.page = this.page;
       params.size = this.$store.state.pageSize;
       this.isLoading = true;
       this.$api.chat.query(params).then(res => {
         this.rcListData = res.session_pulls;
         this.total = res.hits;
         this.isLoading = false;
       });
    },
    getTimeHandle(date) {
      this.searchForm.timer = date;
    },
    //获取会话记录
    getSessionList(params) {
      this.isLoading = true;
      this.$api.chat.get(params).then(res => {
        this.sessionsData = res.sessions;
        this.sessionContent = this.sessionsData[0].records || [];
        this.sessionsAppid = this.sessionsData[0].session_app_id
        this.isLoading = false;
        this.$router.push({
          path: '/home/ChatAnalyse/tag',
          query: {
            options: '标记会话'  
          }
        });
      }).then((res) => {
        this.activeSessionTab = 0;
        if(!this.sessionsData[0].is_checked) {
          this.sessionsData[0].is_checked = true;
          this.$api.chat.check({
            spid: this.nowChooseData.spid,
            session_id: this.sessionsData[0].session_id
          });
        }
      }).catch((res) => {
        this.isLoading = false;
        this.$Message.error('请稍后重试', res);
      });
    },
    //切换会话记录并提交已检查
    showChatContent(index, item) {
      this.activeSessionTab = index;
      this.sessionContent = this.sessionsData[index].records;
      this.sessionsAppid = this.sessionsData[index].session_app_id
      if(!item.is_checked) {
        this.$api.chat.check({
          spid: this.nowChooseData.spid,
          session_id: this.sessionsData[index].session_id
        }).then(res => {
          this.sessionsData[index].is_checked = true;
        });
      }
    },
    //语料
    setSimilarQst(data) {
      this.tagForm.question = data;
      this.tagForm.qst.kid = '';
      this.isTagSuccess = false;
      this.showQstTag = true;
      this.showAnswerTag = false;
      this.kbCurrentRow = '';
    },
    //答案
    submitErrorAnswer(data) {
      this.isTagSuccess = data.is_marked;

      //获取会话详细信息
      this.tagForm.answer.spid = this.nowChooseData.spid;
      this.tagForm.answer.session_id = this.sessionsData[this.activeSessionTab].session_id;
      this.tagForm.answer.question = data.question;
      this.tagForm.answer.answer = data.answer_content;
      this.tagForm.answer.recorder_id = data.recorder_id;
      this.tagForm.answer.app_id = this.sessionsAppid;
      this.tagForm.answer.department = data.answer_kb_department;


      this.tagForm.answer.error_types = [];
      this.tagForm.answer.is_reach = '';
      this.tagForm.answer.info = '';

      this.showQstTag = false;
      this.showAnswerTag = true;
      if(!(this.$cache.get('recorderIds') instanceof Array)) {
        this.$cache.set('recorderIds', []);
      }
      if(data.is_marked || this.$cache.get('recorderIds').indexOf(data.recorder_id) !== -1) {
        this.isTagSuccess = true;
        return;
      }
    },
    //显示问题领域列表
    showKbTable() {
      if(this.tagForm.question) {
        this.tagForm.qst.kid = '';
        this.modalCondition.selectFiled = true;
        this.page = 1;
        this.total = 0;
      }
      else {
        this.$Message.warning('输入框无内容');
        return;
      }
    },
    //问题领域表格改变
    handleRowChange(data) {
      this.kbCurrentRow = data;
    },
    //问题弹框确定
    confirmRowChange() {
       this.tagForm.qst.kid = this.kbCurrentRow.kid;
       this.tagForm.qst.similar_questions = this.kbCurrentRow.similar_questions || [];
      //  if(!this.tagForm.question) {
      //    this.$Message.warning('输入框无内容');
      //    return;
      //  }
      //  if(this.kbCurrentRow.similar_questions.indexOf(this.tagForm.question) !== -1) {
      //    this.$Message.error('已存在该语料, 无法再次添加');
      //    return;
      //  }
      //  if(this.tagForm.question) {
      //    this.tagForm.qst.similar_questions.push(this.tagForm.question);
      //  }
    },
    //问题弹框取消
    cancelRowChange() {
       this.kbCurrentRow = '';
    },
    //提交标注
    submitTag(type) {
      switch(type) {
        //语料添加
        case 1: 
          if(this.kbCurrentRow.similar_questions.indexOf(this.tagForm.question) !== -1) {
            this.$Message.error('已存在该语料, 无法再次添加');
            return;
          }
          else if(this.kbCurrentRow.question === this.tagForm.question) {
            this.$Message.error('该语料已经是标准问题, 无法再次添加');
            return;
          }
          else if(!this.tagForm.question || !this.tagForm.qst.kid) {
            this.$Message.error('请将信息填写完整');
          }
          else {
            this.tagForm.qst.similar_questions.push(this.tagForm.question);
            this.$api.kb.update([this.tagForm.qst]).then(res => {
              this.$Message.success('语料添加成功');
              this.isTagSuccess = true;
            });
          }
          break;
        //会话标记
        case 2:
          if(this.tagForm.answer.error_types.toString() !== '[]' && this.tagForm.answer.is_reach !== '' && this.tagForm.answer.answer) {
            this.$api.chat.tag([this.tagForm.answer]).then(res => {
              this.$Message.success('标记成功');
              let recorderIds = this.$cache.get('recorderIds');
              recorderIds.push(this.tagForm.answer.recorder_id);
              this.$cache.set('recorderIds', recorderIds);
              this.isTagSuccess = true;
              this.tagForm.error_types = [];
              this.tagForm.is_reach = '';
              this.tagForm.info = '';
            });
          }
          else {
            this.$Message.error('请将信息填写完整');
          }
      }
    }
  },
  created() {
  },
  mounted() {
    this.getRecordersList();
    if(this.$route.params.options) {
      this.$router.push({
        path: '/home/ChatAnalyse'
      });
    }
  }
};
</script>
<style lang="less" scoped>
.ca-wrap {
  height: 100%;
  position: relative;
  .table-part {
    padding: 0 24px;
  }
  .chat-part {
    background: #fff;
    padding: 12px;
    .search-area {
      // padding: 12px 24px;
      border-bottom: 1px solid #E2E2E2;
    }
    .content {
      width: 100%;
      display: flex;
      flex: row;
      padding-bottom: 12px; 
      max-height: 75vh;
      .left-side {
        min-height: 100%;
        max-height: 100%;
        width: 200px;
        border: 1px solid #E2E2E2;
        flex: 1 1 auto;
        overflow-y: auto;
        padding: 0 12px;
        span {
          // display: inline-block;
          width: 100%;
          height: 34px;
          line-height: 34px;
          border-bottom: 1px solid #E2E2E2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;// 限制快级元素的文本行数
          overflow: hidden;
          // padding-left: 8px;
          cursor: pointer;
        }
        .checked {
          color: #c5c8ce;
        }
        .activeTab {
         color: #5cadff;
        }
      }
      .center {
        width: 640px;
        // min-height: 100%;
        max-height: 100%;
        overflow-y: auto;
        flex: 1 1 auto;
        background: #F3F3F3;
      }
      .right-side {
        width: 300px;
        flex: 1 1 auto;
        margin-left: 24px;
        padding-right: 12px;
        overflow-y: auto;
        .option-item {
          margin-bottom: 24px;
          .title {
            width: 100%;
            background: #F9FAFC;
            height: 30px;
            line-height: 30px;
            margin-bottom: 12px;
            padding-left: 12px;
          }
          .submit-btn {
            text-align: center;
          }
        }
        .tag-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 48px;
          .icon {
            background: #19be6b;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            text-align: center;
            line-height: 80px;
            margin-bottom: 14px;
          }
        }
        .hint {
          color: #808695;
          font-size: 16px;
          margin-top: 48px;
          height: 90%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
.select-wrap {
  min-height: 400px;
  display: flex;
  max-height: 70vh;
  overflow-y: auto;
  height: 100%;
  .category {
    // min-height: 400px;
    max-height: 70vh;
    height: 100%;
    width: 200px;
    border: 1px solid #dcdee2;
    margin-right: 24px;
    border-radius: 4px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .table {
    height: 100%;
    width: 700px;
    overflow-y: auto;
  }
}
.ivu-form-item {
  margin-bottom: 12px;
}
</style>
