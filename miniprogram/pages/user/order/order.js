// pages/user/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.openid = wx.getStorageSync('openid')
    const db = wx.cloud.database()
    db.collection('order').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        wx.setStorageSync('order', res.data)
        this.setData({
          order: res.data
        })
      }
    })
    wx.setNavigationBarTitle({
      title: '我的订单',
    })
  },
  onTapToCinema: function(e) {
    var cinema_id = e.currentTarget.dataset.cinemaId;
    wx.navigateTo({
      url: '../../choose/choose-movie/choose-movie?id=' + cinema_id,
    })
  },
  onTapToOrderDetail: function(e) {
    var order_id = e.currentTarget.dataset.orderNum;
    wx.setStorageSync('order_id', order_id)
    wx.navigateTo({
      url: 'order-detail/order-detail?id=' + order_id,
    })
    // console.log(orderNum)
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