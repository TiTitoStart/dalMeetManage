<template>
  <div class="fm-wrap">
    <div class="main-conetnt" v-if="!$route.params.options">
      <div class="title-part">动态运营管理</div>
      <div class="table-part" style="padding: 24px;">
        <div class="search-area">
          <div class="search-item" v-if="$store.state.categoryDataAll">
            <Cascader :data="$store.state.categoryDataAll" v-model="categoryValue"></Cascader>
          </div>
          <div class="search-item">
            <Input placeholder="输入领域、答案" style="width: 180px" v-model="searchArea.keyword" />
            <Button type="primary" class="marginLeft20" @click="getListByQuery">查询</Button>
          </div>
          <div class="right"><Button type="primary" @click="showModal('create')"><Icon type="ios-add" :size="20" />新建</Button></div>
        </div>
        <Table :columns="fieldColumnsData" :data="fieldListData" :height="$store.state.tableHeight" :loading="isLoading"></Table>
        <div class="page-section marginTop20 right">
          <Page :total="total" :current="page"  :page-size="$store.state.pageSize" show-total @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <!-- 创建修改 -->
    <div class="options-part" v-if="$route.params.options === 'add' || $route.params.options === 'edit'">
      <div class="opt-title">
        <span class="title-content">{{modalCondition.create_or_modify_fd.title}}</span>
      </div>
      <KbForm @getFormData="questionHandle" :formData="modalCondition.create_or_modify_fd.type === 'modify' ? rowChooseData:''"></KbForm>
    </div>
    <!-- 查看详情 -->
    <div class="options-part" v-if="$route.params.options === 'look'">
      <div class="opt-title">
        <span  style="font-size: 20px;font-weight:600;">{{rowChooseData.question}}</span>
        <div class="right" style="font-size: 14px">
          <Button type="error" class="marginRight10" @click="deleteField(rowChooseData)">删除</Button>
          <Button type="primary"  @click="showModal('modify', rowChooseData)">修改</Button>
        </div>
      </div>
      <KbLook :detailData="rowChooseData"></KbLook>
    </div>
  </div>
</template>

<script>
const Loading = r => require.ensure([], () => r(require('@/components/Loading'), 'Loading'));
const KbLook = r => require.ensure([], () => r(require('@/components/kb/KbLook'), 'KbLook'));
const KbForm = r => require.ensure([], () => r(require('@/components/kb/KbForm'), 'KbForm'));
export default {
  components: { Loading, KbForm, KbLook},
  data() {
    return {
      from: 0,//开始是第几条数据
      total:0,
      page:1,//当前页数
      isLoading: false,
      rowChooseData: '',
      searchArea: {
        keyword: ''
      },
      categoryData: [],
      categoryValue: [],
      modalCondition: {
        create_or_modify_fd: {
          type: 'create',
          title: '创建领域'
        }, 
        look_qst: {
          title: '查看详情',
          status: false
        } //查看
      },
      fieldColumnsData: [
        {
          title: '内容',
          key: 'content',
          align: 'center'
        },
        {
          title: '图片',
          key: 'imgs_url',
          align: 'center',
          render: (h, params) => {
            let arr = [];
            params.row.imgs_url.forEach(item => {
              arr.push(h('img', {
                attrs: {
                  src: item,
                  style: 'width: 70px;border-radius: 2px;'
                }
              }))
            });
            return h('div', arr);
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
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            let that = this;
            return h('div',[h('Button', {
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
                          this.deleteField(params.row);
                        }
                      }
                    },'删除')])
          }
        }],
      fieldListData: []
    };
  },
  methods: {
    showModal(type, params) {
      switch (type) {
        case 'create':
          this.modalCondition.create_or_modify_fd = {
            type: type,
            title: '创建领域'
          };
          this.$router.push({
            path: '/home/FieldManage/add',
            query: {
              options: '创建领域'  
            }
          });
          break;
        case 'modify':
          this.modalCondition.create_or_modify_fd = {
            type: type,
            title: '修改领域'
          };
          this.rowChooseData = this.$utils.deepClone(params);
          this.$router.push({
            path: '/home/FieldManage/edit',
            query: {
              options: '修改领域',
              id: this.rowChooseData.kid
            }
          });
          break;
        case 'look':
          this.modalCondition.look_qst.title = '查看详情';
          this.modalCondition.look_qst.status = true;
          this.rowChooseData = this.$utils.deepClone(params);
          this.$router.push({
            path: '/home/FieldManage/look',
            query: {
              options: '领域详情',
              id: this.rowChooseData.kid
            }
          });
          break;
      }
    },
    changePage(page) {
      this.page = page;
      this.getFieldList({
        keyword: this.searchArea.keyword,
        department: this.categoryValue[0],
        group: this.categoryValue[1],
        category: this.categoryValue[2],
        channel: this.categoryValue[3],
      });
    },
    getFieldList(params) {
      this.isLoading = true;
      this.$api.moment.query(params).then(res => {
        this.fieldListData = res;
        this.isLoading = false;
      });
    },
    //查询
    getListByQuery() {
      this.page = 1;
      this.getFieldList({
        keyword: this.searchArea.keyword,
        department: this.categoryValue[0],
        group: this.categoryValue[1],
        category: this.categoryValue[2],
        channel: this.categoryValue[3],
      });
    },
    //创建修改
    questionHandle(fdForm) {
      let data = [{
        kid: fdForm.kid,
        question: fdForm.question,
        similar_questions: fdForm.similar_questions,
        answers: [{
          content: fdForm.answer,
          attachments: fdForm.attachments
        }],
        cids: fdForm.category_result,
        switch_config: fdForm.state_option,
        recommend_knowledges: fdForm.recommend_knowledges,
        timer: fdForm.state_option === 'timer_enable'? {
          start_timestamp: fdForm.timer[0],
          end_timestamp: fdForm.timer[1]
        } : {}
      }];
      if(this.modalCondition.create_or_modify_fd.type === 'create') {
        this.$api.field.add(data).then(() => {
          this.$Message.success('创建成功');
        }).then(() => {
          this.getFieldList();
          this.$router.push({path: '/home/FieldManage'});
        });
      }
      if(this.modalCondition.create_or_modify_fd.type === 'modify') {
        this.$api.field.update(data).then(() => {
          this.$Message.success('修改成功');
        }).then(() => {
          this.getFieldList();
          this.$router.push({path: '/home/FieldManage'});
        });
      }
    },
    //删除
    deleteField(params) {
      this.$Modal.confirm({
        title: '确定要删除领域：‘' + params.question +'’',
        width: '260',
        onOk: () => {
          this.$api.field.delete({
            kids: [params.kid]
          }).then(() => {
            this.$Message.success('删除成功');
          }).then(() => {
            this.getFieldList();
            this.$router.push({
              path: '/home/FieldManage'
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
        path: '/home/FieldManage'
      });
    }
  },
  mounted() {
    this.getFieldList();
  }
};
</script>
<style lang="less" scoped>
.fm-wrap {
  background: #F0F2F5;
}
</style>
