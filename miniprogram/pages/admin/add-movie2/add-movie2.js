// miniprogram/pages/admin/add-movie2/add-movie2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    i: 3,
    start: [],
    ending: [],
    addSeat: [],
    addTime: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '添加场次'
    })
  },
  chooseStart(e) {
    this.data.start.push(e.detail.value)
    this.setData({
      start: this.data.start
    })
    console.log('开场时间', this.data.start)
  },
  chooseEnding(e) {
    this.data.ending.push(e.detail.value)
    this.setData({
      ending: this.data.ending
    })
    console.log('收场时间', this.data.ending)
  },
  add: function() {
    var i = this.data.i + 1;
    this.setData({
      i: i
    })
  },
  detel: function() {
    if (this.data.i > 1) {
      var i = this.data.i - 1;
      this.setData({
        i: i
      })
    } else {
      wx.showToast({
        title: '场次不能为零哦~',
        icon: 'none',
        duration: 3000
      })
    }
  },

  formConfirm: function(e) {
    // 获取刚刚添加电影的movie_id跟该影院的座位详情
    let movie_id = wx.getStorageSync('movie_id')
    let cinema_id = wx.getStorageSync('cinema_id')
    let cinema_movie = wx.getStorageSync('cinema_movie')
    let oldMovieList = cinema_movie[cinema_id - 1].movie
    this.data.addSeat = oldMovieList[0].time[0].seat

    var start = this.data.start;
    var ending = this.data.ending;
    var addTime = this.data.addTime;
    addTime["start"] = Object.assign(start)
    addTime["ending"] = Object.assign(ending)
    const keys = Object.keys(addTime);
    const lens = Object.keys(addTime[keys[0]]);
    let arrays = []
    for (const len of lens) {
      let o = {};
      for (const key of keys) {
        o[key] = addTime[key][len];
      }
      arrays.push(o);
    }
    for (var z in arrays) {
      arrays[z]["seat"] = Object.assign(this.data.addSeat)
    }
    var price = e.detail.value.price
    console.log(price)
    // 把场次合并为一个整体object对象
    var addMovie = {}
    addMovie["movie_id"] = movie_id
    addMovie["price"] = price
    addMovie["time"] = arrays
    console.log(addMovie)

    // 合并列表
    oldMovieList.push(addMovie)
    console.log(oldMovieList)
    // 更新数据库数据
    let cinema_movie_id = wx.getStorageSync('cinema_movie_id')
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('cinema_movie').doc(cinema_movie_id).update({
      data: {
        movie: oldMovieList
      },
      success: res => {
        wx.showToast({
          title: '添加场次成功',
          icon: 'success',
          duration: 3000
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '../admin'
          })
        },3000)
        db.collection('cinema_movie').get().then(res => {
          wx.setStorageSync("cinema_movie", res.data)
        })
      }
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