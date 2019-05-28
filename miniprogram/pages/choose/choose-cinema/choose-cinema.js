// miniprogram/pages/choose/choose-cinema/choose-cinema.js
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

    //读缓存中的movie,cinema,cinema_movie表信息
    const movie = wx.getStorageSync('movie')
    const cinema = wx.getStorageSync('cinema')
    const cinema_movie = wx.getStorageSync('cinema_movie')
    //读缓存中的movie_id( movie => cinema )
    const movie_id = wx.getStorageSync('movie_id')
    //遍历出movie_id对应的所有影院加到cinemaList中
    var cinemaList = []
    cinema_movie.forEach(function(a) {
      let cinema_id = a.cinema_id
      a.movie.forEach(function(b) {
        if (movie_id == b.movie_id) {
          cinemaList.push(cinema[a.cinema_id - 1])
        }
      })
    })
    console.log(movie[movie_id - 1].title + ' 该电影对应的所有影院', cinemaList)
    this.setData({
      movie: movie[movie_id - 1],
      cinemaList: cinemaList,
      wantStatus: wx.getStorageSync('wantStatus'),
      collectStatus: wx.getStorageSync('collectStatus')
    })
    wx.setNavigationBarTitle({
      title: movie[movie_id - 1].title,
    })
  },

  onTapToChooseMovie: function(e) {
    var cinema_id = e.currentTarget.dataset.cinemaId;
    wx.setStorageSync('cinema_id', cinema_id)
    wx.navigateTo({
      url: '../choose-movie/choose-movie?id' + cinema_id,
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