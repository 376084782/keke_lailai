const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  productionSourceMap: false,
  lintOnSave: false,
  chainWebpack: (config) => {
    console.log(111)
    config.resolve.alias
      .set('@', resolve('src'))
      .set('styles', resolve('src/styles'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('utils', resolve('src/utils'))
      .set('urlConfig', resolve('src/utils/urlConfig'))
      .set('ajax', resolve('src/utils/ajax'))
      .set('views', resolve('src/views'))
      .set('store', resolve('src/store'))
  },
  devServer: {
    disableHostCheck: true,
    proxy: 'https://test-ztaudio-api.qianyancm.com/'
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 75, // 閹广垻鐣婚惃鍕唨閺侊拷
            propList: ['*'],
          }),
        ]
      }
    }
  },
}
