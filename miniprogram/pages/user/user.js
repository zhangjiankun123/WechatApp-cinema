// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    api: [{
        title: '管理电影',
        tap: 'onTapToAdmin'
      },
      {
        title: '我的订单',
        tap: 'onTapToOrder'
      },
      {
        title: '想看的电影',
        tap: 'onTapToWant'
      },
      {
        title: '收藏的电影',
        tap: 'onTapToCollect'
      },
      {
        title: '给我们的意见或建议',
        tap: 'onTapToAdvice'
      }
    ],

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取数据库数组
    const db = wx.cloud.database();
    db.collection('movie').get().then(res => {
      wx.setStorageSync("movie", res.data)
    })
    db.collection('cinema').get().then(res => {
      wx.setStorageSync("cinema", res.data)
    })
    db.collection('cinema_movie').get().then(res => {
      wx.setStorageSync("cinema_movie", res.data)
    })
    db.collection('user').get().then(res => {
      wx.setStorageSync("userList", res.data)
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.setNavigationBarTitle({
      title: '我的',
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    const db = wx.cloud.database();
    const _ = db.command
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.setStorageSync('openid', res.result.openid)
        const userList = wx.getStorageSync('userList')
        if (userList.length > 0) {
          userList.forEach(function(v_user) {
            if (v_user._openid == res.result.openid) {
              console.log('用户已存在，无需再次添加')
            } else {
              db.collection('user').add({
                data: {
                  user_id: userList.length + 1,
                  status: []
                },
                success(res) {
                  console.log('添加新用户成功')
                  let movie = wx.getStorageSync('movie')
                  movie.forEach(function(v_movie) {
                    db.collection('user').doc(res._id).update({
                      data: {
                        status: _.push({
                          movie_id: v_movie.movie_id,
                          wantStatus: false,
                          collectStatus: false
                        })
                      }
                    })
                  })
                }
              })
            }
          })
          db.collection('user').where({
            _openid: res.result.openid
          }).get().then(res => {
            console.log(res.data)
            wx.setStorageSync('user', res.data)
          })
        } else {
          db.collection('user').add({
            data: {
              user_id: userList.length + 1,
              status: []
            },
            success(res) {
              console.log('添加新用户成功')
              let movie = wx.getStorageSync('movie')
              movie.forEach(function(v_movie) {
                db.collection('user').doc(res._id).update({
                  data: {
                    status: _.push({
                      movie_id: v_movie.movie_id,
                      wantStatus: false,
                      collectStatus: false
                    })
                  }
                })
              })

            }
          })
          db.collection('user').where({
            _openid: res.result.openid
          }).get().then(res => {
            console.log(res.data)
            wx.setStorageSync('user', res.data)
          })
        }
      }
    })
  },
  onTapToAdmin: function() {
    try {
      const _openid = wx.getStorageSync('openid')
      if (_openid) {
        wx.navigateTo({
          url: '../admin/login/login',
        })
      } else {
        wx.showToast({
          title: '请先进行微信授权',
          icon: 'none'
        })
      }
    } catch (e) {}
  },
  onTapToOrder: function() {
    try {
      const _openid = wx.getStorageSync('openid')
      if (_openid) {
        wx.navigateTo({
          url: 'order/order',
        })
      } else {
        wx.showToast({
          title: '请先进行微信授权',
          icon: 'none'
        })
      }
    } catch (e) {}
  },
  onTapToWant: function() {
    try {
      const _openid = wx.getStorageSync('openid')
      if (_openid) {
        wx.navigateTo({
          url: 'want/want',
        })
      } else {
        wx.showToast({
          title: '请先进行微信授权',
          icon: 'none'
        })
      }
    } catch (e) {}
  },
  onTapToCollect: function() {
    try {
      const _openid = wx.getStorageSync('openid')
      if (_openid) {
        wx.navigateTo({
          url: 'collect/collect',
        })
      } else {
        wx.showToast({
          title: '请先进行微信授权',
          icon: 'none'
        })
      }
    } catch (e) {}
  },
  onTapToAdvice: function() {
    wx.navigateTo({
      url: 'advice/advice',
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