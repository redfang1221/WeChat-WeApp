// pages/test/test.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rootUrl: ''
  },
  contactUs:function(){
    wx.makePhoneCall({
      phoneNumber: '18306101098',
      fail: (res) => {
        wx.redirectTo({
          url: '/pages/menu/menu'
        })
      }
    })
  },
  order:function(){
    wx.showToast({
      icon: 'none',
      title: '敬请期待'
    })
    // wx.navigateTo({
    //   url: '/pages/order/order'
    // })
  },
  onLoad: function() {
    this.setData({
      rootUrl: app.globalData.rootUrl
    })
  },
  onUnload: function () {
    
  },
  entry:function(){
    wx.navigateTo({
      url: '/pages/entry/entry'+'?modify=0'
    })
  },
  me:function(){
    wx.redirectTo({
      url: '/pages/me/me'
    })
  }
})