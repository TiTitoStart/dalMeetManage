<template>
  <div class="users-page">
    <div class="main-conetnt">
      <div class="title-part">用户管理</div>
      <div class="search-area" style="background:#fff;padding: 12px 24px;">
        <div class="search-item">
          选择角色:
          <Select v-model="searchArea.role" style="width:200px">
            <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="search-btn">
          <Button type="primary" @click="searchUser">搜索</Button>
        </div>
        <div class="tool-btn marginLeft20 right">
          <Button type="primary" icon="md-add"  @click="showModal('create')" class="marginRight10">新增</Button>
        </div>
      </div>
      <div class="table-part" style="margin: 24px;">
        <Table :loading="isLoading" :columns="columnsData" :data="listData" :height="$store.state.tableHeight"></Table>
        <div class="page-section marginTop10 right">
          <Page :total="total" :current="page"  :page-size=size show-total @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <!-- 弹框系列-新增修改客服 -->
    <Modal
      v-model="modalCondition.create_or_modify_user.status"
      :title="modalCondition.create_or_modify_user.title"
      width="700px">
      <Form :model="userForm" ref="userForm" :label-width="80" :rules="ruleValidate">
        <FormItem label="姓名：" prop="real_name">
          <Input v-model="userForm.real_name" placeholder="Enter something..." style="width: 400px"></Input>
        </FormItem>
        <FormItem label="账号：" prop="account">
          <Input v-model="userForm.account" placeholder="Enter something..." style="width: 400px"></Input>
        </FormItem>
        <FormItem label="手机号：" prop="phone_num">
          <Input v-model="userForm.phone_num" placeholder="Enter something..." style="width: 400px"></Input>
        </FormItem>
        <FormItem label="角色" prop="role">
          <RadioGroup v-model="userForm.role">
            <Radio label="worker">客服</Radio>
            <Radio label="engineer">工程师</Radio>
            <Radio label="manager">管理员</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="handleReset">取消</Button>
        <Button type="primary" size="large" @click="userHandle(modalCondition.create_or_modify_user.type)">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  props: [],
  components: {
  },
  data() {
    return {
      from: 0,//开始是第几条数据
      size: 20,//每页数据数
      total:0,
      page:1,//当前页数
      isLoading: true,
      cityList: '',
      choose_status: '',
      userForm: {
        account: '',
        real_name: '',
        job_num: '',
        phone_num: '',
        email: '',
        role: 'worker',
        group_id: ''
      },
      searchArea: {
        group: '',
        role: ''
      },
      roleList: [
        {value: '', label: '全部'},
        {value: 'worker', label: '客服'},
        {value: 'engineer', label: '工程师'},
        {value: 'manager', label: '管理员'}
      ],
      userGroupList: [],//分组
      modalCondition: {
        create_or_modify_user: {
          type: 'create',
          title: '创建',
          status: false
        },
        look_qst: false
      },
      ruleValidate: {
        account: [{ required: true, message: '必填字段', trigger: 'blur' }],
        real_name: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        job_num: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ],
        phone_num: [{ required: true, message: '必填字段', trigger: 'blur' },
        { type: 'string', min: 11, max:11, message: '请输入正确手机号', trigger: 'blur',
          transform(value) {
            let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if(!reg.test(value)) {
              return false;
            }
            else { return value;}
          }
        }],
        role: [{ required: true, message: '必填字段', trigger: 'blur' }],
        group_id: [{ required: true, message: '必填字段', trigger: 'blur' }]
      },
      columnsData: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'real_name',
          align: 'center'
        },
        // {
        //   title: '工号',
        //   key: 'job_num',
        //   align: 'center'
        // },
        {
          title: '账号',
          key: 'account',
          align: 'center'
        },
        {
          title: '手机号',
          key: 'phone_num',
          align: 'center'
        },
        // {
        //   title: '分组',
        //   key: 'group_name',
        //   align: 'center'
        // },
        {
          width: 100,
          title: '角色',
          key: 'role',
          align: 'center',
          render: (h, params) => {
            if(params.row.role === 'worker') {
              return h('div', '客服');
            }
            if(params.row.role === 'manager') {
              return h('div', '管理员');
            }
            if(params.row.role === 'engineer') {
              return h('div', '工程师');
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                    type: 'primary',
                    size: 'small'
                },
                style: {
                    marginRight: '5px'
                },
                on: {
                    click: () => {
                      this.showModal('modify', params);
                    }
                }
              }, '修改'),
              h('Button', {
                props: {
                    type: 'error',
                    size: 'small'
                },
                on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '确定要删除用户：' + params.row.real_name +'?',
                        width: '260',
                        onOk: () => {
                          this.delUsersList({
                            accounts: [params.row.account]
                          });
                        },
                        onCancel: () => {
                        }
                      });
                    }
                }
              }, '删除')
            ]);
          }
        }
      ],
      listData: []
    };
  },
  created() {

  },
  mounted() {
    this.getUsersList({});
  },
  methods: {
    showModal(type, params) {
      switch (type) {
        case 'create':
          this.$refs['userForm'].resetFields();
          this.modalCondition.create_or_modify_user = {
            title: '创建',
            status: true,
            type: 'create'
          };
          break;
        case 'modify':
          this.modalCondition.create_or_modify_user = {
            title: '修改',
            status: true,
            type: 'modify'
          };
          let dataTemp = this.$utils.deepClone(params.row);
          this.userForm = dataTemp;
          break;
      }
    },
    handleReset() {
      this.modalCondition.create_or_modify_user.status = false;
      this.$refs['userForm'].resetFields();
    },
    changePage(page) {
    this.page = page;
    this.isLoading = true;
    this.getUsersList(this.searchArea);
    },
    getUsersList(params) {
      this.isLoading = true;
      params.page = this.page;
      params.size = this.size;
      this.$api.csm.getUsers(params).then(res => {
        this.listData = res.bot_users || [];
        this.total = res.hits || 0;
        this.isLoading = false;
      }).catch(() => {
        this.isLoading = false;
      });
    },
    delUsersList(params) {
      this.isLoading = true;
      this.$api.csm.deleteUsers(params).then(() => {
        this.getUsersList({});
      }).catch(() => {
        this.isLoading = false;
      });
    },
    userHandle(type) {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
           let data = [{
              account: this.userForm.account,
              real_name: this.userForm.real_name,
              job_num: this.userForm.job_num,
              phone_num: this.userForm.phone_num,
              email: this.userForm.email,
              role: this.userForm.role,
              group_id: this.userForm.group_id
            }];
            if (type == 'create') {
              this.$api.csm.addUsers(data).then(() => {
                this.modalCondition.create_or_modify_user.status = false;
                this.handleReset();
                this.getUsersList({});
              });
            }
            if (type == 'modify') {
              this.$api.csm.modifyUsers(data).then(() => {
                this.modalCondition.create_or_modify_user.status = false;
                this.handleReset();
                this.getUsersList({});
              });
            }
        } else {
            this.$Message.error('请将标红的信息填写完整!');
        }
      })
    },
    searchUser() {
      this.from = 0;
      this.page = 1;
      this.getUsersList({
        group_id: this.searchArea.group_id,
        role: this.searchArea.role
      });
    },
    //分组列表
    getGroupsList() {
      this.$api.csm.getUsersGroup({
      }).then(res => {
        this.userGroupList = [{
          group_id: '',
          name: '全部'
        }].concat(res.kb_user_groups || []);
      });
    },
  }
};
</script>
<style lang="less" scoped>
  .users-page {
    position: relative;
    // padding: 12px 24px;
    .tool-btn {
      margin-bottom: 10px;
    }
    //弹框垂直居中
    .modal-style {
      margin: 0 auto;
    }
  }
  .info-item {
    .similar-qst-item {
      .common-btn {
        display: inline-block;
        width: 40px;
        height: 22px;
        line-height: 22px;
        color: #fff;
        font-size: 12px;
        border-radius: 4px;
        text-align: center;
        margin-left: 10px;
      }
      .blue {
        background: #19be6b;
      }
      .gray {
        background: #c5c8ce;
      }
    }
    .record-item {
      span {
        display: inline-block;
        margin-left: 20px;
      }
    }
  }
  .search-area {
		width: 100%;
		margin-bottom: 20px;
		.search-item {
			width: 30%;
			min-width: 200px;
			margin-bottom: 10px;
			margin-right: 8px;
			display: inline-block;
		}
		.search-btn {
			display: inline-block;
		}
	}
</style>

