// pages/user/advice/advice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  bindFormSubmit: function(e) {
    if (e.detail.value.textarea === "") {
      wx.showToast({
        title: "亲亲,内容不能为空哦~",
        icon: 'none',
        duration: 2000
      })
    } else {
      const db = wx.cloud.database()
      db.collection('advice').add({
        data: {
          point: e.detail.value.textarea
        },
        success: res => {
          this.setData({
            pointId: res._id,
            point: 1
          })
          wx.showToast({
            title: "正在提交",
            icon: 'loading',
            duration: 3000
          });
          setTimeout(function() {
            wx.redirectTo({
              url: 'submitted/submitted'
            })
          }, 3000)
          console.log('已成功添加建议: "', e.detail.value.textarea,'"')
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '意见或建议',
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