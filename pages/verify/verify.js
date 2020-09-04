// pages/verify/verify.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {Trans} from '../../transmit-module.js';
var app = getApp();
var trans=new Trans();

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
    rootUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      entryNo: options.entryNo,
      rootUrl: app.globalData.rootUrl
    });
    // console.log(this.data.entryNo);
    this.queryEntryDetail();
    this.queryEntryStatus();
    this.lockThisItem();
  },
  onUnload: function () {
    if(this.data.verifyStatus!='1' && this.data.verifyStatus!='2') {
      this.unlockThisItem();
    }
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
      this.setData({
        verifyStatus:data.verifyStatus
      });
    });
  },
  lockThisItem(){
    var api = this.data.rootUrl+'/weapp/lockThisItem/';
    var id = this.data.entryNo;
    console.log("lock");
    trans.transmitData(api,{entryNo:id},'',(data) => {
      // console.log(data);
      if(data == undefined || data==null || data == '') {
        // Dialog.alert({
        //   title: '数据同步失败，请稍后重试'
        // });
        return;
      }
    });
  },
  unlockThisItem(){
    var api = this.data.rootUrl+'/weapp/unlockThisItem/';
    var id = this.data.entryNo;
    trans.transmitData(api,{entryNo:id},'',(data) => {
      console.log("unlock");
      if(data == undefined || data==null || data == '') {
        // Dialog.alert({
        //   title: '数据同步失败，请稍后重试'
        // });
        return;
      }
    });
  },
  verifiedEntry(){
    Dialog.confirm({
      title: '确认通过'
    })
    .then(() => {
      // on confirm
      Dialog.close();
      var api = this.data.rootUrl+'/weapp/verifiedEntry/';
      var id = this.data.entryNo;
      this.setData({
        verifyStatus: "1"
      });
      trans.transmitData(api,{entryNo:id},'',(data) => {
        console.log(data);
        if(data == undefined || data==null || data == '') {
          // Dialog.alert({
          //   title: '数据同步失败，请稍后重试'
          // });
          return;
        }
        this.lockThisItem();
        wx.redirectTo({
          url: '/pages/me/me'
        });
      });
    })
    .catch(() => {
      // on cancel
      Dialog.close();
    });
  },
  unpassedEntry(){
    Dialog.confirm({
      title: '确认不通过'
    })
    .then(() => {
      // on confirm
      Dialog.close();
      var api = this.data.rootUrl+'/weapp/unpassedEntry/';
      var id = this.data.entryNo;
      this.setData({
        verifyStatus: "2"
      });
      trans.transmitData(api,{entryNo:id},'',(data) => {
        console.log(data);
        if(data == undefined || data==null || data == '') {
          // Dialog.alert({
          //   title: '数据同步失败，请稍后重试'
          // });
          return;
        }
        this.lockThisItem();
        wx.redirectTo({
          url: '/pages/me/me'
        });
      });
    })
    .catch(() => {
      // on cancel
      Dialog.close();
    });
  },
})