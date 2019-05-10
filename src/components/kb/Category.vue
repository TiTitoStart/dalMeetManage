<template>
  <div class="category-wrap">
    <div class="title">
      <span class="left">分类</span>
      <span v-if="type !== 'option'" class="right font-color-blue" style="cursor:pointer" @click="modalCondition.create_category = true">添加分类</span>
    </div>
    <div class="data">
      <Tree :data="categoryData" :render="treeRenderContent"></Tree>
    </div>
    <!-- 创建分类 -->
    <Modal
        v-model="modalCondition.create_category"
        title="创建分类"
        footer-hide
        width="600px">
        <Form :labelWidth="100">
          <FormItem label="选择业务:">
            <Select style="width: 200px;" v-model="business.cid" @on-change="businessChange()">
              <Option v-for="(item, index) in categoryData" :value="item.value" :key="index" >{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="item.title + ':'" class="select-item" v-for="(item, index) in categoryFormList" :key="index">
              <Select v-model="item.cid" style="width: 200px;" @on-change="selectCategoryChange(item, index)">
                <Option value="" label="">
                  <span style="color: #1890FF;font-size:12px;width: 100%;display:inline-block;" @click="item.is_new = true;item.cname=''">新增</span>
                </Option>
                <Option v-for="(dataItem, indexItem) in item.data" :value="dataItem.value" :key="indexItem">{{dataItem.label}}</Option>
              </Select>
              <Input placeholder="输入分类名" v-model="item.cname" style="width: 150px;margin-left: 12px;" v-if="item.is_new"></Input>
          </FormItem>
          <FormItem label="三级分类:">
            <Input v-model="thirdCategory.cname" placeholder="输入分类名" style="width: 200px;"></Input>
          </FormItem>
        </Form>
        <div class="bottom-btn">
          <Button type="text" size="large" @click="handleResetCreate">取消</Button>
          <Button type="primary" size="large" @click="addCategory()">创建</Button>
        </div> 
    </Modal>
    <!-- 修改分类名 -->
    <Modal
      v-model="modalCondition.modify_cname"
      title="修改分类"
      width="500px"
      footer-hide
      @on-ok="">
      <Form :labelWidth="100">
        <FormItem label="分类名:">
          <Input placeholder="输入分类名" style="width: 200px;"></Input>
        </FormItem>
      </Form>
      <div class="bottom-btn">
        <Button type="text" size="large" @click="handleResetCreate">取消</Button>
        <Button type="primary" size="large" @click="addCategory()">创建</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  props: ['type'],
  data() {
    return {
      isLoading: false,
      previousTreeDom: {},
      modalCondition: {
        create_category: false,
        modify_cname: false
      },
      business: {
        ctype: 'department',
        cid: ''
      },
      categoryFormList: [{
          title: '一级分类',
          ctype: 'group',
          cid: '',
          cname: '',
          data: [],
          is_new: false
        },{
          title: '二级分类',
          ctype: 'category',
          cid: '',
          cname: '',
          data: [],
          is_new: false
        }
      ],
      thirdCategory: {
        cname: ''
      },
      categoryData: [],
      isMoveIn : false,
      modifyCategoryForm: {
        value: '',//cid
        label: ''//cname
      }
    };
  },
  methods: {
    handleResetCreate() {
      this.modalCondition.create_category = false;
    },
    getCategorySelections() {
      this.$api.category.query({
      }).then(res => {
        //此处处理不完美，谨防有坑，如遇更好措施，请更改
        this.categoryData = JSON.parse(JSON.stringify(res).replace(/cid/g,'value').replace(/cname/g,'label').replace(/sub_bot_categorys/g,'children'));
        // this.categoryFormList[0].data = this.categoryData;
        this.$store.commit('updateCategoryData', this.categoryData);
      });
    },
    addCategory() {
      if(!this.categoryFormList[0].cname || !this.categoryFormList[1].cname || !this.thirdCategory.cname) {
        this.$Message.error('请将所有分类信息填写完整');
      }
      else {
        let data = {
          is_chained: 1,
          categorys: [{
            ctype: 'department',
            parent_cid: '',
            cid: this.business.cid
          },{
            ctype: 'group',
            cname: this.categoryFormList[0].cname,
            parent_cid: this.business.cid,
            cid: this.categoryFormList[0].cid
          },{
            ctype: 'category',
            cname: this.categoryFormList[1].cname,
            parent_cid: this.categoryFormList[0].cid,
            cid: this.categoryFormList[1].cid     
          },{
            ctype: 'channel',
            cname: this.thirdCategory.cname,
            parent_cid: this.categoryFormList[1].cid         
          }]
        }
        this.$api.category.add(data).then(res => {
          this.$Message.success('创建成功');
          this.modalCondition.create_category = false;
          this.getCategorySelections();
        }).catch(() => {
          this.$Message.error('创建失败');
        });
      }

    },
    selectCategoryChange(item, index) {
      let dataIndex = this.$utils.arrayObjIndexOf(item.data, 'value', item.cid);
      if(item.cid) {
        this.categoryFormList[index].is_new = false;
        this.categoryFormList[index].cname = item.data[dataIndex].label;
      }
      if(item.ctype === 'group') {
        this.categoryFormList[1].data = item.data[dataIndex].children || [];
      }
    },
    businessChange() {
      let dataIndex = this.$utils.arrayObjIndexOf(this.categoryData, 'value', this.business.cid);
      this.categoryFormList[0].data = this.categoryData[dataIndex].children;
    },
    treeRenderContent(h, { root, node, data }) {
        let that = this;
         return h('div', {
            style: {
              display: 'inline-block',
              width: '98%',
              padding: '6px'
            },
            on: {
              mouseleave: (event) => {
                event.target.parentNode.querySelectorAll('.ivu-poptip').forEach(item => {
                  item.style.visibility = 'hidden';
                });
              }
            }
        }, [
          h('div', {
            style: {
              display: 'flex',
              'align-items': 'center',
              width: '94%'
            },
            on: {
              mouseenter: (event) => {
                if(this.type !== 'option') {
                  event.target.querySelectorAll('.ivu-poptip').forEach(item => {
                    if(data.ctype === 'department') {
                      item.style.visibility = 'hidden';
                    }
                    else {
                      item.style.visibility = 'visible';
                    }
                  });
                }
              }
            }
          }, [
            h('span', {
                style: {
                  cursor: 'pointer',
                  wordBreak: 'normal',
                  width: '90%',
                  // minWidth: '100px', 
                  display: 'block', 
                  whiteSpace: 'pre-wrap',
                  wordWrap : 'break-word',
                  overflow: 'hidden',
                  display: 'inline-block',
                  background: ''
                },
                on: {
                  click: (event) => {
                    if(this.previousTreeDom != event.target.className) {
                      event.target.parentNode.parentNode.className = 'ivu-tree-title-selected';
                      this.previousTreeDom.className  = '';
                    }
                    else {
                      event.target.parentNode.className = 'ivu-tree-title-selected';

                    }
                    this.previousTreeDom = event.target.parentNode.parentNode;
                    if(data.ctype === 'department') {
                      this.$emit('searchByCategory', {
                        department: data.value
                      });
                    }
                    if(data.ctype === 'channel') {
                      this.$emit('searchByCategory', {
                        channel: data.value
                      });
                    }
                    if(data.ctype === 'group') {
                      this.$emit('searchByCategory', {
                        group: data.value
                      });
                    }
                    if(data.ctype === 'category') {
                      this.$emit('searchByCategory', {
                        category: data.value
                      });
                    }
                  }
                }
              }, data.label),
              h('Poptip', {
                props: {
                  confirm: 'confirm',
                  placement: 'right'
                },
                style: {
                  visibility: 'hidden'
                },
                on: {
                  'on-ok': ()=> {
                     this.$api.category.update([{
                       cid: data.value,
                       ctype: data.ctype,
                       cname: this.modifyCategoryForm.label,
                       parent_cid: data.parent_value 
                     }]).then(res => {
                       this.$Message.success('修改成功');
                       this.getCategorySelections();
                     });
                  },
                  'on-cancel': () => {

                  }
                }
                },[
                  h('Icon', {
                    props: {
                      type: "ios-create-outline",
                      size: 20
                    },
                    on: {
                      click: () => {
                        this.modifyCategoryForm = {
                          value: data.value,
                          label: data.label
                        }
                      }
                    }
                  }),
                  h('div', {
                    props: {
                      type: "ios-create-outline",
                      size: 20
                    },
                    slot: 'title'
                  }, [h('span', {}, '修改名称：'),h('Input', {
                    style: {
                      width: '120px'
                    },
                    props: {
                      value: this.modifyCategoryForm.label
                    },
                    on: {
                      'on-change': (event) => {
                        this.modifyCategoryForm.label = event.target.value;
                      } 
                    }
                  })])
              ]),h('Poptip', {
                props: {
                  confirm: 'confirm',
                  placement: 'right'
                },
                style: {
                  visibility: 'hidden'
                },
                on: {
                  'on-ok': (event)=> {
                   this.$api.category.delete({
                     cids: [data.value]
                   }).then(res => {
                     this.$Message.success('删除成功');
                     this.getCategorySelections();
                   });
                  }
                }
                },[
                  h('Icon', {
                    props: {
                      type: "ios-trash-outline",
                      size: 20
                    }
                  }),
                  h('div', {
                    props: {
                      type: "ios-create-outline",
                      size: 20
                    },
                    slot: 'title'
                  }, [h('span', {}, '确定要删除"' + data.label +'"分类吗？')])
              ])
          ])
        ]);
      }
  },
  mounted() {
    this.getCategorySelections();
  }
};
</script>
<style lang="less" scoped>
.category-wrap {
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  background: #fff;
  .title {
    height: 42px;
    // background: #FAFAFA;
    background: #f8f8f9;
    padding: 14px;
  }
  .data {
    padding: 14px;
  }
}
.select-item {
  position: relative;
}
.new-btn {
  display: inline-block;
  width: 46px;
  height: 32px;
  line-height: 30px;
  background: #1890FF;
  text-align: center;
  color: #fff;
  border-radius: 0 4px 4px 0;
  border-left: 1px solid #dcdee2;
  position: absolute;
  top: -19px;
  left: -4px;
  cursor: pointer;
}
.bottom-btn {
  padding-top: 20px;
  display: flex;
  justify-content: center;
}
.category-item-selected {
  background: #5cadff;
  color: #2d8cf0;
}
</style>
