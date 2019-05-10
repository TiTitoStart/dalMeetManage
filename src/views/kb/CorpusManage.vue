<template>
  <div class="fm-wrap">
    <div class="search-area">
      <div class="search-item">
        <Input placeholder="输入问题" style="width: 180px"></Input>
        <Button type="primary" class="marginLeft20">查询</Button>
      </div>
      <Button type="primary" class="right"><Icon type="ios-add" size="20"/>新建</Button>
    </div>
    <Table :columns="kbColumnsData" :data="kbListData" :height="$store.state.tableHeight"></Table>
    <div class="page-section marginTop20">
      <Page :total="total" :current="pages"  :page-size="$store.state.pageSize" show-total @on-change="changePage"></Page>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      from: 0,//开始是第几条数据
      total:0,
      pages:1,//当前页数
      kbColumnsData: [
        {
          title: '问题',
          key: 'question',
          align: 'center'
        },
        {
          title: '答案',
          key: 'answers',
          align: 'center',
          render: (h, params) => {
            return h('a',{
              style: {
                color: '#2d8cf0',
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
        },
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
          width: 90,
          title: '相似',
          key: 'similar_questions',
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.similar_questions.length);
          }
        },
        {
          width: 90,
          title: '状态',
          key: 'is_enable',
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.is_enable ? '启用' : '禁用');
          }
        },
        {
          width: 100,
          title: '最后编辑',
          key: 'last_modify',
          align: 'center',
          render: (h, params) => {
            if(params.row.action_recorders && params.row.action_recorders.length > 0) {
              return h('div', params.row.action_recorders[params.row.action_recorders.length - 1].real_name );
            }
            else {
              return h('div', '');
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                color: '#2d8cf0'
              },
            }, '操作');
          }
        }],
        kbListData: [{
          "action_recorders": [
              {
                  "action": "UPDATE",
                  "real_name": "詹志有",
                  "timestamp": 1547616399010,
                  "user_id": "425298687914bd10.477587128658690048"
              },
              {
                  "action": "UPDATE",
                  "real_name": "詹志有",
                  "timestamp": 1547616403330,
                  "user_id": "425298687914bd10.477587128658690048"
              }
          ],
          "answers": [
              {
                  "answer_type": "TEXT",
                  "content": "<p>1、请确认网关是否可以正常连接其他子设备，App版本最新</p><p>2、空调伴侣升级版添加设备的时候网关是否播报了“允许连入”</p><p>3、听到允许连入后，长按子设备按键指示灯是否蓝色闪烁</p><p>4、子设备和空调伴侣升级版靠近连接，确保没有阻挡，有可能一次连接不成功，多重试几次，一般距离超出7米外可能导致信号减弱</p><p>5、空调伴侣升级版连接的子设备数量是否已经达到了32个</p><p>6、替换其它子设备连接检查，排除设备本身故障</p><p>7、替换其它网关连接检查，排除设备本身故障</p>",
                  "priority": 1
              }
          ],
          "category": "KBC.463b9fb3c425b036",
          "channel": "KBC.3fdaa581791b96a2",
          "cids": "KBC.127aff642c,KBC.463b9fb3c425b036,KBC.3fdaa581791b96a2",
          "cnames": "网关类,空调伴侣升级版,产品售后排障",
          "group": "KBC.127aff642c",
          "is_enable": true,
          "is_timer": false,
          "is_top": false,
          "kid": "KBQ.70666ac8187511e997e9ba281a5a6ff0",
          "ktype": "QA",
          "last_modified": 1552119910609,
          "option": "",
          "question": "空调伴侣升级版添加子设备失败",
          "rdf": "",
          "similar_questions": [
              "空调伴侣添加子设备失败",
              "空调伴侣添加子设备不成功",
              "空调伴侣无法添加子设备",
              "空调伴侣添加子设备失败了"
          ],
          "state_option": "enable",
          "status": "NORMAL",
          "task": "",
          "timer": {
              "end_timestamp": 0,
              "start_timestamp": 0
          },
          "view_cnt_latest_day": 2,
          "view_cnt_latest_month": 9,
          "view_cnt_latest_week": 9
        }],
    };
  },
  methods: {
    changePage() {
      
    }
  }
};
</script>
<style lang="less" scoped>
.fm-wrap {
  padding: 16px 24px;
  background: #fff;
  .search-area {
    margin-bottom: 24px;
    .search-item {
      display: inline-block;
    }
  }
}
</style>
