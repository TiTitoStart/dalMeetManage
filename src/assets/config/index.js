/**
 * 配置开发环境地址
 */

const options = {
  // 本地环境
  localUrl: 'http://192.168.100.58:8080/bot',

  // 线上环境
  // baseUrl: `${location.hostname}`
  // baseUrl: 'http://alab-cs-bot-server.lumi-bigdata.svc.cluster.local:80/bot'
  baseUrl: '//cs-bot.aqara.cn:80/bot'
};
// const baseUrl = process.env.NODE_ENV === 'production' ? options.baseUrl : options.localUrl;
// baseUrl;
export const myBaseUrl =
  process.env.NODE_ENV === 'production' ? options.baseUrl : options.localUrl;