//app.js
var util = require('./utils/util.js');

App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getSystemInfo();
    wx.login({
      success: res => {
        //保存sessionid值
        console.log(res) 
        wx.hideLoading();
        //获取登录的临时凭证code
        var code = res.code
        //调用后端，获取微信的session_key,secret
        wx.request({
          url:"http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/login?code="+code,
          method:"POST",
          success: function(result){
            wx.removeStorageSync(result.header["Cookie"]);//每次登录时清除缓存
            console.log(result);
            wx.setStorageSync('sessionid', result.header["Cookie"]); //保存Cookie到Storage
            console.log(result);
            //获取用户信息
            // wx.getSetting({
            //   success: res => {
            //     if (res.authSetting['scope.userInfo']) {
            //       wx.getUserInfo({
            //         success: res => {
            //           var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/loginUserInfo/'
            //           var info = that.globalData.userInfo
            //           var success = util.transmitData(api,info,'');
            //           if(success == 'error') {
            //             Dialog.alert({
            //               title: '未成功获取权限，请稍后重试'
            //             });
            //             return;
            //           }
            //         }
            //       })
            //     }
            //   }
            // })
          }
        })
          }
        })

  },
  globalData: {
    userInfo: {},
    isLogin:false
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  }
})