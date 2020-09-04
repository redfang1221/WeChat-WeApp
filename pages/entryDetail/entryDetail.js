import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {Trans} from '../../transmit-module.js';
var trans=new Trans();
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate:'',
    entryManager:'',
    deptName:'',
    projName:'',
    contact:'',
    tel:'',
    email:'',
    staff:'',
    description:'',
    requirement:'',
    date:'',
    verifyStatus:'',
    entryNo:'',
    lock:true,
    rootUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      entryNo: options.entryNo,
      rootUrl: app.globalData.rootUrl
    });
    this.checkEntryLock();
    this.queryEntryDetail();
    this.queryEntryStatus();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onClickConfirm(e) {
    Dialog.confirm({
      title: '确认修改'
    })
    .then(() => {
      Dialog.close();
      wx.navigateTo({
        url: '/pages/entry/entry'+'?modify=1'+'&entryNo='+this.data.entryNo,
      });
    })
    .catch(() => {
      Dialog.close();
    });
    console.log();
  },
  queryEntryDetail(){
    var api = this.data.rootUrl+'/weapp/queryEntryDetail/';
    var id = this.data.entryNo;
    trans.transmitData(api,{entryNo:id},'',(data) => {
      console.log(data);
      if(data == undefined || data==null || data == '') {
        // Dialog.alert({
        //   title: '数据同步失败，请稍后重试'
        // });
        return;
      }
      this.setData({
        currentDate:data.currentDate,
        entryManager:data.entryManager,
        deptName:data.deptName,
        projName:data.projName,
        contact:data.contact,
        tel:data.tel,
        email:data.email,
        staff:data.staff,
        description:data.description,
        requirement:data.requirement,
        date:data.date
      });
    });
  },
  queryEntryStatus(){
    var api = this.data.rootUrl+'/weapp/queryEntryStatus/';
    var id = this.data.entryNo;
    trans.transmitData(api,{id:id},'',(data) => {
      console.log(data);
      if(data == undefined || data==null || data == '') {
        // Dialog.alert({
        //   title: '数据同步失败，请稍后重试'
        // });
        return;
      }
      console.log(data);
      this.setData({
        verifyStatus:data.verifyStatus
      });
    });
  },
  checkEntryLock(){
    var api = this.data.rootUrl+'/weapp/checkEntryLock/';
    var id = this.data.entryNo;
    console.log(id);
    trans.transmitData(api,{entryNo:id},'',(data) => {
      if(data == undefined || data==null || data == '') {
        // Dialog.alert({
        //   title: '数据同步失败，请稍后重试'
        // });
        return;
      }
      console.log(data);
      var temp = true;
      console.log(data.lock);
      if(data.lock == '0') {
        temp = false;
        this.setData({
          lock:false
        });
      }
    });
  }
})