/**
 * 配置开发环境地址
 */

const options = {
  // 本地环境
  localUrl: '//127.0.0.1:4400/api',

  // 线上环境
  // baseUrl: `${location.hostname}`
  // baseUrl: 'http://alab-cs-bot-server.lumi-bigdata.svc.cluster.local:80/bot'
  baseUrl: '//127.0.0.1:4400/api'
};
// const baseUrl = process.env.NODE_ENV === 'production' ? options.baseUrl : options.localUrl;
// baseUrl;
export const baseUrl =
  process.env.NODE_ENV === 'production' ? options.baseUrl : options.localUrl;