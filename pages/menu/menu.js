// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  onUnload: function () {
    
  },
  entry:function(){
    wx.navigateTo({
      url: '/pages/entry/entry'+'?modify=0'
    })
  },
  me:function(){
    wx.navigateTo({
      url: '/pages/me/me'
    })
  }
})