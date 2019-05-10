<template>
  <div class="login_wrap">
    <div class="content-left">
      <div class="title">
        <img src="../../assets/images/login-title.png">
        <span>绿米智能客服运营后台</span>
      </div>
      <div class="my-img">
        <img src="../../assets/images/login-bg.png"/>
      </div>
    </div>
    <div class="content-right">
        <div class="login-icon"><img src="../../assets/images/login-icon.png"/></div>
        <div class="title">Sign in to LUMI AI Conversation Tagging</div>
        <div class="form_wrap">
          <div class="user-info">
            <div class="input-item">
              <!-- <span>账号:</span> -->
              <Input v-model="account" prefix="ios-contact" placeholder="Enter account" class="user-input"/>
            </div>
            <div class="input-item" style="margin-bottom: 16px;">
              <!-- <span>密码:</span> -->
              <Input v-model="password" type="password" prefix="ios-lock" placeholder="Enter password" class="user-input"/>
            </div>
            <br>
            <div class="left">
              <CheckboxGroup v-model="isRem">
                <Checkbox label="0">记住账号</Checkbox>
              </CheckboxGroup>
            </div>
            <div class="login-btn" @click="userLogin" style="padding-bottom: 20px;">
              <Button type="primary" style="margin-top: 40px;width: 100%;height: 36px;">登录</Button>
            </div>
          </div>
        </div>
        <div class="to-connect">还没有账号? 请联系管理员</div>
    </div>
    <!-- <div class="my-bottom">
      <div class="my-link">
         <span><a href="http://www.lumiunited.com/nav/about/about.php" target="_blank">关于绿米</a></span>
         <span><a href="http://www.lumiunited.com/nav/service/service.php" target="_blank">服务支持</a></span>
         <span><a href="http://www.lumiunited.com/nav/products/product.php" target="_blank">产品中心</a></span>
         <span><a href="Mailto:sales@lumiunited.com" target="_blank">联系我们</a></span>
      </div>
      <div class="copyright">Copyright © 2015-2019版权所有 粤ICP备15041247号 深公网安备4403300900606号</div>
    </div> -->
  </div>
</template>
<script>
import HomeRouter from '../../router/modules/home';
export default {
    data() {
      return {
        account: '',
        password: '',
        isRem: []
      };
    },
    created() {
      let that = this;
      document.onkeypress = function(e) {
        let keycode = document.all ? event.keyCode : e.which;
        if (keycode == 13) {
          that.userLogin();// 登录方法名
          return false;
        }
      };
    },
    mounted() {
      if(this.$localStorage.getValue('account')) {
        this.account = this.$localStorage.getValue('account');
        this.isRem = this.$localStorage.getValue('isRem')
      }
    },
    methods: {
      userLogin() {
        if(this.account === '' || this.password === '') {
          this.$Message.error('请将信息填写完整');
        }
        else {
          this.$api.login({
            account: this.account,
            password: this.$md5(this.password)
          }).then(res => {
            this.$localStorage.setValue('userInfo', res);
            //记住用户和账号
            if(this.isRem[0] === '0') {
              this.$localStorage.setValue('account', this.account);
              this.$localStorage.setValue('isRem', this.isRem);
            }
            else {
              this.$localStorage.setValue('account', '');
            }
            this.$Message.success('登入成功');
            // this.$router.addRoutes(HomeRouter);
            this.$router.push({
              path: '/Home'
            });
            // if(res.role === 'worker') {
            //   this.$router.push({
            //       path: '/Home/Main'
            //     });
            //   }
            // else if(res.role === 'engineer') {
            //   this.$router.push({
            //     path: '/Home/Main'
            //   });
            // }
            // else if(res.role === 'manager') {
            //   this.$router.push({
            //     path: '/Home/Main'
            //   });
            // }
            // else {
            //   this.$Message.error('你还没有权限，请联系管理员开通')
            // }
          });
        }
      }
    },
};
</script>
<style lang="less" scoped>
  .login_wrap {
    width: 100%;
    height: 100vh;
    background: #fff;
    min-width: 960px;
    .content-left {
      width: 54vw;
      background: #fff;
      padding: 24px;
      height: 100vh;
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      .title {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 60px;
        padding-top: 16px;
        padding-left: 6vw;
        span {
          font-size: 20px;
          display: inline-block;
          margin-left: 16px;
          vertical-align: middle;
        }
        img {
          width: 120px;
          vertical-align: middle;
        }
      }
      .my-img {
        width: 100%;
        min-width: 600px;
        text-align: center;
        img {
          width: 80%;
        }
      }
    }
    .content-right {
      width: 40vw;
      height: 100vh;
      background: #f9f9f9;
      float: right;
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding: 4vw;
      min-width: 360px;
      .login-icon {
        width: 4vw;
        img {
          width: 100%;
        }
      }
      .title {
        font-size: 20px;
        color: #525976;
        font-weight: bold;
        margin-top: 16px; 
      }
      .form_wrap {
        .user-info {
          .input-item {
            width: 100%;
            margin-top: 24px;
          }
        }
      }
      .to-connect {
        position: absolute;
        bottom: 24px;
      }
    }
  }
  .to-connect {
    font-size: 12px;
    color: #323139;
    margin-left: 12px;
  }
</style>

