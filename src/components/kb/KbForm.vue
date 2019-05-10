<template>
  <!-- 修改创建问题 -->
  <div class="KbForm-wrap">
    <Form ref="kbForm" :model="kbForm" :rules="ruleValidate" :label-width="80">
      <FormItem :label="type === 'kb'?'问题:': '领域:'" prop="question">
        <div class="mu-input">
          <Input v-model="kbForm.question" :placeholder="type === 'kb'?'输入标准问题': '输入领域'" style="width: 400px" @on-change="debounce(0)" @on-blur="hideLikeList(0)" @on-focus="debounce(0)"/>
          <div class="like-list" v-if="isShowLike && likeList.length > 0">
            <span class="hint" style="padding: 0;margin:0;">*已存在的语料库</span>
            <div v-for="(item, index) in likeList" :key="index">{{item}}</div>
          </div>
        </div>
      </FormItem>
      <FormItem label="相似语料:" props="similar_questions">
        <div class="mu-input" v-for="(item,index) in kbForm.similar_questions" props="similar_questions[index]" :key="index">
          <Input class="marginBottom10" type="text" v-model="kbForm.similar_questions[index]" placeholder="Enter something..." style="width: 400px" @on-change="debounce(index + 1)" @on-blur="hideLikeList(index + 1)" @on-focus="debounce(index + 1)"/>
          <Button v-if="index!=0" type="error" @click="handleQstRemove(1, index)" class="marginLeft10 mu-button">删除</Button>
          <Button v-else type="primary" @click="handleQstAdd(1, kbForm.similar_questions)" class="marginLeft10 mu-button">添加</Button>
          <div class="like-list" v-if="isShowLikeSim === (index + 1) && likeList.length > 0">
            <span class="hint" style="padding: 0;margin:0;">*已存在的语料库</span>
            <div v-for="(item, index) in likeList" :key="index">{{item}}</div>
          </div>
        </div>
      </FormItem>
      <FormItem label="标准答案:" prop="answer">
        <Input v-model="kbForm.answer" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="Enter something..." style="width: 400px;position:relative;"/>
      </FormItem>
      <FormItem label="链接:">
        <div class="link-list">
          <div class="item">
            <span>链接标题</span>
            <span>链接地址</span>
            <Icon type="md-add" color="#1890FF" :size="20" @click="handleQstAdd(2, kbForm.attachments)"/>
          </div>
          <div class="item" v-for="(item, index) in kbForm.attachments" :key="index">
            <span><Input type="text" placeholder="链接标题" v-model="item.title"/></span>
            <span><Input type="text" placeholder="链接地址" v-model="item.url"/></span>
            <Icon type="md-remove" color="#ed4014" :size="20" @click="handleQstRemove(2, index)" v-if="index > 0"/>
          </div>
        </div>
      </FormItem>
      <FormItem label="选择分类:" prop="category_result">
        <Cascader :data="$store.state.categoryData || []" v-model="kbForm.category_result" @on-change="getCategoryLabel" style="width: 200px;display:inline-block;"></Cascader>
      </FormItem>
      <FormItem label="启用状态:" prop="state_option">
        <RadioGroup v-model="kbForm.state_option" style="display:inline-block">
          <Radio label="enable">
            <span>启用</span>
          </Radio>
          <Radio label="disable">
            <span>禁用</span>
          </Radio>
          <Radio label="timer_enable">
            <span >启用时间段</span>
          </Radio>
          <DatePicker :value="kbForm.timer" @on-change="getTimeHandle" @on-open-change="openDatePicker" type="datetimerange" placeholder="Select date and time" style="width: auto"></DatePicker>
        </RadioGroup>
      </FormItem>
      <!-- <FormItem label="附件上传:">
        <FileLoader :attachments="attachments" v-on:getAttachments="formatAttachments($event)"></FileLoader>
      </FormItem> -->
      <FormItem label="推荐知识:" v-if="type !== 'kb'">
        <div style="width: 480px;">
          <div @click="modalCondition.selectFiled = true" style="text-align:center;border:1px solid #e8eaec;border-radius: 4px;margin: 6px 0;cursor:pointer;"><Icon type="ios-add-circle-outline" :size="25" color="#1890FF"/></div>
          <Table :columns="kbColumnsData" :data="kbListData"  v-if="JSON.stringify(kbListData) !== '[]'"></Table>
        </div>
      </FormItem>
    </Form>
    <div class="bottom-btn">
      <Button type="text" size="large" @click="handleResetQuestion">取消</Button>
      <Button type="primary" size="large" @click="handleQuestion()">确定</Button>
    </div>
    <!-- 选择问题/领域 -->
    <Modal
        v-model="modalCondition.selectFiled"
        title="选择问题或领域"
        width="900px"
        @on-cancel="cancelRowChange"
        @on-ok="confirmRowChange">
        <KbSelect @handleRowChange="handleRowChange" type="nofd"></KbSelect>
    </Modal>      
  </div>
</template>
<script>
// const FileLoader = r => require.ensure([], () => r(require('@/components/FileLoader'), 'FileLoader'));
const KbSelect = r => require.ensure([], () => r(require('@/components/kb/KbSelect'), 'KbSelect'));
export default {
  props: ['formData', 'type'],
  components: {
    // FileLoader
    KbSelect
  },
  data() {
    return {
      modalCondition: {
        selectFiled: false
      },
      ruleValidate: {
        question: [{ required: true, message: '必填字段', trigger: 'blur' }],
        similar_questions: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        category_result: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        answer: [{ required: true, message: '必填字段', trigger: 'blur' }],
        state_option: [{ required: true, message: '必填字段', trigger: 'blur' }]
      },
      kbForm: {
        kid: '',
        question: '',
        similar_questions: [''],
        answer: '',
        state_option: 'enable',
        timer: [],
        category_result: [],
        category_names: [],
        recommend_knowledges: [],
        attachments: [{title: '', url: ''}]
      },
      attachments: '',//文件上传列表
      attachmentsTemp: '', //文件暂存变量
      likeList: [], //相似问法查询
      isShowLike: false,
      isShowLikeSim: '',
      kbColumnsData: [
        {
          title: 'Top',
          type: 'index',
          align: 'center',
          width: 70
        },
        {
          title: '问题',
          key: 'question',
          align: 'center',
          width: 210
        },
        {
          title: '状态',
          key: 'is_enable',
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.is_enable ? '启用' : '禁用');
          }
        },
        {
          title: '答案',
          key: 'answers',
          align: 'center',
          render: (h, params) => {
            return h('a',{
              style: {
                color: '#2d8cf0'
              },
              on: {
                click: () => {
                  this.$Modal.info({
                    title: '答案详情',
                    width: 740,
                    // content: params.row.answers[0].content,
                    render: (h) => {
                      return h('div', {
                        class: ['ql-container', 'ql-snow'],
                        style: {
                          border: 'none'
                        }
                      }, [h('div', {
                        class: ['ql-editor'],
                        style: {
                          padding: 0
                        }
                      }, [h('p', {
                        class: 'richedit-content',
                        domProps: {
                          innerHTML: params.row.answers[0].content
                        }
                      })])]);
                    }
                  });
                }
              }
            },'查看');
          }
        },{
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                color: 'red',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  let index = this.$utils.arrayObjIndexOf(this.kbListData, 'kid', params.row.kid);
                  this.kbListData.splice(index, 1);
                }
              }
            }, '删除');
          }
        }],
      kbListData: [],//相似问题语料查询
      kbCurrentRow: '',//选定关联问题
      isConfirm: true,
      debounce: () => {} //搜索防抖
    };
  },
  watch: {
    // attachments(newVal, oldVal) {
    //   if(newVal) {
    //     newVal.forEach(item => {
    //       if(item) {
    //         item.status = 'finished';
    //         item.showProgress = 100;
    //       }
    //     });
    //   }
    //   this.kbForm.attachments = newVal;
    //   return newVal;
    // },
    kbListData(newVal) {
      let arr = [];
      if(newVal) {
        newVal.forEach(item => {
          arr.push(item.kid);
        });
      }
      //推荐知识点kid
      this.kbForm.recommend_knowledges = arr;
    }
  },
  methods: {
    //获取时间
    getTimeHandle(date) {
      this.kbForm.timer[0] = Math.round(
        new Date(date[0])
      );
      this.kbForm.timer[1] = Math.round(
        new Date(date[1])
      );
    },
    //取消按钮
    handleResetQuestion() {
      this.$refs['kbForm'].resetFields();
      this.kbForm.timer = [];
      this.kbForm.similar_questions = [''];
      if(!this.noPreview) {
      this.$router.back(-1);
      }
      else {
        this.$emit('successHandle');
      }
    },
    //确定创建或修改按钮
    handleQuestion() {
      if(!this.$validation.trimStr(this.kbForm.question) || this.kbForm.category_result.toString() === '' || !this.$validation.trimStr(this.kbForm.answer) || !this.kbForm.state_option) {
        this.$Message.error('请将标红的信息填写完整！');
        return;
      }
      if(!this.isConfirm) {
        this.$Message.error('请不要添加相同的问题或语料!');
        return;
      }
      this.$Modal.confirm({
        title: '确定没有添加语义重复的问题和语料?',
        width: '260',
        onOk: () => {
         this.getTimeHandle(this.kbForm.timer);
         this.$emit('getFormData', this.kbForm);
        },
        onCancel: () => {
        }
      });
    },
    //时间格式
    timeFormatter(time) {
      return this.$utils.formatDate((parseInt(time)),'yyyy-MM-dd hh:mm:ss');
    },
    //打开时间选择器
    openDatePicker() {
      this.kbForm.state_option = 'timer_enable';
    },
    //删除相似问题
    handleQstRemove(type, index) {
      //删除语料
      if(type === 1) {
        this.$Modal.confirm({
          title: '确定要删除语料"' + this.kbForm.similar_questions[index] + '"?',
          width: '300',
          onOk: () => {
            this.kbForm.similar_questions.splice(index, 1);
          },
          onCancel: () => {
          }
        });
      }
      //删除链接
      if(type === 2) {
        this.$Modal.confirm({
          title: '确定要删除链接"' + this.kbForm.attachments[index].title + '"?',
          width: '300',
          onOk: () => {
            this.kbForm.attachments.splice(index, 1);
          },
          onCancel: () => {
          }
        });
      }
    },
    //添加相似问题
    handleQstAdd(type, item) {
      switch(type) {
        case 1: 
        if(item.includes('')) {
          this.$Message.warning({
            content: '存在未填写的语料,请先填写完毕',
            duration: 2
          });
          return;
        }
        item.push('');break;
        case 2: 
        if(!item[item.length - 1].title) {
          this.$Message.warning({
            content: '存在未填写链接标题',
            duration: 2
          });
          return;
        }
        item.push({
          title: '',
          url: ''
        });break;
      }
    },
    // formatAttachments(data) {
    //   let attachments = [];
    //   this.attachmentsTemp = data;
    //   if(data) {
    //     data.forEach((item) => {
    //       attachments.push({
    //         title: item.title,
    //         attach_type: item.attach_type,
    //         url: item.url,
    //         size: item.size
    //       });
    //     });
    //   }
    //   this.kbForm.attachments = attachments;
    //   return attachments;
    // },
    //获取分类名
    getCategoryLabel(value, selectedData ) {
      if(this.kbForm.category_names) {
        selectedData.forEach((item) => {
          this.kbForm.category_names.push(item.label);
        });
      }
    },
    // 显示模糊查询相似问题或领域列表
    showLikeList(index) {
      let keyword = '';
      //语料
      if(index) {
        this.isShowLikeSim = index;
        keyword = this.kbForm.similar_questions[index -1];
      }
      //问题
      else {
        this.isShowLike = true;
        keyword = this.kbForm.question;
      }
      switch(this.type) {
        case 'kb': 
          if(this.$validation.trimStr(keyword)) {
            this.$api.kb.like({
              keyword: keyword
            }).then(res => {
              this.likeList = res;
            });
          }
        break;
        default: 
          if(this.$validation.trimStr(keyword)) {
            this.$api.field.like({
              keyword: keyword
            }).then(res => {
              this.likeList = res;
            });
          }
      }
    },
    //隐藏该列表
    hideLikeList(index) {
      if(index) {this.isShowLikeSim = '';}
      else {
        this.isShowLike = false;
      }
      if(!this.judgeQuestion(this.kbForm.question) && !this.$validation.isContains(this.$route.params.options, 'edit')) {
        this.$Message.error('请不要添加相同的问题');
        this.isConfirm = false;
        return;
      }
      if(!this.judgeQuestion(this.kbForm.similar_questions[index - 1]) && !this.$validation.isContains(this.$route.params.options, '修改')) {
        this.$Message.error('请不要添加相同的语料');
        this.isConfirm = false;
        return;
      }
      this.isConfirm = true;
    },
    //初始化KbForm
    setKbForm(formData) {
      if(formData) {
        this.kbForm = {
          kid: formData.kid,
          question: formData.question,
          similar_questions: formData.similar_questions || [''],
          answer: formData.answers[0].content || '',
          state_option: formData.switch_config,
          // timer: this.formData.switch_config === 'timer_enable' ? [this.timeFormatter(formData.timer.start_timestamp), this.timeFormatter(formData.timer.end_timestamp)] : [],
          timer: formData.switch_config === 'timer_enable' ? [formData.timer.start_timestamp, formData.timer.end_timestamp] : [],
          category_result: formData.cids || '',
          category_names: formData.cnames || '',
          attachments: formData.answers[0].attachments || [{title: '', url: ''}]
          };
        this.kbListData = formData.recommend_knowledges || '';
      }
    },
    //问题领域表格改变
    handleRowChange(data) {
      this.kbCurrentRow = data;
    },
    //问题弹框确定
    confirmRowChange() {
      if(this.kbForm.recommend_knowledges.length > 4) {
        this.$Message.warning('最多只能添加5条Top推荐');
        return;
      }
      if(this.kbForm.recommend_knowledges.indexOf(this.kbCurrentRow.kid) !== -1) {
        this.$Message.warning('已关联该知识点,无法再次添加');
        return;
      }
      this.kbListData.push(this.kbCurrentRow);
    },
    //问题弹框取消
    cancelRowChange() {
       this.kbCurrentRow = '';
    },
    judgeQuestion(value) {
      if(value && this.$utils.arrayIndexOf(this.likeList, value ) !== -1) {
        return false;
      }
      return true;
    }
  },
  mounted() {
    if(this.formData) {
      this.setKbForm(this.formData);
    }
    else if(this.$route.query.id) {
      this.$api.kb.get({
        kids: [this.$route.query.id]
      }).then(res => {
        this.setKbForm(res[0]);
      });
    }
    let that = this;
    this.debounce = this.$utils.debounce(function(index) {
      that.showLikeList(index);
    }, 800);
  },
  created() {
  }
};
</script>
<style lang="less" scoped>
.KbForm-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height:75vh;
  overflow-y:auto;
  background: #fff;
  margin: 24px;
  padding-top: 24px;
}
.bottom-btn {
  // width: 300px; 
  // margin: 0 auto;
  padding-bottom: 2vh;
  Button {
    margin-right: 10px;
  }
}
.special-form-item {
  position: relative;
  .content {
    // float: left;
  }
}
.mu-input {
  position: relative;
  display: flex;
  align-items: center;
  .like-list {
    margin-top: 4px;
    position: absolute;
    top: 36px;
    border: 1px solid #dcdee2;
    height: 120px;
    width: 400px;
    overflow-y: auto;
    border-radius: 4px;
    z-index: 2;
    background: #fff;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    padding: 12px;
  }
  .mu-button {
    margin-bottom: 10px;
  }
}
.link-list {
  width: 400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  .item {
    width: 100%;
  }
  span {
    display: inline-block;
    width: 40%;
    text-align: center;
    font-size:12px;
    margin-right: 24px;
  }
}
</style>
