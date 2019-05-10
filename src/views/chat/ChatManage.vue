<template>
  <div class="fm-wrap">
    <!-- <Loading :isShow="isLoading"></Loading> -->
    <div class="main-conetnt">
      <div class="title-part">标注记录</div>
      <div class="search-area" style="background:#fff;padding: 0 24px;">
        <!-- <div class="search-item">
          <Select placeholder="选择分类" style="width: 140px;">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div> -->
        <div class="search-item">
          <Select placeholder="是否达标" style="width: 140px;" v-model="searchArea.is_reach">
              <Option v-for="item in passSelection" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="search-item">
          <Select placeholder="选择标记类型" style="width: 140px;" v-model="searchArea.error_type">
              <Option v-for="item in errorSelection" :value="item.content" :key="item.value">{{ item.content }}</Option>
          </Select>
        </div>
        <div class="search-item">
          <Select placeholder="输入标注人" style="width: 140px;" v-model="searchArea.user_id">
              <Option v-for="item in userList" :value="item.user_id" :key="item.user_id">{{ item.real_name }}</Option>
          </Select>
        </div>
        <div class="search-item">
            <DatePicker type="datetimerange" placeholder="选择时间段" style="width: auto"></DatePicker>
            <Button type="primary" class="marginLeft20" @click="toSearchList">查询</Button>
        </div>
      </div>
      <div class="table-part" style="margin: 24px 24px 0 24px;">
        <Table :columns="cmColumnsData" :data="cmListData" :height="$store.state.tableHeight" :loading="isLoading"></Table>
        <div class="page-section marginTop20 right">
          <Page :total="total" :current="page"  :page-size="$store.state.pageSize" show-total @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <!-- 查看详情 -->
    <div class="options-part" v-if="$route.params.options === 'look'">
      <div class="opt-title">
        <span style="font-size: 20px;font-weight:600;">{{rowChooseData.question}}</span>
        <div class="right" style="font-size: 14px">
          <Button type="error" class="marginRight10" @click="deleteQuestion(rowChooseData)">删除</Button>
          <Button type="primary" class="marginRight10" @click="showModal('modify', rowChooseData)">修改</Button>
        </div>
      </div>
      <ChatLook :detailData="rowChooseData"></ChatLook>
    </div>
    <!-- 修改 -->
    <Modal
        v-model="modalCondition.modify_cm"
        title="修改标注"
        :loading="isLoading"
        @on-ok="updateTag">
        <Form :labelWidth="80" ref="searchForm">
          <Form :label-width="80">
            <FormItem label="出错类型:">
              <CheckboxGroup  v-model="cmForm.error_types" size="small">
                <Checkbox  :label="item.label" v-for="(item, index) in errorSelection" :key="index" v-if="index > 0">
                  <span style="font-size:12px">{{item.content}}</span>
                </Checkbox >
              </CheckboxGroup >  
            </FormItem>
            <FormItem label="是否达标:">
              <RadioGroup v-model="cmForm.is_reach" style="display:inline-block">
                <Radio :label="1">
                  <span style="font-size:12px">达标</span>
                </Radio>
                <Radio :label="0">
                  <span style="font-size:12px">不达标</span>
                </Radio>
              </RadioGroup> 
            </FormItem>
            <!-- <FormItem label="备注:">
              <Input type="textarea" :rows="3" v-model="cmForm.info"/>   
            </FormItem> -->
          </Form>
        </Form>
    </Modal>
  </div>
</template>

<script>
const Loading = r => require.ensure([], () => r(require('@/components/Loading'), 'Loading'));
const ChatLook = r => require.ensure([], () => r(require('@/components/chat/ChatLook'), 'ChatLook'));
export default {
  components: { Loading, ChatLook},
  data() {
    return {
      from: 0,//开始是第几条数据
      total:0,
      page:1,//当前页数
      isLoading: false,
      rowChooseData: '',
      modalCondition: {
        modify_cm: false, 
        look_cm: {
          title: '查看详情',
          status: false
        } //查看
      },
      cmColumnsData: [
        {
          title: '标记类型',
          key: 'error_types',
          align: 'center',
          width: 200,
          render: (h, params) => {
            let arr = [];
            params.row.error_types.forEach( (item, index) => {
                arr.push(h('Tag', {
                  props: {
                    color: 'blue'
                  }
                }, item));
            });
            return h('div', [h('div', arr)]);
          }
        },
        {
          title: '是否达标',
          key: 'is_pass',
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.is_reach ? '是' : '否');
          }
        },
        {
          title: '问题',
          key: 'question',
          align: 'center'
        },
        {
          title: '答案',
          key: 'answer',
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
                    content: params.row.answer
                  });
                }
              }
            },'查看');
          }
        },
        {
          width: 90,
          title: '标记人',
          key: 'user_name',
          align: 'center'
        },
        {
          title: '标记时间',
          key: 'timestamp',
          align: 'center',
          render: (h, params) => {
            return h('div', this.$utils.formatDate((parseInt(params.row.timestamp)),'yyyy-MM-dd hh:mm:ss'));
          }
        },
        {
          title: '备注',
          key: 'info',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', [
                  h('Poptip', {
                      props: {
                        placement: 'left-start',
                        size: 'small',
                        vModel: true,
                        width: 120
                      },
                      on: {

                      }
                  }, [
                    h('div',{
                      style: {
                        color: '#2d8cf0',
                        cursor: 'pointer'
                      }
                    },'操作'),
                    h('div',{
                      style: {
                        
                      },
                      props: {
                        
                      },
                      slot: 'content'
                    },[h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '12px'
                      },
                      on: {
                        click: () => {
                          this.showModal('modify', params.row);
                        }
                      }
                    },'修改'),h('Button', {
                      props: {
                        size: 'small',
                        type: 'error'
                      },
                      on: {
                          click: () => {
                          this.$Modal.confirm({
                            title: '确定要删除',
                            width: '260',
                            onOk: () => {
                              this.$api.mark.delete({
                                smids: [params.row.smid]
                              }
                              ).then(res => {
                                this.$Message.success('删除成功');
                                this.getCmData();
                              }).catch(() => {
                                this.$Message.error('删除失败');
                              })
                            },
                            onCancel: () => {
                            }
                          });
                        }
                      }
                    },'删除')])
                  ])
              ]),
          ])}
        }],
      cmListData: [],
      cmForm: {
        error_types: [],
        is_reach: '',
        info: '',
        smid: ''
      },
      errorSelection: [{
        label: '全部',
        content: '全部'
        },{
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
      passSelection: [{
        label: '全部',
        value: ''
        },{
        label: '达标',
        value: 1
        },{
          label: '不达标',
          value: 0
      }],
      userList: [],
      searchArea: {
        is_reach: '',
        user_id: '',
        error_type: '',
        time: ''
      }
    };
  },
  methods: {
    showModal(type, params) {
      switch (type) {
        case 'modify':
          this.modalCondition.modify_cm = true;
          this.cmForm.error_types = params.error_types || [];
          this.cmForm.is_reach = params.is_reach;
          this.cmForm.info = params.info || '';
          this.cmForm.smid = params.smid;
          break;
        case 'look':
          this.modalCondition.look_cm.title = '查看详情';
          this.modalCondition.look_cm.status = true;
          this.rowChooseData = this.$utils.deepClone(params);
          this.$router.push({
            path: '/home/ChatManage/look',
            query: {
              options: '标注详情'
            }
          });
          break;
      }
    },
    changePage(page) {
      this.page = page;
      this.getCmData(this.searchArea);
    },
    getCmData(params) {
      params = params || {};
      params.page = this.page;
      params.size = this.$store.state.pageSize;
      this.isLoading = true;
      this.$api.mark.query(params).then(res => {
        this.cmListData = res.session_marks;
        this.total = res.hits;
        this.isLoading = false;
      });
    },
    getUsersList() {
      this.$api.csm.getUsers({
        size: 0
      }).then(res => {
        this.userList = res.bot_users || [];
      });
    },
    toSearchList() {
      this.getCmData(this.searchArea);
    },
    updateTag() {
      this.$api.mark.update([this.cmForm]).then(res => {
        this.$Message.success('修改成功');
        this.getCmData();
      });
    }
  },  
  created() {
    if(this.$validation.isEmptyObj(this.$route.query)) {
      this.$router.push({
        path: '/home/ChatManage'
      });
    }
  },
  mounted() {
    this.getCmData();
    this.getUsersList();
  }
};
</script>
<style lang="less" scoped>
.fm-wrap {
}
</style>
