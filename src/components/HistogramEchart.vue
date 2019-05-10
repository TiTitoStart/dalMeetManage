<template>
  <div class="histogram-chart">
    <div class="title-center">总消息量</div>
    <ve-histogram :loading="isLoading" :data="chartData" :settings="chartSettings" :colors="colors" :legend="legend" :extend="extend"  :yAxis="yAxis"></ve-histogram>
  </div>  
</template>
<script>
export default {
  props: ['statisticsData'],
  data() {
    this.chartSettings = {
      showLine: ['session'],
      labelMap: {
        'datetime': '日期',
        'session': '会话数',
        'recorder': '消息量'
      },
      dimension: ['datetime'],
    };
    // this.yAxis = [{
    //   type : 'value',
    //   name : '消息量',
    //   position : 'left',
    //   min: this.statisticsData.recorder_min,
    //   max: this.statisticsData.recorder_max,
    //   splitNumber: 5,
    //   interval: (this.statisticsData.recorder_max - this.statisticsData.recorder_min) / 5,
    //   axisLine : {
    //     lineStyle : {}
    //   },
    //   axisLabel : {
    //     formatter : '{value}'
    //   },
    //   axisTick: {
    //     show: false
    //   },
    //   splitLine: {
    //     lineStyle: {
    //       type:'dotted'
    //     }
    //   }
    // }, {
    //   type : 'value',
    //   name : '会话数',
    //   position : 'right',
    //   min: this.statisticsData.session_min,
    //   max: this.statisticsData.session_max,
    //   splitNumber: 5,
    //   interval: (this.statisticsData.session_max - this.statisticsData.session_min) / 5,
    //   axisLine : {
    //     lineStyle : {}
    //   },
    //   axisLabel : {
    //     formatter : '{value}'
    //   },
    //   axisTick: {
    //     show: false
    //   },
    //   splitLine: {
    //     lineStyle: {
    //       type:'dotted'
    //     }
    //   }
    // }];
    this.colors = ['#1890ff', '#49ca70'];
    this.legend = {
      itemWidth: 6,
      itemHeight: 6,
      data: [{name:'会话数',icon:'circle'}, {name:'消息量',icon:'circle'}],
      // data : [ '会话数','消息量' ],
      right: '4%',
      textStyle: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.65)'
      }
    };
    this.extend = {
      series (v) {
        v.forEach((i, index) => {
          i.symbol = 'circle';
          i.barWidth = 25;
          i.symbolSize = 5;
          i.itemStyle = { 
            emphasis: {
              // symbolSize: 8,
              borderColor:'#fff'
            }
          };
          if(index === 0) {
            i.yAxisIndex = 1;
          }
        })
        return v;
      },
    };
    return {
      isLoading: false,
      chartData: {
        columns: ['datetime', 'session', 'recorder'],
        rows: this.statisticsData.trend
      },
      yAxis : [{
      type : 'value',
      name : '消息量',
      position : 'left',
      min: 0,
      max: this.statisticsData.recorder_max + (5 -this.statisticsData.recorder_max % 5),
      splitNumber: 5,
      interval: (this.statisticsData.recorder_max + (5 -this.statisticsData.recorder_max % 5)) / 5,
      axisLine : {
        lineStyle : {}
      },
      axisLabel : {
        formatter : '{value}'
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          type:'dotted'
        }
      }
    }, {
      type : 'value',
      name : '会话数',
      position : 'right',
      min: 0,
      max: this.statisticsData.session_max + (5 - this.statisticsData.session_max % 5),
      splitNumber: 5,
      interval: (this.statisticsData.session_max + (5 - this.statisticsData.session_max % 5)) / 5,
      axisLine : {
        lineStyle : {}
      },
      axisLabel : {
        formatter : '{value}'
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          type:'dotted'
        }
      }
    }]
    };
  },
  watch: {
    statisticsData(newVal, oldVal) {
      this.chartData.rows = newVal.trend;
      this.yAxis[0].max = newVal.recorder_max + (5 - newVal.recorder_max % 5);
      this.yAxis[0].interval = (newVal.recorder_max + (5 - newVal.recorder_max % 5)) / 5 ;
      this.yAxis[1].max = newVal.session_max + (5 - newVal.session_max % 5);
      this.yAxis[1].interval = (newVal.session_max + (5 - newVal.session_max % 5)) / 5;
      return newVal;
      if(newVal) {
        this.isLoading = false;
      }
      else {
        this.isLoading = true;
      }
    }
  },
  methods: {
  }
};
</script>
<style lang="less" scoped>
.histogram-chart {
  margin-top: -20px;
  height: 100%;
  width: 100%;
  .title-center {
    text-align: center;
    width: 100%;
    font-weight: 600;
    font-size: 14px;
  }
} 
</style>
