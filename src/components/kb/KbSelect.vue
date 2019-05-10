<template>
    <div class="select-wrap">
      <div class="category">
        <Category @searchByCategory="getListByCategory" type="option"></Category>
      </div>
      <div class="table">
        <div class="search-area">
        <div class="search-item">
          <Input v-model="kbSearchArea.keyword" placeholder="输入目录名、id、标题、答案" style="width: 180px"></Input>
          <Button type="primary" class="marginLeft20" @click="getListByKey">查询</Button>
          </div>
        </div>
        <Tabs value="question">
          <TabPane :label="'问题('+kbListData.kb.total+')'" name="question">
            <Table ref="currentRowTable" highlight-row :columns="kbColumnsData" :data="kbListData.kb.data" @on-current-change="handleRowChange" height="480"></Table>
            <div class="page-section marginTop20">
              <Page :total="kbListData.kb.total" :current="kbListData.kb.page"  :page-size="$store.state.pageize" show-total @on-change="changePage(1, $event)"></Page>
            </div>
          </TabPane>
          <TabPane :label="'领域('+kbListData.fd.total+')'" name="field" v-if="type !== 'nofd'">
            <Table :columns="kbColumnsData" highlight-row :data="kbListData.fd.data"  @on-current-change="handleRowChange" height="480"></Table>
              <div class="page-section marginTop20"> 
                <Page :total="kbListData.fd.total" :current="kbListData.fd.page"  :page-size="$store.state.pageize" show-total @on-change="changePage(2, $event)"></Page>
              </div>
            </TabPane>
        </Tabs>
      </div>
    </div>
</template>
<script>
const Category = r => require.ensure([], () => r(require('@/components/kb/Category'), 'Category'));
export default {
  props: ['type'],
  components: { Category },
  data() {
    return {
      //保存问题领域查询条件
      kbSearchArea: {
        keyword: ''
      },
      //知识与领域
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
            if(params.row.similar_questions instanceof Array) {
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
        {
          title: '状态',
          key: 'is_enable',
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.is_enable ? '启用' : '禁用');
          }
        }],
      kbListData: {
        kb: {
          total: 0,
          page: 1,
          data: []
        },
        fd: {
          total: 0,
          page: 1,
          data: []
        }
      }
    };
  },
  methods: {
    changePage(type, page) {
      switch(type) {
        //获取问题
        case 1: 
        this.kbListData.kb.page = page;
        this.getQuestionList(this.kbSearchArea);break;
        //获取领域
        case 2: 
        this.kbListData.fd.page = page;
        this.getFieldList(this.kbSearchArea);break;
      }
    },
    //通过分类查询问题领域
    getListByCategory(data) {
      this.kbListData.kb.page = 1;
      this.kbListData.fd.page = 1;
      this.kbSearchArea = data;
      this.getKbAllList(data);
    },
    //通过关键字查询问题领域
    getListByKey() {
      this.kbListData.kb.page = 1;
      this.kbListData.fd.page = 1;
      this.getKbAllList({
        keyword: this.kbSearchArea.keyword
      });
    },
    //获取问题和领域列表
    getKbAllList(params) {
      params = params || {};
      params.size = this.$store.state.pageSize;
      params.page = this.page;
      this.isLoading = true;
      this.$api.kb.allQuery(params).then(res => {
        this.kbListData.kb.data = res.kpoints;
        this.kbListData.fd.data = res.kdomains;
        this.kbListData.kb.total = res.kpoint_hits;
        this.kbListData.fd.total = res.kdomain_hits;
        this.isLoading = false;
      });
    },
    //获取问题列表
    getQuestionList(params) {
      params = params || {};
      params.size = this.$store.state.pageSize;
      params.page = this.kbListData.kb.page;
      this.$api.kb.query(params).then(res => {
        this.kbListData.kb.data = res.kpoints;
      });
    },
    //获取领域列表
    getFieldList(params) {
      params = params || {};
      params.size = this.$store.state.pageSize;
      params.page = this.kbListData.fd.page;
      this.$api.field.query(params).then(res => {
        this.kbListData.fd.data = res.kdomains;
      });
    },
    //问题领域表格改变
    handleRowChange(currentRow, oldCurrentRow) {
      this.$emit('handleRowChange', currentRow);
      // this.kbCurrentRow = currentRow;
    }
  }
};
</script>
<style lang="less" scoped>
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
</style>
