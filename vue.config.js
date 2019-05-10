/*
 * @Author: wuhaiwei 
 * @Date: 2018-10-23 14:36:27 
 * @Last Modified by: wuhaiwei
 * @Last Modified time: 2018-11-07 18:23:41
 */
/**
 * 用于配置vue-cli3 的webpack配置
 * 具体配置详见 https://cli.vuejs.org/zh/config/
 */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const baseUrl = require('./src/assets/config/index');
const baseUrl = process.env.NODE_ENV === 'production' ? 'http://cs-bot.aqara.cn:80/bot' : 'http://192.168.100.58:8080/bot';
module.exports = {
  css: {
    
    // modules: true, //设置会影响iview主题
		// css预设器配置项
		loaderOptions: {
			less: {
        javascriptEnabled: true
      }
		}
	},
  devServer: {
    host: '0.0.0.0',
    port: '8086',
    open: true,
    proxy: { // 配置跨域
      '/bot': {
        target: baseUrl,
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/bot': ''
        }
      }
    }
  },
  configureWebpack: {
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_console: true,//console
              drop_debugger: false,
              pure_funcs: ['console.log']//移除console
            }
          }
      })
    ]
    }
  }
};
