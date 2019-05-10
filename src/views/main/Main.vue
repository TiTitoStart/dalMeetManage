<template>
  <div class="home-page">
    <div class="header-part">
      <span class="user-icon">
        <!-- <Icon type="ios-contact-outline" size="66"/> -->
        <img src="../../assets/images/user.png"/>
      </span>
      <div class="content">
        <p style="font-size: 20px;font-weight: 600;">{{$localStorage.getValue('userInfo').real_name}}，祝你开心每一天！</p>
        <p style="font-size: 14px;color: rgba(0,0,0,0.45);margin-top:6px;"> {{role}}</p>
      </div>
    </div>
    <div class="content-part">
      <div class="search-wrap">
        <div class="search-item">
          <span>渠道：</span>
          <Select v-model="searchArea.app_id" style="width:100px">
            <Option v-for="item in wayList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="search-item">
          <span>业务：</span>
          <Select v-model="searchArea.department" style="width:100px">
            <Option v-for="item in $store.state.categoryDataAll" :value="item.label" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="search-item">
          <Button type="primary" @click="searchData">查询</Button>
        </div>
      </div>
      <div class="data-list" v-if="analyzaData">
        <div class="data-item">
          <div class="title">总消息量</div>
          <div class="number">
            <CountTo :endVal="analyzaData.total_recorder_num" :duration="500"/>
          </div>
          <div class="rate">
            <div class="rate-item">周环比
              <span class="marginLeft4" v-if="analyzaData.recorder_week_compare">
                <small class="marginRight4">{{(analyzaData.recorder_week_compare*100).toFixed(2)}}%</small>
                <img :src="analyzaData.recorder_week_compare.indexOf('-') == -1 ? require('../../assets/images/down.png') : require('../../assets/images/up.png')"/>
              </span>
              <span class="marginLeft4" v-else>--</span>
            </div>
            <div class="rate-item">日环比              
              <span class="marginLeft4" v-if="analyzaData.recorder_day_compare">
                <small class="marginRight4">{{(analyzaData.recorder_day_compare*100).toFixed(2)}}%</small>
                <img :src="analyzaData.recorder_day_compare.indexOf('-') == -1 ? require('../../assets/images/down.png') : require('../../assets/images/up.png')"/>
              </span>
              <span class="marginLeft4" v-else>--</span>
            </div>
          </div>
          <div class="average">
            <small>日均消息量</small><span>{{analyzaData.daily_recorder_num}}</span>
          </div>
        </div>
        <div class="data-item">
          <div class="title">服务用户数</div>
          <div class="number">
            <CountTo  :endVal="analyzaData.total_user_num" :duration="500"/>
          </div>
          <div class="rate">
            <div class="rate-item flex-center">周环比
              <span class="marginLeft4" v-if="analyzaData.user_week_compare">
                <small class="marginRight4">{{(analyzaData.user_week_compare*100).toFixed(2)}}%</small>
                <img :src="analyzaData.user_week_compare.indexOf('-') == -1 ? require('../../assets/images/down.png') : require('../../assets/images/up.png')"/>
              </span>
              <span class="marginLeft4" v-else>--</span>
            </div>
            <div class="rate-item">日环比              
              <span class="marginLeft4" v-if="analyzaData.user_day_compare">
                <small class="marginRight4">{{(analyzaData.user_day_compare*100).toFixed(2)}}%</small>
                <img :src="analyzaData.user_day_compare.indexOf('-') == -1 ? require('../../assets/images/down.png') : require('../../assets/images/up.png')"/>
              </span>
              <span class="marginLeft4" v-else>--</span>
            </div>
          </div>
          <div class="average">
            <small>日用户数</small><span>{{analyzaData.today_user_num}}</span>
          </div>
        </div>        
        <div class="data-item">
          <div class="title">人工兜底率</div>
          <div class="number">{{(analyzaData.total_service_rate*100).toFixed(2)}}%</div>
          <div class="rate rate3">
            <div class="rate-item">
            </div>
            <div class="rate-item">
            </div>
          </div>
          <div class="average">
            <small>请求人工总次数</small><span>{{analyzaData.total_service_num}}</span>
          </div>
        </div>        
        <div class="data-item" style="margin-right: 0;">
          <div class="title">解决率</div>
          <div class="number">{{(analyzaData.total_reach_rate*100).toFixed(2)}}%</div>
          <div class="rate">
            <div class="rate-item">月环比              
              <span class="marginLeft4" v-if="analyzaData.reach_rate_day_compare ">
                <small class="marginRight4">{{(analyzaData.reach_rate_day_compare*100).toFixed(2)}}%</small>
                <img :src="analyzaData.reach_rate_day_compare.indexOf('-') == -1 ? require('../../assets/images/down.png') : require('../../assets/images/up.png')"/>
              </span>
              <span class="marginLeft4" v-else>--</span>
            </div>
            <div class="rate-item">
              <!-- 周环比
              <span class="marginLeft4" v-if="analyzaData.reach_rate_week_compare">
                <small class="marginRight4">{{(analyzaData.reach_rate_week_compare*100).toFixed(2)}}%</small>
                <img :src="analyzaData.reach_rate_week_compare.indexOf('-') == -1 ? require('../../assets/images/down.png') : require('../../assets/images/up.png')"/>
              </span>
              <span class="marginLeft4" v-else>--</span> -->
            </div>
          </div>
          <div class="average">
            <small>截至上次标注日期:</small><span>{{analyzaData.last_mark_date}}</span>
          </div>
        </div>
      </div>
      <div v-else style="width: 100%;height: 188px;">
        <Loading :isShow="isLoading"></Loading>
      </div>
      <div class="chart-wrap">
        <div class="title">
          <div class="x-type">
            <span :class="searchArea.trend_type === 'today' ? 'active' : ''" @click="changeTimeTab('today')">今日</span>
          <span :class="searchArea.trend_type === 'this_week' ? 'active' : ''" @click="changeTimeTab('this_week')">本周</span>
          <span :class="searchArea.trend_type === 'this_month' ? 'active' : ''" @click="changeTimeTab('this_month')">本月</span>
          <span :class="searchArea.trend_type === 'this_year'? 'active' : ''" @click="changeTimeTab('this_year')">本年</span>
          <DatePicker v-model="timerRange" confirm type="daterange" split-panels placeholder="选择时间段" style="width: 160px" @on-open-change="clickDatePicker" @on-change="getTimeHandle" @on-ok="changeTimeTab('date_zone')"></DatePicker>
          </div>
        </div>
        <!-- <LineEchart></LineEchart> -->
        <HistogramEchart :statisticsData="chartData" v-if="chartData" height="600px"></HistogramEchart>
      </div>
    </div>
  </div>
</template>
<script>
// const LineEchart = r => require.ensure([], () => r(require('@/components/LineEchart'), 'LineEchart'));
const HistogramEchart = r => require.ensure([], () => r(require('@/components/HistogramEchart'), 'HistogramEchart'));
const Loading = r => require.ensure([], () => r(require('@/components/Loading'), 'Loading'));
import CountTo  from 'vue-count-to';
export default {
  components: {
    // LineEchart, 
    HistogramEchart, CountTo, Loading
  },
  data() {
    return {
      isLoading: false,
      searchArea: {
        app_id: 'wx_cs',
        department: '',
        trend_type: 'today',
        start_date: '',
        end_date: ''
      },
      wayList: [{
        label: '全部',
        value: ''
      },{
        label: '智慧生活公众号',
        value: 'wx_cs'
      }],
      departmentList: [{

      }],
      endVal: 120500,
      role: '',
      //分析量化数据
      analyzaData: '',
      chartData: '',
      timerRange: []
    };
  },
  methods: {
    changeTimeTab(type) {
      this.searchArea.trend_type = type;
      if(this.searchArea.trend_type !== 'date_zone') {this.timerRange = [];}
      this.getChartData(this.searchArea);
    },
    searchData() {
      this.searchArea.department = this.searchArea.department == '全部' ? '' : this.searchArea.department;
      this.searchArea.trend_type = 'today';
      this.getChartData({
        trend_type: 'today',
        app_id: this.searchArea.app_id,
        department: this.searchArea.department
      });
      this.getAnalyzeData();
    },
    getTimeHandle(date) {
      this.timerRange[0] = Math.round(
        new Date(date[0])
      );
      this.timerRange[1] = Math.round(
        new Date(date[1])
      );
      this.searchArea.start_date = this.timerRange[0] ? this.$utils.formatDate((parseInt(this.timerRange[0])),'yyyy-MM-dd') : '';
      this.searchArea.end_date = this.timerRange[1] ? this.$utils.formatDate((parseInt(this.timerRange[1])),'yyyy-MM-dd') : '';
    },
    judgeRole() {
      switch(this.$localStorage.getValue('userInfo').role) {
        case 'manager': this.role = '系统管理员';break;
        case 'worker': this.role = '运维人员';break;
        case 'engineer': this.role = '算法工程师';break;
      }
    },
    getAnalyzeData() {
      this.isLoading = true;
      this.$api.statistics.get({
        app_id: this.searchArea.app_id,
        department: this.searchArea.department
      }).then(res => {
        this.analyzaData = res;
        this.isLoading = false;
      });
    },
    getChartData(params) {
      this.$api.statistics.query(params).then(res => {
        this.chartData = res;
      });
    },
    clickDatePicker() {
      this.searchArea.trend_type = 'date_zone';
    }
  },
  mounted() {
    this.judgeRole();
    this.getAnalyzeData();
    this.getChartData({
      trend_type: 'today'
    });
  }
};
</script>
<style lang="less" scoped>
.home-page {
  width: 100%;
  .header-part {
    background: #fff;
    display: flex;
    align-items: center;
    padding: 16px 24px 24px 24px;
    .user-icon {
      width: 70px;
      height: 70px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content {
      display: inline-block;
      margin-left: 22px;
      padding-bottom: 6px;
    }
  }
  .content-part {
    background: #F0F2F5;
    padding: 12px 24px;
    .search-wrap {
      padding: 12px 0 24px 0;
      .search-item {
        display: inline-block;
        margin-right: 12px;
      }
    }
    .data-list {
      padding-bottom: 24px;
      display: flex;
      justify-content: center;
      .data-item {
        display: inline-block;
        background: #fff;
        padding: 18px;
        margin-right: 24px;
        flex-grow: 1;
        min-height: 188px;
        border-radius: 2px;
        min-width: 23%;
        .title {
          color: rgba(0,0,0,0.45);
        }
        .number {
          font-size: 30px;
          margin-top: 4px;
          span {
            font-size: 30px;
          }
        }
        .rate {
          margin-top: 12px;
          min-height: 12px;
          .rate-item {
            font-size: 14px;
            color: rgba(0,0,0,0.65);
            display: inline-block;
            padding-bottom: 8px;
            min-width: 100px;
            min-height: 22px;
            span {
              color: rgba(0,0,0,0.85);
              img {
                transform:rotate(180deg);
              }
            }
          }
          .rate-item:first-child {
            margin-right: 2vw;
          }
        }
        .rate3 {
          .rate-item {
            min-width: 100px;
            min-height: 22px;
          } 
        }
        .average {
          margin-top: 12px;
          border-top: 1px solid #E8E8E8;
          padding-top: 18px;
          color: rgba(0,0,0,0.65);
          display: flex;
          flex: 0 1 auto;
          span {
            color: rgba(0,0,0,0.85);
            margin-left: 8px;
          }
        }
      }
    }
    .chart-wrap {
      background: #fff;
      padding: 20px;
      border-radius: 2px;
      .title {
        span {
          display: inline-block;
          margin-right: 24px;
          cursor: pointer;
        }
        .active {
          color: #1890FF;
        }
      }
    }
  }

}
.marginLeft4 {
  margin-left: 4px;
}
.marginRight4 {
  margin-right: 4px;
}
</style>
