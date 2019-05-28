// miniprogram/pages/user/order/order-detail/order-detail.js
var QRCode = require('../../../../utils/weapp-qrcode.js');

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
    const order = wx.getStorageSync('order')
    const order_id = wx.getStorageSync('order_id') - 1
    this.setData({
      order: order[order_id]
    })

    var qrcode = new QRCode('canvas', {
      text: order[order_id]._id,
      width: 150,
      height: 150,
      colorDark: "#000000",
      colorLight: "#ffffff"
    });

    wx.setNavigationBarTitle({
      title: '订单详情',
    })
  },
  onTapToCinema: function (e) {
    var cinema_id = e.currentTarget.dataset.cinemaId;
    wx.navigateTo({
      url: '../../../choose/choose-movie/choose-movie?id=' + cinema_id,
    })
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