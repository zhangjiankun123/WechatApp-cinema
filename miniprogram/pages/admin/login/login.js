  // pages/admin/login/login.js
  var util = require('../../../utils/md5.js');
  var app = getApp()

  Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      wx.setNavigationBarTitle({
        title: '后台管理系统',
      })
      const db = wx.cloud.database();
      db.collection('admin').get().then(res => {
        wx.setStorageSync("admin", res.data)
      })
    },
    formSubmit: function(e) {
      const admin = wx.getStorageSync('admin')
      // 对密码进行md5加密
      var username = e.detail.value.username
      var password = util.hexMD5(e.detail.value.password)
      for (var i = 0; i < admin.length; i++) {
        wx.showToast({
          title: "正在登录",
          icon: 'loading',
          duration: 2000
        })
        if (admin[i].username == username && admin[i].password == password) {
          console.log('正确')
          setTimeout(function() {
            wx.showToast({
              title: "登录成功",
              icon: 'success',
              duration: 2000
            })
          }, 2000)
          setTimeout(function() {
            wx.navigateTo({
              url: '../admin',
            })
          }, 2000)
          wx.setStorageSync('cinema_id', admin[i].cinema_id)
          break;
        } else {
          console.log('错误')
          setTimeout(function() {
            wx.showToast({
              title: '账号或密码错误!',
              icon: 'none'
            })
          }, 2000)
        }
      }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
  })