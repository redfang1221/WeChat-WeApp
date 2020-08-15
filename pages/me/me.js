import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

import {Trans} from '../../transmit-module.js';

var trans=new Trans();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    mainActiveIndex: 0,
    imageURL: 'https://img.yzcdn.cn/upload_files/2017/07/02/af5b9f44deaeb68000d7e4a711160c53.jpg',
    avatar:'',
    nickName:'',
    tel:'',
    entryList:[],
    verifyEntryList:[],
    isAdmin:false
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },
  onClickItem({ detail = {} }) {
    const { activeId } = this.data;
    const index = activeId.indexOf(detail.id);
    if (index > -1) {
      activeId.splice(index, 1);
    } else {
      activeId.push(detail.id);
    }
    this.setData({ activeId });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryMyInfo();
    this.isAdminOrNot();
    this.queryEntryList();
    this.queryVerifiedEntryList();
  },
  backTpMenu: function(){
    wx.navigateTo({
      url: '/pages/menu/menu',
    })
  },
  directToDetail: function(arg){
    console.log(arg.currentTarget.dataset.message);
    var id = arg.currentTarget.dataset.message;
    wx.navigateTo({
      url: '/pages/entryDetail/entryDetail'+'?entryNo='+id,
    })
  },
  directToVerify: function(arg){
    console.log(arg.currentTarget.dataset.message);
    var id = arg.currentTarget.dataset.message;
    wx.navigateTo({
      url: '/pages/verify/verify'+'?entryNo='+id,
    })
  },
  queryMyInfo(){
    var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/queryMyInfo/'
    trans.transmitData(api,{},'',(data) => {
      console.log(data);
      if(data == undefined || data==null) {
        Dialog.alert({
          title: '数据同步失败，请稍后重试'
        });
        this.setData({
          avatar:this.data.imageURL,
          tel:'',
          nickName:'昵称'
        });
        return;
      }
      this.setData({
        avatar:data.avatarUrl,
        tel:data.phoneNumber,
        nickName:data.nickName
      });
    });
  },
  swipeEntry(event) {
    var id = event.currentTarget.dataset.message;
    const { position, name } = event.detail;
    switch (position) {
      case 'right':
        //从后台读取数据
        Dialog.confirm({
          title: '确认删除'
        })
        .then(() => {
          Dialog.close();
          var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/removeEntry/';
          trans.transmitData(api,{entryNo:id},'',(data) => {
            if(data == undefined || data==null) {
              Dialog.alert({
                title: '数据同步失败，请稍后重试'
              });
              return;
            } 
            this.queryEntryList();
          });
        })
        .catch(() => {
          Dialog.close();
        });
        this.onLoad();
        break;
    }
  },
  swipeEntryVerify(event) {
    var id = event.currentTarget.dataset.message;
    const { position, name } = event.detail;
    switch (position) {
      case 'right':
        //从后台读取数据
        Dialog.confirm({
          title: '确认删除'
        })
        .then(() => {
          Dialog.close();
          var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/removeVerifyEntry/';
          trans.transmitData(api,{entryNo:id},'',(data) => {
            if(data == undefined || data==null) {
              Dialog.alert({
                title: '数据同步失败，请稍后重试'
              });
              return;
            }
            this.queryVerifiedEntryList();
          });
        })
        .catch(() => {
          Dialog.close();
        });
        this.onLoad();
        break;
    }
  },
  queryEntryList(){
    var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/queryEntryList/';
    trans.transmitData(api,{},'',(data) => {
      if(data == undefined || data==null) {
        Dialog.alert({
          title: 'cc数据同步失败，请稍后重试'
        });
        return;
      }
      this.setData({
        entryList:data
      });
    });
  },
  queryVerifiedEntryList(){
    var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/queryVerifiedEntryList/';
    trans.transmitData(api,{},'',(data) => {
      console.log(data);
      if(data == undefined || data==null) {
        Dialog.alert({
          title: '数据同步失败，请稍后重试'
        });
        return;
      }
      this.setData({
        verifyEntryList:data
      });
    });
  },
  isAdminOrNot(){
    var api = 'http://47.100.22.17:80/template-0.0.1-SNAPSHOT/weapp/isEntryAdmin/';
    trans.transmitData(api,{},'',(data) => {
      if(data == undefined || data==null) {
        Dialog.alert({
          title: 'bb数据同步失败，请稍后重试'
        });
        return;
      }
      if(data.id=='0'){
        this.setData({
          isAdmin:true
        });
      }
    });
  }
})