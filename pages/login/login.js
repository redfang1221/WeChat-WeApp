// pages/login/login.js
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    phoneNo:'',
    showAuth: true,
    showUserAuth: false,
    showPhoneAuth: false,
    waitLogin:true,
    rootUrl: ''
  },
  getPhoneNumber:function(e) {
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: this.data.rootUrl+'/weapp/decodePhoneNumber',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        header:{
          'content-type':'application/json',
          'Cookie': wx.getStorageSync('sessionid')//读取sessionid,当作cookie传入后台将PHPSESSID做session_id使用
        },
        method: "post",
        success: function (res) {
          console.log(res.data);
          that.setData({
            phoneNo: res.data,
            showPhoneAuth: true
          });
          if(that.data.showPhoneAuth==true && that.data.showUserAuth==true){
            that.setData({
              showAuth: false
            })
          }
        }
      })
    }
  },
  onGetUserInfo:function(e) {
    var that = this;
    that.setData({
      userInfo: e.detail.userInfo,
      showUserAuth: true
    });
    // 像后端传数据
    //后端交互，上传数据
    var api = this.data.rootUrl+'/weapp/loginUserInfo/'
    var info = that.data.userInfo
    var success = util.transmitData(api,info,'');
    if(success == 'error') {
      that.setData({
        showUserAuth: false
      });
      Dialog.alert({
        title: '未成功获取权限，请稍后重试'
      });
      return;
    }
    if(that.data.showPhoneAuth==true && that.data.showUserAuth==true){
      that.setData({
        showAuth: false
      })
    }
  },
  onLoad:function(){
      setTimeout(this.wait,2000);
      this.setData({
        rootUrl: app.globalData.rootUrl
      })
  },
  wait:function(){
    this.setData({
      waitLogin:false
    });
  },
  directToMenu:function() {
    wx.reLaunch({
      url: '/pages/menu/menu'
    })
  }
})

