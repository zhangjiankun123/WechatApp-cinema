// pages/movie/movie-detail/movie-detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wantStatus: false,
    collectStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const movie = wx.getStorageSync('movie')
    const movie_id = wx.getStorageSync('movie_id')
    //操作后刷新数据库
    const db = wx.cloud.database();
    db.collection('user').where({
      _openid: wx.getStorageSync('openid')
    }).get().then(res => {
      wx.setStorageSync('user', res.data)
    })
    const user = wx.getStorageSync('user')[0]
    const user__id = user._id
    wx.setStorageSync('user__id', user__id)
    let wantStatus, collectStatus, i_movie = 0
    user.status.forEach(function(v_status) {
      i_movie++;
      if (v_status.movie_id == movie_id) {
        wantStatus = v_status.wantStatus
        collectStatus = v_status.collectStatus
        wx.setStorageSync('i_movie', i_movie)
        console.log(i_movie)
      }
    })
    this.data.wantStatus = wantStatus
    this.data.collectStatus = collectStatus
    this.setData({
      movie: movie[movie_id - 1],
      wantStatus: this.data.wantStatus,
      collectStatus: this.data.collectStatus
    })
    wx.setStorageSync('wantStatus', wantStatus)
    wx.setStorageSync('collectStatus', collectStatus)
    wx.setNavigationBarTitle({
      title: movie[movie_id - 1].title,
    })
  },
  onWantTap: function() {
    const db = wx.cloud.database()
    //读取缓存中的user__id跟状态
    const user__id = wx.getStorageSync('user__id')
    const i_movie = wx.getStorageSync('i_movie') - 1
    if (!this.data.wantStatus) {
      db.collection('user').doc(user__id).update({
        data: {
          status: {
            [i_movie]: {
              wantStatus: true
            }
          }
        },
        success: res => {
          this.setData({
            wantStatus: true
          })
          wx.setStorageSync('wantStatus', true)
          wx.showToast({
            title: "已标记想看",
            duration: 1000,
            icon: "true",
            mask: true
          })
        }
      })
    } else {
      db.collection('user').doc(user__id).update({
        data: {
          status: {
            [i_movie]: {
              wantStatus: false
            }
          }
        },
        success: res => {
          this.setData({
            wantStatus: false
          })
          wx.setStorageSync('wantStatus', false)
          wx.showToast({
            title: "已取消想看",
            duration: 1000,
            icon: "true",
            mask: true
          })
        }
      })
    }
    //重读数据库，更新缓存中user表数据
    db.collection('user').where({
      _openid: wx.getStorageSync('openid')
    }).get().then(res => {
      wx.setStorageSync('user', res.data)
    })
  },
  onCollectTap: function() {
    const db = wx.cloud.database()
    //读取缓存中的user__id跟状态
    const user__id = wx.getStorageSync('user__id')
    const i_movie = wx.getStorageSync('i_movie') - 1
    if (!this.data.collectStatus) {
      db.collection('user').doc(user__id).update({
        data: {
          status: {
            [i_movie]: {
              collectStatus: true
            }
          }
        },
        success: res => {
          this.setData({
            collectStatus: true
          })
          wx.setStorageSync('collectStatus', true)
          wx.showToast({
            title: "已收藏成功",
            duration: 1000,
            icon: "true",
            mask: true
          })
        }
      })
    } else {
      db.collection('user').doc(user__id).update({
        data: {
          status: {
            [i_movie]: {
              collectStatus: false
            }
          }
        },
        success: res => {
          this.setData({
            collectStatus: false
          })
          wx.setStorageSync('collectStatus', false)
          wx.showToast({
            title: "已取消收藏",
            duration: 1000,
            icon: "true",
            mask: true
          })
        }
      })
    }
    db.collection('user').where({
      _openid: wx.getStorageSync('openid')
    }).get().then(res => {
      wx.setStorageSync('user', res.data)
    })
  },
  onTapToChooseCinema: function() {
    setTimeout(function() {
      wx.navigateTo({
        url: '../../choose/choose-cinema/choose-cinema'
      })
    }, 1000)
    wx.showToast({
      title: "正在努力加载",
      duration: 1000,
      icon: "loading",
      mask: true
    })
  },
  previewImage: function(event) {
    var httpUrl = 'cloud://fyj19961225-03d3fd.6679-fyj19961225-03d3fd' + event.currentTarget.dataset.src;
    console.log(httpUrl);
    wx.previewImage({
      current: httpUrl, // 当前显示图片的http链接
      urls: [httpUrl] 
      // 需要预览的图片http链接列表
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