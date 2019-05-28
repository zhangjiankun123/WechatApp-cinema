// miniprogram/pages/admin/add-movie/add-movie.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const db = wx.cloud.database();
    db.collection('movie').get().then(res => {
      wx.setStorageSync("movie", res.data)
    })
    const movie = wx.getStorageSync('movie')
    console.log(movie.length)
    this.data.length = String(movie.length + 1)
    console.log(this.data.length)
    wx.setNavigationBarTitle({
      title: '添加影片信息'
    })
  },

  // 判断电影是否存在
  bindKeyInput: function(e) {
    const title = e.detail.value
    const movie = wx.getStorageSync('movie');
    let exist = this.data.exist
    movie.forEach(function(value) {
      if (value.title == title) {
        exist = true
        wx.setStorageSync('movie_id', value.movie_id)
      }
    })
    if (exist) {
      wx.showModal({
        title: '该电影在影库已经存在',
        content: '无需重复添加',
        showCancel: true,
        cancelText: '关闭',
        confirmText: '确定',
        success: function(res) {
          wx.navigateTo({
            url: '../add-movie2/add-movie2'
          })
        },
      })
    }
  },
  // 选择日期
  chooseDate: function(e) {
    console.log('选择日期为', e.detail.value)
    this.setData({
      showtime: e.detail.value
    })
  },
  // 上传图片
  doUpload: function() {
    // 选择图片
    let length = this.data.length;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        // 定义上传路径命名
        const cloudPath = 'images/movie/movie' + length + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            wx.showToast({
              title: '图片上传成功',
            })
            console.log('[上传文件] 成功：', res)
            app.globalData.fileID = res.fileID
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  // 刷新封面url
  f5: function(e) {
    var img = app.globalData.fileID
    if (!img) {
      wx.showToast({
        title: '请先上传电影封面 ！',
        icon: 'none'
      })
    } else {
      this.setData({
        img: img
      })
    }
  },
  // 提交电影信息
  formSubmit: function(e) {
    var movie_id = this.data.length;
    wx.setStorageSync('movie_id', movie_id)
    var title = e.detail.value.title;
    var E_title = e.detail.value.E_title;
    var score = e.detail.value.score;
    // 把分数转成星星数
    var stars = [];
    if (score > 0 && score <= 10) {
      for (var i = 1; i <= score / 2; i++) {
        stars.push('1')
      }
      if (score % 2 > 0) {
        stars.push('0.5')
      }
      for (var j = 1; j < (10 - score) / 2; j++) {
        stars.push('0')
      }
    }
    var style = e.detail.value.style;
    var area = e.detail.value.area;
    var timelong = e.detail.value.timelong;
    var showtime = e.detail.value.showtime;
    var img = e.detail.value.img
    var vision = e.detail.value.vision
    var language = e.detail.value.language;
    var director = e.detail.value.director
    var actor = e.detail.value.actor
    var detail = e.detail.value.detail

    const db = wx.cloud.database();
    db.collection('movie').add({
      data: {
        "movie_id": movie_id,
        "title": title,
        "E_title": E_title,
        "stars": stars,
        "score": score,
        "style": style,
        "area": area,
        "timelong": timelong,
        "showtime": showtime,
        "img": img,
        "vision": vision,
        "language": language,
        "director": director,
        "actor": actor,
        "detail": detail
      },
      success: res => {
        wx.showToast({
          title: '正在保存',
          icon: 'loading',
          duration: 2000
        })
        setTimeout(function() {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
        }, 2000)
        setTimeout(function() {
          wx.navigateTo({
            url: '../add-movie2/add-movie2',
          })
        }, 4000)
      }
    })
    db.collection('movie').get().then(res => {
      wx.setStorageSync("movie", res.data)
    })
    console.log(e.detail.value)
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