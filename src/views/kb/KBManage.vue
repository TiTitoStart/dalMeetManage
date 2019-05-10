<template>
  <div class="kbm-wrap">
    <!-- <Loading :isShow="isLoading"></Loading> -->
    <div class="main-conetnt" v-if="!$route.params.options">
      <div class="title-part">知识库运营</div>
      <div class="table-part">
        <div class="category">
          <!-- <Loading :isShow="isLoading"></Loading> -->
          <Category @searchByCategory="getListByCategory"></Category>
        </div>
        <div class="content">
          <div class="search-area">
            <div class="search-item">
              <Input v-model="searchArea.keyword" placeholder="输入目录名、id、标题、答案" style="width: 180px" />
              <Button type="primary" class="marginLeft20" @click="getListByKey">查询</Button>
            </div>
            <div class="right"><Button type="primary" @click="showModal('create')"><Icon type="ios-add" :size="20" />新建</Button></div>
          </div>
          <Table :columns="kbColumnsData" :data="kbListData" :height="$store.state.tableHeight" :loading="isLoading"></Table>
          <div class="page-section right marginTop20">
            <Page :total="total" :current="page"  :page-size="$store.state.pageSize" show-total @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </div>
    <!-- 创建修改 -->
    <div class="options-part" v-if="$route.params.options === 'add' || $route.params.options === 'edit'">
      <div class="opt-title">
        <span class="title-content">{{$route.query.options}}</span>
        <span class="hint">*请不要添加意思相近的问题、语料、领域</span>
      </div>
      <KbForm :type="'kb'" @getFormData="questionHandle" :formData="modalCondition.create_or_modify_qst.type === 'modify' ? rowChooseData:''"></KbForm>
    </div>
    <!-- 查看详情 -->
    <div class="options-part" v-if="$route.params.options === 'look'">
      <div class="opt-title">
        <span style="font-size: 20px;font-weight:600;">{{rowChooseData.question}}</span>
        <div class="right" style="font-size: 14px">
          <Button type="error" class="marginRight10" @click="deleteQuestion(rowChooseData)">删除</Button>
          <Button type="primary" @click="showModal('modify', rowChooseData)">修改</Button>
        </div>
      </div>
      <KbLook :detailData="rowChooseData" :type="'kb'"></KbLook>
    </div>
  </div>
</template>
<script>
const Category = r => require.ensure([], () => r(require('@/components/kb/Category'), 'Category'));
const Loading = r => require.ensure([], () => r(require('@/components/Loading'), 'Loading'));
const KbForm = r => require.ensure([], () => r(require('@/components/kb/KbForm'), 'KbForm'));
const KbLook = r => require.ensure([], () => r(require('@/components/kb/KbLook'), 'KbLook'));
export default {
  components: { Category, Loading, KbForm, KbLook},
  data() {
    return {
      total:0,
      page:1,//当前页数
      isLoading: false,
      searchArea: {
        keyword: ''
      },
      modalCondition: {
        create_or_modify_qst: {
          type: 'create',
          title: '创建问题'
        }, 
        look_qst: {
          title: '查看详情',
          status: false
        } //查看
      },
      kbColumnsData: [
        {
          title: '问题',
          key: 'question',
          align: 'center'
        },
        {
          title: '语料',
          key: 'similar_questions',
          align: 'center',
          render: (h, params) => {
            let arr = [];
            if(params.row.similar_questions) {
              params.row.similar_questions.forEach( (item, index) => {
                if(index < 2) {
                  arr.push(h('Tag', item));
                }
              });
              return h('div', [h('div', arr),h('div', {
                style: {
                  fontSize: '12px',
                  float: 'right'
                }
              }, `...共${params.row.similar_questions.length}条`)]);
              }
          }
        },
        // {
        //   title: '答案',
        //   key: 'answers',
        //   align: 'center',
        //   render: (h, params) => {
        //     return h('a',{
        //       style: {
        //         color: '#2d8cf0'
        //       },
        //       on: {
        //         click: () => {
        //           this.$Modal.info({
        //             title: '答案详情',
        //             width: 740,
        //             // content: params.row.answers[0].content,
        //             render: (h) => {
        //               return h('div', {
        //                 class: ['ql-container', 'ql-snow'],
        //                 style: {
        //                   border: 'none'
        //                 }
        //               }, [h('div', {
        //                 class: ['ql-editor'],
        //                 style: {
        //                   padding: 0
        //                 }
        //               }, [h('p', {
        //                 class: 'richedit-content',
        //                 domProps: {
        //                   innerHTML: params.row.answers[0].content
        //                 }
        //               })])]);
        //             }
        //           });
        //         }
        //       }
        //     },'查看');
        //   }
        // },
        {
          title: '分类',
          key: 'cnames',
          align: 'center',
          render: (h, params) => {
            return h(
              'div',
              params.row.cnames.replace(/,/g,'-')
            );
          }
        },
        {
          title: '状态',
          key: 'is_enable',
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.is_enable ? '启用' : '禁用');
          }
        },
        // {
        //   title: '最后编辑',
        //   key: 'last_modify',
        //   align: 'center',
        //   render: (h, params) => {
        //     if(params.row.action_recorders && params.row.action_recorders.length > 0) {
        //       return h('div', params.row.action_recorders[params.row.action_recorders.length - 1].real_name );
        //     }
        //     else {
        //       return h('div', '');
        //     }
        //   }
        // },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            let that = this;
            return h('div', [
              h('div', [
                  h('Poptip', {
                      props: {
                        placement: 'left-start',
                        size: 'small',
                        vModel: true,
                        width: 220
                      }
                  }, [
                    h('div',{
                      style: {
                        color: '#2d8cf0',
                        cursor: 'pointer'
                      }
                    },'操作'),
                    h('div',{
                      slot: 'content'
                    },[h('Button', {
                      props: {
                        type: 'warning',
                        size: 'small'
                      },
                      style: {
                        marginRight: '12px'
                      },
                      on: {
                        click: function() {
                          that.showModal('look', params.row);
                        }
                      }
                    },'查看'),h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '12px'
                      },
                      on: {
                        click: function() {
                          that.showModal('modify', params.row);
                        }
                      }
                    },'修改'),h('Button', {
                      props: {
                        size: 'small',
                        type: 'error'
                      },
                      on: {
                        click: () => {
                          this.deleteQuestion(params.row);
                        }
                      }
                    },'删除')])
                  ])
              ]),
          ])} 
        }],
      kbListData: [],
      rowChooseData: ''
    };
  },
  watch: {
    // rowChooseData(newVal, oldVal) {
    //   return newVal;
    // }
  },
  methods: {
    showModal(type, params) {
      switch (type) {
        case 'create':
          this.modalCondition.create_or_modify_qst = {
            type: type,
            title: '创建问题'
          };
          this.$router.push({
            path: '/home/KBManage/add',
            query: {
              options: '创建问题'  
            }
          });
          break;
        case 'modify':
          this.rowChooseData = this.$utils.deepClone(params);
          this.modalCondition.create_or_modify_qst = {
            type: type,
            title: '修改问题'
          };
          this.$router.push({
            path: '/home/KBManage/edit',
            query: {
              options: '修改问题',
              id: this.rowChooseData.kid
            }
          });
          break;
        case 'look':
          this.modalCondition.look_qst.title = '查看详情';
          this.modalCondition.look_qst.status = true;
          this.rowChooseData = this.$utils.deepClone(params);
          this.$router.push({
            path: '/home/KBManage/look',
            query: {
              options: '问题详情',
              id: this.rowChooseData.kid
            }
          });
          break;
      }
    },
    changePage(page) {
      this.page = page;
      this.getQuestionList(this.searchArea);
    },
    getQuestionList(params) {
      params = params || {};
      params.size = this.$store.state.pageSize;
      params.page = this.page;
      this.isLoading = true;
      this.$api.kb.query(params).then(res => {
        this.kbListData = res.kpoints;
        this.total = res.hits;
        this.isLoading = false;
      });
    },
    //通过分类查询
    getListByCategory(data) {
      this.page = 1;
      this.searchArea.keyword = '';
      for(let i in data) {
        this.searchArea[i] = data[i];
      }
      this.getQuestionList(data);
    },
    //通过关键字查询
    getListByKey() {
      this.page = 1;
      this.getQuestionList({
        keyword: this.searchArea.keyword
      });
    },
    //创建修改
    questionHandle(kbForm) {
      let data = [{
        kid: kbForm.kid,
        question: kbForm.question,
        similar_questions: kbForm.similar_questions,
        answers: [{
          content: kbForm.answer,
          attachments: kbForm.attachments
        }],
        cids: kbForm.category_result,
        switch_config: kbForm.state_option,
        timer: kbForm.state_option === 'timer_enable'? {
          start_timestamp: kbForm.timer[0],
          end_timestamp: kbForm.timer[1]
        } : {}
      }];
      if(this.modalCondition.create_or_modify_qst.type === 'create') {
        this.$api.kb.add(data).then(() => {
          this.$Message.success('创建成功');
          this.$router.push({path: '/home/KBManage'});
        }).then(() => {
          this.getQuestionList();
        });
      }
      if(this.modalCondition.create_or_modify_qst.type === 'modify') {
        this.$api.kb.update(data).then(() => {
          this.$Message.success('修改成功');
          this.$router.push({path: '/home/KBManage'});
        }).then(() => {
          this.getQuestionList();
        });
      }
    },
    //删除
    deleteQuestion(params) {
      this.$Modal.confirm({
        title: '确定要删除问题：‘' + params.question +'’',
        width: '260',
        onOk: () => {
          this.$api.kb.delete({
            kids: [params.kid]
          }).then(() => {
            this.$Message.success('删除成功');
          }).then(() => {
            this.getQuestionList();
            this.$router.push({
              path: '/home/KBManage'
            });
          }).catch(() => {
            this.$Message.error('删除失败');
          });
        },
        onCancel: () => {
        }
      });
    }
  },
  created() {
    if(this.$validation.isEmptyObj(this.$route.query)) {
      this.$router.push({
        path: '/home/KBManage'
      });
    }
    this.getQuestionList();
  },
  mounted() {
  },
  updated() {
  }
};
</script>
<style lang="less" scoped>
.kbm-wrap {
  width: 100%;
  background: #F0F2F5;
  // height: 90vh;
  // overflow: hidden;
  .table-part {
    display: flex;
    flex-direction: row;
    flex: 0 1 auto;
    padding: 24px;
    .category {
      width: 22%;
      min-height: 400px;
      max-height: 80vh;
      overflow: auto;
    }
    .content {
      width: 78%;
      min-width: 400px;
      margin-left: 24px;
      overflow: auto;
    }
  }
}
</style>
