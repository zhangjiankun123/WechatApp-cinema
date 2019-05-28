// pages/user/want/want.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // i: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //操作后刷新数据库
    const db = wx.cloud.database();
    const movie = wx.getStorageSync('movie')
    db.collection('user').where({
      _openid: wx.getStorageSync('openid')
    }).get().then(res => {
      wx.setStorageSync('user', res.data)
    })
    const user = wx.getStorageSync('user')[0]
    let id_List = [],
      movieList = []
    user.status.forEach(function(v_status) {
      if (v_status.wantStatus === true) {
        id_List.push(v_status.movie_id)
      }
    })
    id_List.sort()
    console.log(id_List)
    id_List.forEach(function(v_id_List) {
      movie.forEach(function(v_movie) {
        if (v_movie.movie_id == v_id_List) {
          movieList.push(v_movie)
        }
      })
    })
    this.setData({
      movieList: movieList
    })

    wx.setNavigationBarTitle({
      title: '想看的电影'
    })
  },

  // 跳到对应电影详情页
  onTapToMovieDetail: function(event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.setStorageSync('movie_id', movieId)
    wx.navigateTo({
      url: '../../movie/movie-detail/movie-detail?id=' + movieId,
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
    wx.showNavigationBarLoading()
    //操作后刷新数据库
    const db = wx.cloud.database();
    const movie = wx.getStorageSync('movie')
    db.collection('user').where({
      _openid: wx.getStorageSync('openid')
    }).get().then(res => {
      wx.setStorageSync('user', res.data)
    })
    const user = wx.getStorageSync('user')[0]
    let id_List = [],
      movieList = []
    user.status.forEach(function (v_status) {
      if (v_status.wantStatus === true) {
        id_List.push(v_status.movie_id)
      }
    })
    id_List.sort()
    console.log(id_List)
    id_List.forEach(function (v_id_List) {
      movie.forEach(function (v_movie) {
        if (v_movie.movie_id == v_id_List) {
          movieList.push(v_movie)
        }
      })
    })
    this.setData({
      movieList: movieList
    })
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