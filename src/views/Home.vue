<template>
  <Layout :style="{height: '100%', width: '100%', 'min-width': '960px'}" class="home-wrap">
    <Sider ref="sider" hide-trigger width="240" :style="{background: '#001529', 'z-index': 100}" collapsible :collapsed-width="100" v-model="isCollapsed">
      <Header :style="{background: '#002140', color: '#fff', overflow: 'hidden'}">
        <div style="font-size: 20px;font-weight: 400;">绿米AI客服运营后台</div>
      </Header>
      <Menu :activeName="$store.state.selectedMenuId" width="auto" theme="dark" :openNames="[$store.state.selectedMenuId.split('-')[0]]" :class="menuitemClasses">
        <div v-for="(item,index) in meau" :key="index">
          <MenuItem v-if="!item.child && item.role.includes(userInfo.role)" :name="item.level" :to="item.url" :class="index === 0 && $store.state.selectedMenuId.split('-')[0] === '1'?'ivu-menu-item ivu-menu-item-active ivu-menu-item-selected .ivu-menu-dark.ivu-menu-item-active .ivu-menu-item-selected':''" >
            <Icon :type="item.icon"></Icon>
            <span>{{item.menuName}}</span> 
          </MenuItem>
          <Submenu v-if="item.child && item.role.includes(userInfo.role)" :name="item.level" :to="item.url">
            <template slot="title">
              <Icon :type="item.icon"></Icon>
              <span :class="item.child?'':'hide-arrow'">{{item.menuName}}</span>
            </template>
            <MenuItem v-if="child" :name="child.level" :to="child.url" v-for="child in item.child" :key="child.level" >{{child.menuName}}</MenuItem>
          </Submenu>
        </div>
      </Menu>
      <Icon @click.native="collapsedSider" :class="rotateIcon" style="position: absolute; top: 20px;right: -40px;z-index: 99;" type="md-menu" size="24"></Icon>
    </Sider>
    <Layout :style="{height: '100vh','overflow-y': 'auto' }">
      <Header class="layout-header-bar">
        <div class="user">
          <!-- <span class="notice"><Badge dot style="display:inline;"><Icon type="ios-notifications-outline" :size="22"/></Badge></span> -->
          <Avatar :src="require('../assets/images/user-s.png')"/>
          <!-- <img src="../assets/images/user-s.png"> -->
          <Dropdown style="margin-left:10px;">
            <a href="javascript:void(0)" style="color:#333;">
              {{userInfo.real_name}}
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem><span class="dropdown-item" @click="loginOut">退出登入</span></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Header>
      <Layout :style="{padding: '12px 24px 0 24px', background: '#fff'}">
        <Breadcrumb separator=">" target style="padding-bottom: 0">
          <BreadcrumbItem :to="breadcrumb.url" v-for="(breadcrumb,index) in $store.state.breadcrumbList" :key="index" >{{breadcrumb.name}}</BreadcrumbItem>
        </Breadcrumb>
      </Layout>
      <Layout :style="{ height: '100%', position: 'relative'}">
        <Content :style="{padding: '0', minHeight: '75vh'}">
          <router-view></router-view>
        </Content>
      </Layout>
    </Layout>
  </Layout>
</template>
<script>
  import meau from '../assets/js/meau';
  export default {
    watch: {
      $route(to, from, next) {
        if(to.params.options) {
          let breadcrumbList = [];
          let menuId = to.meta.menuIdAndBreadcrumb.menuId || from.meta.menuIdAndBreadcrumb && from.meta.menuIdAndBreadcrumb.menuId;
          if(from.meta.menuIdAndBreadcrumb) {
            breadcrumbList = this.$utils.deepClone(from.meta.menuIdAndBreadcrumb.breadcrumbList);
          }
          else {
            breadcrumbList = this.$utils.deepClone(to.meta.menuIdAndBreadcrumb.breadcrumbList);
          }
          breadcrumbList.push({ 
            url: to.fullPath,
            name: to.query.options
          });
          this.$store.commit('updateMenuIdAndBreadcrumb', {
            menuId: menuId,
            breadcrumbList: breadcrumbList
          });
          sessionStorage.setItem('menuId', menuId);
          sessionStorage.setItem('breadcrumbList', JSON.stringify(breadcrumbList));
        }
      }
    },
    data() {
      return {
        meau: meau.menus,
        isCollapsed: false,
        userInfo: this.$localStorage.getValue('userInfo')
      }
    },
    computed: {
      rotateIcon () {
        return [
          'menu-icon',
          this.isCollapsed ? 'rotate-icon' : ''
        ];
      },
      menuitemClasses () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      }
    },
    methods: {
      collapsedSider () {
        this.$refs.sider.toggleCollapse();
      },
      loginOut() {
        this.$localStorage.setValue('userInfo', '');
        this.$router.push({path: '/login'});
      },
      getCategorySelections() {
        this.$api.category.query({
        }).then(res => {
          //此处处理不完美，谨防有坑，如遇更好措施，请更改
          let categoryData = JSON.parse(JSON.stringify(res).replace(/cid/g,'value').replace(/cname/g,'label').replace(/sub_bot_categorys/g,'children'));
          this.$store.commit('updateCategoryData', categoryData);
        });
      },
      getCategorySelectionsAll() {
      this.$api.category.query({
        include_total: 1 //包含全部
      }).then(res => {
        let categoryData = JSON.parse(JSON.stringify(res).replace(/cid/g,'value').replace(/cname/g,'label').replace(/sub_bot_categorys/g,'children'));
        this.$store.commit('updateCategoryDataAll', categoryData);
      });
    }
    },
    created() {
    },
    mounted() {
      if(!this.userInfo) {
        this.$router.push({
          name: 'login'
        });
      }
      this.getCategorySelections();
      this.getCategorySelectionsAll();
      if( window.innerWidth < 1100) {
        this.$refs.sider.toggleCollapse();
      }
    }
  }
</script>
<style lang="less" scoped>
.home-header {
  height: 96px;
  display: flex;
  align-items: center;
  .content {
    display: inline-block;
    margin-left: 22px;
    padding-bottom: 6px;
  }

}
.home-wrap {
  width: 100%;
  display: flex;
  flex-direction: row;
}
</style>

<style scoped>
  #app {
    height: 100vh;
    min-width: 960px;
  }
  .layout-header-bar{
      background: #fff;
  }
  .ivu-layout-header {
    padding: 0 30px;
  }
  .layout-logo-left{
      width: 90%;
      height: 30px;
      background: #5b6270;
      border-radius: 3px;
      margin: 15px auto;
  }
  .menu-icon{
      transition: all .2s;
  }
  .rotate-icon{
      transform: rotate(-90deg);
  }
  .menu-item span{
      display: inline-block;
      overflow: hidden;
      width: 66px;
      height: 20px;
      /* text-overflow: ellipsis; */
      /* white-space: nowrap; */
      vertical-align: bottom;
      transition: width .2s ease .2s;
  }
  .menu-item i{
      transform: translateX(0px);
      transition: font-size .2s ease, transform .2s ease;
      vertical-align: middle;
      font-size: 16px;
  }
  .collapsed-menu span{
      width: 0px;
      transition: width .2s ease;
  }
  .collapsed-menu i{
      transform: translateX(5px);
      transition: font-size .2s ease .2s, transform .2s ease .2s;
      vertical-align: middle;
      font-size: 22px;
  }
  .hide-arrow {
    display: inline-block;
    width: 80% !important;
    position: absolute;
    left: 50px;
    top: 14px;
    z-index: 99;
    background: inherit;
  }
  .ivu-breadcrumb {
    margin : 0;
    padding-bottom: 10px;
  }
  .user {
    padding-right: 36px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 98;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
  }
  .user-name {
    margin-left: 6px;
    color: rgba(0,0,0,0.65);
    font-size: 14px;
  }
  .notice {
    margin-right: 24px;
  }
  .dropdown-item {
    width: 100%;
    height:100%;
    padding: 4px 12px;
    color:#333;
    display: flex;
    align-items: center;
  }
</style>
