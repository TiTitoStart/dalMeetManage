<template>
  <div class="loading-warp" v-if="isShow">
    <div class="loading">
      <Spin fix>
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin>
    </div>
  </div>  
</template>
<script>
export default {
  props: ['isShow'],
  data() {
    return {};
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    }
  }
};
</script>
<style lang="less" scoped>
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.loading-warp {
  position: relative;
  width: 100%;
  height: 100%;
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  // min-height: 75vh;
}
</style>
