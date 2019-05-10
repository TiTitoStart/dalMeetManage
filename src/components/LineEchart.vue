<template>
  <div class="line-chart">
    <div class="title-center">总消息量</div>
    <ve-line :data="chartData" :settings="chartSettings" :colors="colors" :legend="legend" :extend="extend"></ve-line>
  </div>  
</template>
<script>
import 'echarts/lib/component/dataZoom';
export default {
  data() {
    this.chartSettings = {
      labelMap: {
        'date': '日期',
        'nowNum': '当天访问量',
        'averageNum': '近七日平均值'
      },
      // metrics: ['当天', '最近七天平均值'],
      dimension: ['date']
    };
    this.dataZoom = [
      {
        type: 'slider'
      }
    ];
    this.colors = ['#1890ff', '#49ca70'];
    this.legend = {
      itemWidth: 6,
      itemHeight: 6,
      data: [{name:'当天访问量',icon:'circle'}, {name:'近七日平均值',icon:'circle'}],
      right: '4%',
      textStyle: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.65)'
      }
    };
    this.extend = {
      series: {
        symbol: 'circle',
        symbolSize: 2,
        smooth: false,
        itemStyle:{ // 转折点 控制
          emphasis: {
             borderColor:'#fff'
          }
        }
      }
    };
    return {
      chartData: {
        columns: ['date', 'nowNum', 'averageNum'],
        rows: [
          { 'date': '1/1', 'nowNum': 1393, 'averageNum': 1093 },
          { 'date': '1/2', 'nowNum': 3530, 'averageNum': 3230 },
          { 'date': '1/3', 'nowNum': 2923, 'averageNum': 2623 },
          { 'date': '1/4', 'nowNum': 1723, 'averageNum': 1423 },
          { 'date': '1/5', 'nowNum': 3792, 'averageNum': 3492},
          { 'date': '1/6', 'nowNum': 4593, 'averageNum': 4293}
        ]
      }
    };
  }
};
</script>
<style lang="less" scoped>
.line-chart {
  margin-top: -20px;
  // width: 600px;
  // height: 300px;
  .title-center {
    text-align: center;
    width: 100%;
    font-weight: 600;
    font-size: 14px;
  }
} 
</style>
