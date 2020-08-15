// pages/verify/verify.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {Trans} from '../../transmit-module.js';

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
    entryNo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      entryNo: options.entryNo
    });
    // console.log(this.data.entryNo);
    this.queryEntryDetail();
    this.queryEntryStatus();
    this.lockThisItem();
  },
  onUnload: function () {
    this.unlockThisItem();
  },
  onClickConfirm_1(e) {
    console.log();
    wx.navigateTo({
      url: '/pages/me/me',
    });
  },
  onClickConfirm_2(e) {
    Dialog.confirm({
      title: '确认通过'
    })
    .then(() => {
      Dialog.close();
      wx.navigateTo({
        url: '/pages/me/me',
      });
    })
    .catch(() => {
      Dialog.close();
    });
    console.log();
  },
  onClickConfirm_3(e) {
    Dialog.confirm({
      title: '确认不通过'
    })
    .then(() => {
      Dialog.close();
      wx.navigateTo({
        url: '/pages/me/me',
      });
    })
    .catch(() => {
      Dialog.close();
    });
    console.log();
  },
  queryEntryDetail(){
    var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/queryEntryDetail/';
    var id = this.data.entryNo;
    trans.transmitData(api,{entryNo:id},'',(data) => {
      console.log(data);
      if(data == undefined || data==null || data == '') {
        Dialog.alert({
          title: '数据同步失败，请稍后重试'
        });
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
    var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/queryEntryStatus/';
    var id = this.data.entryNo;
    trans.transmitData(api,{entryNo:id},'',(data) => {
      console.log(data);
      if(data == undefined || data==null || data == '') {
        Dialog.alert({
          title: '数据同步失败，请稍后重试'
        });
        return;
      }
      this.setData({
        verifyStatus:data.verifyStatus
      });
    });
  },
  lockThisItem(){
    var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/lockThisItem/';
    var id = this.data.entryNo;
    console.log("ssss");
    console.log(id);
    trans.transmitData(api,{entryNo:id},'',(data) => {
      // console.log(data);
      if(data == undefined || data==null || data == '') {
        Dialog.alert({
          title: '数据同步失败，请稍后重试'
        });
        return;
      }
    });
  },
  unlockThisItem(){
    var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/unlockThisItem/';
    var id = this.data.entryNo;
    trans.transmitData(api,{entryNo:id},'',(data) => {
      console.log(data);
      if(data == undefined || data==null || data == '') {
        Dialog.alert({
          title: '数据同步失败，请稍后重试'
        });
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
        var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/verifiedEntry/';
        var id = this.data.entryNo;
        trans.transmitData(api,{entryNo:id},'',(data) => {
          console.log(data);
          if(data == undefined || data==null || data == '') {
            Dialog.alert({
              title: '数据同步失败，请稍后重试'
            });
            return;
          }
          wx.navigateTo({
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
      var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/unpassedEntry/';
      var id = this.data.entryNo;
      trans.transmitData(api,{entryNo:id},'',(data) => {
        console.log(data);
        if(data == undefined || data==null || data == '') {
          Dialog.alert({
            title: '数据同步失败，请稍后重试'
          });
          return;
        }
        wx.navigateTo({
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